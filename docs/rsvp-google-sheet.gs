/**
 * RSVP → Google Sheet, for rhaineharvy.vercel.app.
 *
 * Two tabs: "Overview" (the counts at a glance) and "Replies" (one row per
 * reply). Each reply from the site's form lands as a new row; Yes rows are
 * tinted green, No rows rose.
 *
 * Setup (once):
 *   1. Create a Google Sheet. Extensions → Apps Script.
 *   2. Delete what's there, paste this whole file, and save.
 *   3. Optional: put an email in NOTIFY_EMAIL to get one email per reply.
 *   4. Deploy → New deployment → type "Web app".
 *        Execute as: Me     Who has access: Anyone
 *      Authorize when asked: Advanced → "Go to … (unsafe)". It's your own script.
 *   5. Run setupSheet once (function dropdown → setupSheet → Run) to lay the
 *      Sheet out, then send the Web app URL (ends in /exec) to whoever wires
 *      up the site.
 *
 * If you edit this script later: Deploy → Manage deployments → edit (pencil) →
 * Version: New version. That keeps the same /exec URL.
 */

const NOTIFY_EMAIL = ""; // e.g. "rhaine@example.com" - leave "" for no emails
const SETUP_KEY = ""; // optional: lets ?setup=<key> on the /exec URL re-run setupSheet
const RSVP_BY = new Date(2027, 0, 5); // January 5, 2027
const TZ = "Asia/Manila";

const REPLIES = "Replies";
const OVERVIEW = "Overview";
const HEADERS = ["Received", "Guest name", "Coming?", "How many", "Their note"];
const WIDTHS = [170, 260, 110, 100, 420];

const WINE = "#6E1A2B";
const IVORY = "#FBF7F1";
const CREAM = "#F4ECE0";
const YES_BG = "#E3F1E4";
const YES_FG = "#1F6B33";
const NO_BG = "#F8E3E6";
const NO_FG = "#8F2B3C";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // two guests replying at once never overwrite a row
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (data.company) return reply({ ok: true }); // honeypot: a bot

    const name = clean(data.name, 120);
    if (!name) return reply({ ok: false, error: "name required" });
    const yes = data.attending === "yes";
    const count = yes ? Math.min(Math.max(Number(data.guests) || 1, 1), 10) : 0;
    const note = clean(data.message, 1000);

    const sh = replies();
    sh.appendRow([new Date(), name, yes ? "Yes" : "No", count, note]);
    styleRow(sh, sh.getLastRow());

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        `RSVP: ${name} - ${yes ? `coming (${count})` : "not coming"}`,
        `${name} ${yes ? `joyfully accepts - ${count} coming` : "regretfully declines"}.` +
          (note ? `\n\nTheir note:\n${note}` : "") +
          `\n\nAll replies: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}`,
      );
    }
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Opening the /exec URL in a browser says it's alive. */
function doGet(e) {
  if (SETUP_KEY && e && e.parameter && e.parameter.setup === SETUP_KEY) {
    setupSheet();
    return reply({ ok: true, setup: "done" });
  }
  return reply({ ok: true, service: "rsvp" });
}

function replies() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(REPLIES) || setupSheet().getSheetByName(REPLIES);
}

