/**
 * RSVP → Google Sheet, for rhaineharvy.vercel.app.
 *
 * Setup (once):
 *   1. Create a Google Sheet. Extensions → Apps Script.
 *   2. Delete what's there, paste this whole file, and save.
 *   3. Optional: put an email in NOTIFY_EMAIL to get one email per reply.
 *   4. Deploy → New deployment → type "Web app".
 *        Execute as: Me     Who has access: Anyone
 *      Authorize when asked: Advanced → "Go to … (unsafe)". It's your own script.
 *   5. Copy the Web app URL (ends in /exec) and send it to whoever wires up the site.
 *
 * If you edit this script later: Deploy → Manage deployments → edit (pencil) →
 * Version: New version. That keeps the same /exec URL.
 */

const NOTIFY_EMAIL = ""; // one email per reply - "" turns it off
const SHEET_NAME = "Replies";
const HEADERS = ["Received (Manila)", "Name", "Attending", "How many", "Note"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // two guests replying at once never overwrite a row
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (data.company) return reply({ ok: true }); // honeypot: a bot

    const name = clean(data.name, 120);
    if (!name) return reply({ ok: false, error: "name required" });
    const yes = data.attending === "yes";

    const row = [
      Utilities.formatDate(new Date(), "Asia/Manila", "yyyy-MM-dd HH:mm"),
      name,
      yes ? "Yes" : "No",
      yes ? Number(data.guests) || 1 : "",
      clean(data.message, 1000),
    ];
    sheet().appendRow(row);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        `RSVP: ${name} - ${yes ? `yes (${row[3]})` : "no"}`,
        `${name} ${yes ? `joyfully accepts, ${row[3]} coming` : "regretfully declines"}.` +
          (row[4] ? `\n\nTheir note:\n${row[4]}` : "") +
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

/** Opening the /exec URL in a browser should say it's alive. */
function doGet() {
  return reply({ ok: true, service: "rsvp" });
}

function sheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sh;
}

/** Trim, cap the length, and stop a cell from being read as a formula. */
function clean(v, max) {
  const s = String(v == null ? "" : v).trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
