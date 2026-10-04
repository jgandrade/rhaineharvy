/**
 * RSVP form.
 *
 * Posts JSON to PUBLIC_RSVP_ENDPOINT (set it in .env.local). Until a backend
 * exists the form validates and tells the guest replies aren't open yet,
 * rather than pretending it sent anything.
 */
const ENDPOINT = import.meta.env.PUBLIC_RSVP_ENDPOINT as string | undefined;

const form = document.querySelector<HTMLFormElement>("[data-rsvp]");

if (form) {
  const status = form.querySelector<HTMLElement>("[data-rsvp-status]")!;
  const more = form.querySelector<HTMLElement>("[data-rsvp-more]")!;
  const submit = form.querySelector<HTMLButtonElement>("button[type=submit]")!;
  const thanks = document.querySelector<HTMLElement>("[data-rsvp-thanks]")!;

  const attending = () =>
    (form.elements.namedItem("attending") as RadioNodeList).value;

  // Guest names and dietary needs only matter for a yes.
  const syncMore = () => {
    more.hidden = attending() === "no";
  };
  form.addEventListener("change", syncMore);

  const say = (msg: string) => {
    status.textContent = msg;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    say("");

    for (const el of form.querySelectorAll(".is-invalid")) el.classList.remove("is-invalid");
    const invalid = [...form.querySelectorAll<HTMLInputElement>("[required]")].filter(
      (el) => !el.checkValidity(),
    );
    if (invalid.length) {
      for (const el of invalid) if (el.type !== "radio") el.classList.add("is-invalid");
      say(
        attending()
          ? "Kindly fill in your name and how we can reach you."
          : "Kindly let us know whether you can join us.",
      );
      invalid[0]!.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (data.company) return; // Honeypot: a bot filled the hidden field.
    delete data.company;

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, submittedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const text = thanks.querySelector<HTMLElement>("[data-rsvp-thanks-text]")!;
      text.textContent = (data.attending === "yes" ? thanks.dataset.yes : thanks.dataset.no) ?? "";
      form.hidden = true;
      thanks.hidden = false;
    } catch (err) {
      console.error("[rsvp]", err);
      say("Something went wrong sending your reply. Kindly try again in a moment.");
      submit.disabled = false;
    }
  });
}