/** Lays out both tabs. Safe to run again: it only restyles, never drops a reply. */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone(TZ);
  ss.rename("Rhaine & Harvy · RSVPs");

  // ---------- Replies ----------
  const sh = ss.getSheetByName(REPLIES) || ss.insertSheet(REPLIES);
  migrateOldRows(sh);

  sh.getRange(1, 1, 1, HEADERS.length)
    .setValues([HEADERS])
    .setBackground(WINE)
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setFontSize(11)
    .setVerticalAlignment("middle");
  sh.setRowHeight(1, 40);
  sh.setFrozenRows(1);
  WIDTHS.forEach((w, i) => sh.setColumnWidth(i + 1, w));

  const body = sh.getRange(2, 1, sh.getMaxRows() - 1, HEADERS.length);
  body.setFontSize(11).setVerticalAlignment("middle").setFontColor("#2A1A1D");
  sh.getRange(2, 1, sh.getMaxRows() - 1, 1).setNumberFormat("mmm d, yyyy · h:mm am/pm");
  sh.getRange(1, 3, sh.getMaxRows(), 2).setHorizontalAlignment("center");
  sh.getRange(2, 5, sh.getMaxRows() - 1, 1).setWrap(true);
  sh.getRange(2, 4, sh.getMaxRows() - 1, 1).setNumberFormat('0;-0;"–"');

  // Yes rows green, No rows rose - the whole row, so it reads at a glance.
  const last = `$C2`;
  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(`=${last}="Yes"`)
      .setBackground(YES_BG)
      .setRanges([body])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(`=${last}="No"`)
      .setBackground(NO_BG)
      .setRanges([body])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Yes")
      .setFontColor(YES_FG)
      .setBold(true)
      .setRanges([sh.getRange(2, 3, sh.getMaxRows() - 1, 1)])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("No")
      .setFontColor(NO_FG)
      .setBold(true)
      .setRanges([sh.getRange(2, 3, sh.getMaxRows() - 1, 1)])
      .build(),
  ]);

  if (sh.getFilter()) sh.getFilter().remove();
  sh.getRange(1, 1, Math.max(sh.getLastRow(), 2), HEADERS.length).createFilter();
  for (let r = 2; r <= sh.getLastRow(); r++) styleRow(sh, r);
  sh.setTabColor(WINE);

  // ---------- Overview ----------
  const ov = ss.getSheetByName(OVERVIEW) || ss.insertSheet(OVERVIEW, 0);
  ov.clear();
  ov.setHiddenGridlines(true);
  ov.setTabColor("#C9A96E");
  ov.getRange("A1:D30").setBackground(IVORY).setFontColor("#2A1A1D").setVerticalAlignment("middle");
  ov.setColumnWidth(1, 28);
  ov.setColumnWidth(2, 300);
  ov.setColumnWidth(3, 160);
  ov.setColumnWidth(4, 28);

  ov.getRange("B2").setValue("Rhaine & Harvy").setFontFamily("Playfair Display").setFontSize(26).setFontColor(WINE);
  ov.getRange("B3").setValue("RSVPs · Saturday, February 13, 2027").setFontSize(11).setFontColor("#7A6A6D");
  ov.setRowHeight(2, 48);

  const R = `'${REPLIES}'`;
  const stats = [
    ["Guests coming", `=SUM(${R}!D2:D)`, "Everyone attending, counting each party's number"],
    ["Replies received", `=COUNTA(${R}!B2:B)`, ""],
    ["Joyfully accepting", `=COUNTIF(${R}!C2:C,"Yes")`, "Replies, not heads"],
    ["Regretfully declining", `=COUNTIF(${R}!C2:C,"No")`, ""],
    ["Days until the RSVP deadline", `=MAX(0, DATE(2027,1,5) - TODAY())`, "Reply by January 5, 2027"],
    ["Latest reply", `=IF(COUNTA(${R}!A2:A)=0, "–", MAX(${R}!A2:A))`, ""],
  ];
  stats.forEach(([label, formula, hint], i) => {
    const row = 5 + i * 2;
    ov.setRowHeight(row, i === 0 ? 56 : 40);
    ov.getRange(row, 2).setValue(label).setFontSize(i === 0 ? 14 : 12).setFontWeight(i === 0 ? "bold" : "normal");
    ov.getRange(row, 3)
      .setFormula(formula)
      .setHorizontalAlignment("right")
      .setFontSize(i === 0 ? 30 : 20)
      .setFontWeight("bold")
      .setFontColor(i === 0 ? WINE : "#2A1A1D");
    if (hint) ov.getRange(row + 1, 2).setValue(hint).setFontSize(9).setFontColor("#9A8A8D");
    ov.setRowHeight(row + 1, hint ? 18 : 8);
    ov.getRange(row, 2, 1, 2).setBorder(false, false, true, false, false, false, "#E6D9C7", SpreadsheetApp.BorderStyle.SOLID);
  });
  ov.getRange(5 + 5 * 2, 3).setNumberFormat("mmm d · h:mm am/pm").setFontSize(14);
  ov.getRange(5, 2, 1, 2).setBackground(CREAM);

  ov.getRange("B19")
    .setValue("Every reply from the website lands on the Replies tab: green = coming, rose = not coming. Use the filter arrows in its header to sort or narrow it down.")
    .setWrap(true)
    .setFontSize(10)
    .setFontColor("#7A6A6D");
  ov.getRange("B19:C19").merge();
  ov.setRowHeight(19, 48);

  // Drop the default empty tab a new Sheet starts with.
  const blank = ss.getSheetByName("Sheet1");
  if (blank && blank.getLastRow() === 0) ss.deleteSheet(blank);
  ss.setActiveSheet(ov);
  ss.moveActiveSheet(1);
  return ss;
}

/** Rows from the first version stored the time as text and "" for no count. */
function migrateOldRows(sh) {
  const n = sh.getLastRow() - 1;
  if (n < 1) return;
  const rng = sh.getRange(2, 1, n, HEADERS.length);
  const vals = rng.getValues().map((r) => {
    if (typeof r[0] === "string" && /^\d{4}-\d\d-\d\d \d\d:\d\d$/.test(r[0])) {
      const [d, t] = r[0].split(" ");
      const [y, m, day] = d.split("-").map(Number);
      const [hh, mm] = t.split(":").map(Number);
      r[0] = new Date(y, m - 1, day, hh, mm);
    }
    if (r[2] === "No" || r[3] === "") r[3] = r[2] === "Yes" ? 1 : 0;
    return r;
  });
  rng.setValues(vals);
}

function styleRow(sh, r) {
  sh.setRowHeight(r, 34);
}

/** Trim, cap the length, and stop a cell from being read as a formula. */
function clean(v, max) {
  const s = String(v == null ? "" : v).trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
