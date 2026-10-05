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
    "You’re invited to the wedding of Rhaine & Harvy - Saturday, February 13, 2027, in Manila. Kindly RSVP.",
  dateLong: "Saturday, February 13, 2027",
  dateShort: "02 · 13 · 2027",
  city: "Ermita, Manila",
  // TODO: confirm the reply-by date with the couple.
  rsvpBy: "the date on your invitation",
  contact: "",
  /** Optional hero loop (CloudFront URL). Falls back to the hero photo. */
  heroVideo: "",
  year: "2027",
};

/** `*word*` → <em>word</em>. Copy is authored here, so no escaping needed. */
export const rich = (s: string) => s.replace(/\*(.+?)\*/g, "<em>$1</em>");

/** Google Maps search link for a place. */
const maps = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

/** The two halves of the day - read by the schedule, the RSVP card and the footer. */
export const EVENTS = [
  {
    n: "I.",
    name: "The Ceremony",
    time: "2:00 in the afternoon",
    timeShort: "2:00 PM",
    place: "San Vicente de Paul Parish",
    address: "959 San Marcelino St., Ermita, Manila",
    map: maps("San Vicente de Paul Parish, 959 San Marcelino St., Ermita, Manila"),
  },
  {
    n: "II.",
    name: "The Reception",
    time: "Immediately after the ceremony",
    timeShort: "To follow",
    place: "Manila Prince Hotel - Sapphire Hall C",
    address: "1000 San Marcelino St., Ermita, Manila",
    map: maps("Manila Prince Hotel, 1000 San Marcelino St., Ermita, Manila"),
  },
];

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
  sub: "*you’re* INVITED",
};

export const PROMISE = {
  top: ["TWO *hearts,*", "ONE PROMISE"],
  bottom: ["TO KEEP", "*for* ALWAYS."],
  title: "You’re invited to celebrate the wedding of Rhaine and Harvy.",
  body: "Together with our families, we invite you to witness the day we say our vows - Saturday, the thirteenth of February, 2027, at San Vicente de Paul Parish in Manila - and to stay for dinner and dancing with the people we love most.",
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
    title: "Saturday,\nFebruary 13, 2027",
    lede: "One afternoon in Ermita, two parts, and every person we love in one place.",
  },
  directions: "Directions",
  dressCode: {
    n: "III.",
    label: "Dress code",
    groups: [
      {
        who: "Principal sponsors",
        items: [
          { role: "Ninongs", value: "Barong and black shoes" },
          {
            role: "Ninangs",
            value: "Modern Filipiniana or long gown",
            colors: [
              { name: "Champagne", hex: "#e3cfa8" },
              { name: "Taupe", hex: "#8b7b6b" },
            ],
          },
        ],
      },
      {
        who: "Guests",
        items: [
          {
            role: "",
            value: "Semi-formal attire",
            colors: [{ name: "Shades of burgundy", hex: "#6e1a2b" }],
          },
        ],
      },
    ],
  },
  quote:
    "“We never wanted a big day. We wanted the right people in the room - and that means you.”",
  quoteBy: "RHAINE *&* HARVY",
};

export const MOMENTS = {
  eyebrow: "*our* MOMENTS",
  title: ["*every* MOMENT", "*led us* HERE."],
  lede: "Studio days, late nights, a question asked under city lights - a few frames from the road to February.",
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
  lede: "Three small things that will help the day feel the way we hope it will.",
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
  eyebrow: "*kindly* RSVP",
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
  closing: ["*we can’t wait*", "TO SEE YOU."],
  /** Quiet ↗ links along the foot. */
  links: [
    { label: "The day", href: "#the-day" },
    { label: "Gentle notes", href: "#notes" },
    { label: "Our story", href: "#story" },
    { label: "RSVP", href: "#rsvp" },
  ],
  top: "Back to top",
};
