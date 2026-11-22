/**
 * RSVP form.
 *
 * Posts each reply to the Google Apps Script web app behind the couple's
 * RSVP Sheet (script: docs/rsvp-google-sheet.gs). The /exec URL is public by
 * design - every guest's browser calls it - so it lives here;
 * PUBLIC_RSVP_ENDPOINT overrides it. With neither, the form validates and
 * says replies aren't open yet, rather than pretending it sent anything.
 */
const SHEET_URL = "https://script.google.com/macros/s/AKfycbw366ZDy0YB6MvQLF_ixErsljxFX0RYsjonGwN9THMbGFDzZ8Pb_G_OkiUHfRNtn5IsGQ/exec";
const ENDPOINT = (import.meta.env.PUBLIC_RSVP_ENDPOINT as string | undefined) || SHEET_URL || undefined;

const form = document.querySelector<HTMLFormElement>("[data-rsvp]");

if (form) {
  const status = form.querySelector<HTMLElement>("[data-rsvp-status]")!;
  const submit = form.querySelector<HTMLButtonElement>("button[type=submit]")!;
  const thanks = document.querySelector<HTMLElement>("[data-rsvp-thanks]")!;

  const attending = () =>
    (form.elements.namedItem("attending") as RadioNodeList).value;

  const say = (msg: string) => {
    status.textContent = msg;
  };

  // A nudge is gone the moment they act on it: typing, or choosing an answer.
  const clear = (e: Event) => {
    const el = e.target as HTMLElement;
    el.classList?.remove("is-invalid");
    el.removeAttribute?.("aria-invalid");
    if (!submit.disabled) say("");
  };
  form.addEventListener("input", clear);
  form.addEventListener("change", clear);

  // Swap the form for the thank-you and a ledger of what we received.
  const showThanks = (data: Record<string, string>) => {
    const yes = data.attending === "yes";
    const text = thanks.querySelector<HTMLElement>("[data-rsvp-thanks-text]")!;
    text.textContent = (yes ? thanks.dataset.yes : thanks.dataset.no) ?? "";

    const set = (key: string, value: string) => {
      const dd = thanks.querySelector<HTMLElement>(`[data-ledger="${key}"]`);
      if (dd) dd.textContent = value;
    };
    set("name", data.name ?? "");
    set("attending", yes ? "Joyfully accepts" : "Regretfully declines");
    set("guests", data.guests?.trim() ?? "");
    const guestsRow = thanks.querySelector<HTMLElement>('[data-ledger-row="guests"]');
    if (guestsRow) guestsRow.hidden = !yes || !data.guests?.trim();
    for (const el of thanks.querySelectorAll<HTMLElement>("[data-ledger-yes]")) el.hidden = !yes;

    form.hidden = true;
    thanks.hidden = false;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    say("");

    for (const el of form.querySelectorAll(".is-invalid")) {
      el.classList.remove("is-invalid");
      el.removeAttribute("aria-invalid");
    }
    const invalid = [...form.querySelectorAll<HTMLInputElement>("[required]")].filter(
      (el) => !el.checkValidity(),
    );
    if (invalid.length) {
      for (const el of invalid) {
        if (el.type === "radio") continue;
        el.classList.add("is-invalid");
        el.setAttribute("aria-invalid", "true");
      }
      say(
        attending()
          ? "Kindly add your name, as written on your invitation."
          : "Kindly let us know whether you can attend.",
      );
      invalid[0]!.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (data.company) return; // Honeypot: a bot filled the hidden field.
    delete data.company;

    if (!ENDPOINT && import.meta.env.DEV) {
      // Dev preview only: show the confirmation without sending anything.
      console.warn("[rsvp] Dev preview - PUBLIC_RSVP_ENDPOINT is not set; nothing was sent.", data);
      showThanks(data);
      return;
    }

    if (!ENDPOINT) {
      say("Replies open soon - thank you for your patience.");
      console.warn("[rsvp] PUBLIC_RSVP_ENDPOINT is not set; nothing was sent.", data);
      return;
    }

    submit.disabled = true;
    say("Sending…");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        // text/plain keeps this a "simple" request: Apps Script can't answer
        // the CORS preflight that application/json would trigger.
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ ...data, submittedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json().catch(() => ({ ok: true }));
      if (body.ok === false) throw new Error(body.error ?? "rejected");

      showThanks(data);
    } catch (err) {
      console.error("[rsvp]", err);
      say("Something went wrong sending your reply. Kindly try again in a moment.");
      submit.disabled = false;
    }
  });
}
