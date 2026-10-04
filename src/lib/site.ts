/**
 * All copy on the site lives here.
 *
 * Headlines use Vero's two-voice setting: CAPS in the display serif, with
 * `*italic*` words dropped to lowercase italic. `rich()` turns the asterisks
 * into <em>. Each array entry is one line, revealed on its own.
 *
 * Facts still to confirm with the couple are marked TODO.
 */

export const SITE = {
  bride: "Rhaine",
  groom: "Harvy",
  couple: "Rhaine & Harvy",
  monogram: "R&H",
  description:
    "Rhaine & Harvy are getting married. Join us for an intimate celebration of love - kindly RSVP.",
  // TODO: confirm every value below.
  dateLong: "Date to be announced",
  dateShort: "TBA",
  rsvpBy: "the date on your invitation",
  contact: "",
  /** Optional hero loop (CloudFront URL). Falls back to the hero photo. */
  heroVideo: "",
  year: "2026",
};

/** `*word*` → <em>word</em>. Copy is authored here, so no escaping needed. */
export const rich = (s: string) => s.replace(/\*(.+?)\*/g, "<em>$1</em>");

export const NAV = [
  { n: "I.", label: "Home", href: "#top" },
  { n: "II.", label: "Our story", href: "#story" },
  { n: "III.", label: "The day", href: "#the-day" },
  { n: "IV.", label: "Moments", href: "#moments" },
  { n: "V.", label: "Notes", href: "#notes" },
  { n: "VI.", label: "RSVP", href: "#rsvp" },
];

export const CTA = { label: "*Kindly* RSVP", href: "#rsvp" };

export const PRELOADER = {
  lines: ["WHERE", "*two* STORIES"],
  after: ["BECOME", "ONE *forever.*"],
};

export const HERO = {
  sub: "*are getting* MARRIED.",
};

export const PROMISE = {
  top: ["TWO *hearts,*", "ONE PROMISE"],
  bottom: ["TO KEEP", "*for* ALWAYS."],
  title: "Rhaine and Harvy are getting married - and we would love for you to be there.",
  body: "Together with our families, we invite you to witness the day we say our vows: an afternoon of promises, a long table of the people we love most, and an evening we hope you will remember as fondly as we will.",
};

export const STORY = {
  eyebrow: "*the* ESSENCE *of* US",
  title: ["*where* FRIENDSHIP", "*meets* FOREVER"],
  /** Each word lights up while its slide is on screen. */
  steps: [
    { lead: "From", word: "HELLO,", label: "The first hello" },
    { lead: "to", word: "YES,", label: "The question" },
    { lead: "to", word: "I DO.", label: "The promise" },
  ],
};

export const DAY = {
  eyebrow: "*a* DAY BUILT *for* LOVE",
  title: ["*so* THAT TWO", "BECOME ONE."],
  intro: {
    title: "The ceremony.\nThe celebration.",
    lede: "One afternoon, two parts, and every person we love in one place.",
  },
  // TODO: times, venues and addresses.
  events: [
    {
      n: "I.",
      name: "The Ceremony",
      time: "Time to follow",
      place: "Venue to be announced",
    },
    {
      n: "II.",
      name: "The Reception",
      time: "Immediately after",
      place: "Venue to be announced",
    },
  ],
  attire: {
    label: "Attire",
    value: "Formal. Shades of wine, blush and ivory are warmly welcome.",
  },
  quote:
    "“We never wanted a big day. We wanted the right people in the room - and that means you.”",
  quoteBy: "RHAINE *&* HARVY",
};

export const MOMENTS = {
  eyebrow: "*our* MOMENTS",
  title: ["*every* MOMENT", "*led us* HERE."],
};

/** Sonnet 43 - Elizabeth Barrett Browning (public domain). */
export const VERSE = {
  lines: [
    ["HOW DO I", "LOVE THEE?"],
    ["LET ME COUNT", "THE WAYS."],
    ["I LOVE THEE TO", "THE DEPTH"],
    ["AND BREADTH", "AND HEIGHT"],
    ["MY SOUL", "CAN REACH."],
  ],
  author: "ELIZABETH BARRETT BROWNING",
};

export const NOTES = {
  eyebrow: "*a few* GENTLE NOTES",
  title: ["*before* YOU", "ARRIVE."],
  items: [
    {
      n: "I.",
      title: "An intimate gathering",
      body: "As we are celebrating with a small and intimate gathering, we kindly ask that only the guest(s) named on your invitation attend. Thank you for celebrating with us.",
    },
    {
      n: "II.",
      title: "A note about our little guests",
      body: "As much as we adore your little ones, we kindly ask that our celebration be adults-only. We truly appreciate your understanding and hope you can enjoy a special evening with us!",
    },
    {
      n: "III.",
      title: "Your presence is the gift we treasure most.",
      body: "Should you wish to give, a monetary gift would be greatly appreciated and will go toward our future together.",
    },
  ],
};

export const RSVP = {
  title: "Will you join us?",
  sub: `We would be honored to celebrate with you. Kindly reply by ${SITE.rsvpBy}.`,
  accept: "*Joyfully* ACCEPTS",
  decline: "*Regretfully* DECLINES",
  submit: "*Send* REPLY",
  thanks: {
    yes: "Thank you - we can't wait to celebrate with you.",
    no: "Thank you for letting us know. You will be missed.",
  },
};

export const FOOTER = {
  captureLabel: "Kindly RSVP",
  capturePlaceholder: "Your full name",
  /** Quiet ↗ links along the foot, like Vero's legals. */
  links: [
    { label: "The ceremony", href: "#the-day" },
    { label: "Gentle notes", href: "#notes" },
    { label: "Our story", href: "#story" },
  ],
  top: "Back to top",
};
