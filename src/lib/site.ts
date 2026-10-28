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
    "You’re invited to the wedding of Rhaine & Harvy on Saturday, February 13, 2027, in Ermita, Manila. Kindly RSVP.",
  dateLong: "Saturday, February 13, 2027",
  dateShort: "02 · 13 · 2027",
  city: "Ermita, Manila",
  /** From the V4 design: "on or before 30th day of November". */
  rsvpBy: "the 30th day of November",
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
    /** As a printed invitation would set it. */
    timeWords: "two o’clock in the afternoon",
    timeShort: "2:00 PM",
    place: "San Vicente de Paul Parish",
    venue: "San Vicente de Paul Parish",
    room: "",
    address: "959 San Marcelino St., Ermita, Manila",
    map: maps("San Vicente de Paul Parish, 959 San Marcelino St., Ermita, Manila"),
    /** OpenStreetMap, San Vicente De Paul Church node. */
    coords: "14°35′06.8″ N · 120°59′07.6″ E",
  },
  {
    n: "II.",
    name: "The Reception",
    time: "Immediately after the ceremony",
    timeWords: "immediately after, for dinner and dancing",
    timeShort: "To follow",
    place: "Manila Prince Hotel - Sapphire Hall C",
    venue: "Manila Prince Hotel",
    room: "Sapphire Hall C",
    address: "1000 San Marcelino St., Ermita, Manila",
    map: maps("Manila Prince Hotel, 1000 San Marcelino St., Ermita, Manila"),
    /** OpenStreetMap, Manila Prince Hotel node. */
    coords: "14°35′04.2″ N · 120°59′13.6″ E",
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

/** Every reply button on the page; phones shorten it in the header. */
export const CTA = { label: "KINDLY RSVP →", short: "RSVP →", href: "#rsvp" };

export const HEADER = { menu: "MENU", close: "CLOSE" };

export const PRELOADER = {
  lines: ["WHERE", "*two* STORIES"],
  after: ["BECOME", "ONE *forever.*"],
};

/*
 * From here to MOMENTS/VERSE the words are the Figma "B - Polished" frames',
 * verbatim (design of record). Labels are typed in caps because Figma sets
 * them in caps.
 */

export const HERO = {
  kicker: "YOU’RE INVITED TO THE WEDDING OF",
  /** Desktop sets the names on one line; phones break after RHAINE. */
  names: ["RHAINE", "*&* HARVY"],
  date: "SATURDAY · 02.13.2027 · ERMITA, MANILA",
  dateShort: "02.13.2027 · ERMITA, MANILA",
};

export const PROMISE = {
  eyebrow: "THE INVITATION",
  top: ["TWO *hearts,*", "ONE PROMISE"],
  bottom: ["TO KEEP", "*for* ALWAYS."],
  title: "You’re invited to celebrate the wedding of Rhaine and Harvy.",
  body: "Together with our families, we invite you to witness the day we say our vows - Saturday, the thirteenth of February, 2027, at San Vicente de Paul Parish in Manila - and to stay for dinner and dancing with the people we love most.",
};

export const STORY = {
  eyebrow: "THE ESSENCE OF US",
  title: ["*where* FRIENDSHIP", "*meets* FOREVER"],
  steps: [
    { label: "I — THE FIRST HELLO", words: "*From* HELLO," },
    { label: "II — THE QUESTION", words: "*to* YES," },
    { label: "III — THE PROMISE", words: "*to* I DO." },
  ],
};

export const DAY = {
  eyebrow: "A DAY BUILT FOR LOVE",
  title: ["*so* THAT TWO", "BECOME ONE."],
  intro: {
    date: "Saturday, February 13, 2027",
    lede: "One afternoon in Ermita, two parts, and every person we love in one place.",
  },
  directions: "DIRECTIONS ↗",
  rows: { ceremony: "THE CEREMONY", reception: "THE RECEPTION" },
  dressCode: {
    n: "III.",
    label: "DRESS CODE",
    groups: [
      {
        who: "Principal sponsors",
        items: [
          { role: "Ninongs", value: "Barong and black shoes" },
          { role: "Ninangs", value: "Modern Filipiniana or long gown" },
        ],
        colors: [
          { name: "Champagne", hex: "#e3cfa8" },
          { name: "Taupe", hex: "#8b7b6b" },
        ],
      },
      {
        who: "Guests",
        items: [{ role: "", value: "Semi-formal attire" }],
        colors: [{ name: "Shades of burgundy", hex: "#6e1a2b" }],
      },
    ],
  },
  quote:
    "“We never wanted a big day. We wanted the right people in the room - and that means you.”",
  quoteBy: "RHAINE & HARVY",
};

export const MOMENTS = {
  eyebrow: "OUR MOMENTS",
  title: ["*every* MOMENT", "*led us* HERE."],
  lede: "Studio days, late nights, a question asked under city lights - a few frames from the road to February.",
  more: "VIEW ALL MOMENTS",
  // TODO: where "View all moments" goes (a shared album?). The button is hidden until this is set.
  moreHref: "",
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
  author: "SONNET 43 · ELIZABETH BARRETT BROWNING",
};

export const NOTES = {
  eyebrow: "*a few* GENTLE NOTES",
  title: ["*before* YOU", "ARRIVE."],
  greeting: "Dear family and friends,",
  /** Each paragraph opens with its subject in italic so a skim still lands. */
  items: [
    {
      lead: "On the guest list.",
      body: "We’re keeping the day small, so we kindly ask that only the guests named on your invitation attend.",
    },
    {
      lead: "On little ones.",
      body: "We adore your children, but we’ve planned an adults-only evening. Thank you for understanding, and enjoy a night off with us.",
    },
    {
      lead: "On gifts.",
      body: "Having you there truly is enough. If you’d like to give, a monetary gift toward our life together would be warmly appreciated.",
    },
  ],
  closing: "With love,",
};

export const RSVP = {
  eyebrow: "*kindly* RSVP",
  title: "Will you join us?",
  sub: `Kindly reply by ${SITE.rsvpBy}.`,
  /** The classic reply-card wording. */
  accept: "joyfully accepts",
  decline: "regretfully declines",
  fields: {
    name: "Your name",
    nameHint: "as it appears on your invitation",
    contact: "Email or mobile number",
    guests: "Who will be attending",
    guestsHint: "names of everyone on your invitation who is coming",
    diet: "Dietary needs",
    message: "A note for us",
    optional: "optional",
  },
  submit: "Send reply",
  thanks: {
    yes: "Thank you. We can’t wait to celebrate with you.",
    no: "Thank you for letting us know. You’ll be missed.",
  },
  calendar: "Add to calendar",
};

export const FOOTER = {
  closing: ["*we can’t wait*", "TO SEE YOU."],
  date: "02 · 13 · 2027 · ERMITA, MANILA",
  ceremony: "THE CEREMONY",
  reception: "THE RECEPTION",
  reply: { label: "REPLY", title: "Will you join us?", sub: "Kindly reply by the date on your invitation." },
  directions: "DIRECTIONS ↗",
  links: [
    { label: "THE DAY ↗", href: "#the-day" },
    { label: "GENTLE NOTES ↗", href: "#notes" },
    { label: "OUR STORY ↗", href: "#story" },
    { label: "RSVP ↗", href: "#rsvp" },
  ],
  copyright: "© 2027 Rhaine & Harvy",
  top: "BACK TO TOP ↑",
};

/**
 * Calendar entry for a yes. Manila is UTC+8, so 2:00 PM is 06:00Z.
 * TODO: confirm when the reception ends; 10:00 PM is a placeholder.
 */
const CAL = {
  title: "Rhaine & Harvy’s wedding",
  start: "20270213T060000Z",
  end: "20270213T140000Z",
  where: "San Vicente de Paul Parish, 959 San Marcelino St., Ermita, Manila",
  details: "Ceremony at 2:00 PM, San Vicente de Paul Parish. Reception to follow at Manila Prince Hotel, Sapphire Hall C.",
};

export const CALENDAR = {
  google: `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: "TEMPLATE",
    text: CAL.title,
    dates: `${CAL.start}/${CAL.end}`,
    location: CAL.where,
    details: CAL.details,
  })}`,
  /** Served from public/; Apple Calendar and Outlook open it directly. */
  ics: "/rhaine-harvy.ics",
};

/* ================================================================
 * V4 ("New Version - Website", Figma node 86:646). Words verbatim from
 * the frame. Display lines are set in Androgy, whose CAPITALS are the swash
 * letters and whose lowercase are plain caps - so "Every moment" renders a
 * swash E and the rest in caps. Type them exactly as written here.
 * ================================================================ */

export const V4 = {
  header: { menu: "menu", cta: "KINDLY RSVP →" },
  hero: {
    first: "Rhaine",
    second: "Harvy",
    date: "02 · 13 · 2027",
    lede: "Ermita, Manila",
  },
  countdown: {
    /** 2:00 PM in Manila (UTC+8). */
    target: "2027-02-13T14:00:00+08:00",
    eyebrow: "Until we say I do",
    units: ["Days", "hours", "minutes", "seconds"],
  },
  invite: {
    title: "We Invite You",
    lead: "Please confirm your attendance on or before ",
    date: "30th day of November",
    cta: "KINDLY RSVP →",
    /** The moving ribbon between the invitation and the story. */
    ribbon: ["Rhaine & Harvy", "02 · 13 · 2027", "Ermita, Manila"],
  },
  chapters: {
    story: ["№ 02", "OUR STORY"],
    day: ["№ 03", "THE DAY"],
    moments: ["№ 04", "MOMENTS"],
    notes: ["№ 05", "GOOD TO KNOW"],
    reply: ["№ 06", "REPLY"],
    issue: "RHAINE & HARVY · VOL. I",
  },
  story: {
    title: ["Where friendship", "meets forever..."],
    /**
     * The pinned stepper's caption: each chapter's key word gets Androgy's
     * swash capital, the lead word stays in plain caps.
     */
    steps: [
      { lead: "from", word: "Hello,", label: "I — THE FIRST HELLO" },
      { lead: "to", word: "Yes,", label: "II — THE QUESTION" },
      { lead: "to", word: "I do.", label: "III — THE PROMISE" },
    ],
    polaroids: [
      { src: "/v4/polaroid-1.webp", alt: "Harvy kissing Rhaine on the forehead, a taped polaroid" },
      { src: "/v4/polaroid-2.webp", alt: "Rhaine showing her ring on the night of the proposal, a taped polaroid" },
      { src: "/v4/polaroid-3.webp", alt: "Harvy holding Rhaine's hand, ring close up, a taped polaroid" },
    ],
    /** Two halves: the second rises in as the two of them come together. */
    close: ["So that two", "become One."],
    /** The close's backdrop: apart on their own seats, then side by side. */
    apart: { src: "/v4/two-far", alt: "Rhaine and Harvy seated apart, glancing at each other across the room" },
    together: { src: "/v4/two-close", alt: "Rhaine on a stool leaning on Harvy's shoulder as he sits beside her" },
  },
  day: {
    title: "Saturday, February 13, 2027",
    venues: [
      { src: "/v4/venue-church.webp", alt: "San Vicente de Paul Parish, Ermita" },
      { src: "/v4/venue-hotel.webp", alt: "Manila Prince Hotel, Ermita" },
    ],
    rows: ["THE CEREMONY", "THE RECEPTION"],
    directions: "DIRECTIONS ↗",
  },
  dress: {
    title: "Dress for an evening in Burgundy.",
    cards: [
      { name: "Champagne", who: "NINANGS", hex: "#E3CFA8" },
      { name: "Taupe", who: "NINANGS", hex: "#8B7B6B" },
      { name: "Burgundy", who: "GUESTS", hex: "#6E1A2B" },
    ],
    /** The outfit guide, in the order of the lines below it. */
    lookbook: {
      src: "/v4/dress-lookbook",
      alt: "Outfit guide: ninongs in a cream barong with black trousers and shoes; ninangs in burgundy, champagne or taupe gowns; guests in burgundy or taupe suits, burgundy or champagne dresses, and smart cream-and-beige separates.",
    },
    lines: [
      ["Ninongs:", "Barong and black shoes"],
      ["Ninangs:", "modern Filipiniana or long gown"],
      ["Guests:", "semi-formal attire"],
    ],
  },
  moments: {
    title: "Every moment led us here.",
    quote: "“We never wanted a big day. We wanted the right people in the room - and that means You.”",
    by: "— RHAINE & HARVY",
    cta: "KINDLY RSVP →",
  },
  notes: {
    title: "Before you Arrive.",
    lede: "**Three little things** before the big day.",
    /** Short on purpose: a title and one line each. Icons live in src/icons. */
    items: [
      {
        n: "1",
        icon: "gathering",
        title: "Just the names on your invite",
        body: "We’re keeping it intimate, so only the **guests named on your invitation**, please.",
      },
      {
        n: "2",
        icon: "guests",
        title: "An adults‑only evening",
        body: "We adore your little ones, but this night is **just for the grown‑ups**.",
      },
      {
        n: "3",
        icon: "gift",
        title: "Your presence is our gift",
        body: "If you’d like to give, a **monetary gift** toward our next chapter means the world.",
      },
    ],
  },
  reply: {
    title: "R.S.V.P.",
    sub: "Kindly reply on or before the 30th day of November.",
    facts: "SAT, FEB 13, 2027 · 2:00 PM · SAN VICENTE DE PAUL PARISH",
    accept: ["Joyfully", "ACCEPTS"],
    decline: ["Regretfully", "DECLINES"],
    fields: {
      name: "Full name, as on your invitation",
      contact: "Email or mobile number",
      guests: "Names of everyone attending",
      diet: "Dietary needs or allergies",
      note: "A note for us (optional)",
    },
    submit: "SEND REPLY →",
    thanks: {
      yes: "Thank you. We can’t wait to celebrate with you.",
      no: "Thank you for letting us know. You’ll be missed.",
    },
    calendar: "Add to calendar",
  },
  footer: {
    closing: "We can’t wait to see you.",
    colophon: "Manila, 2027 · © Rhaine & Harvy",
    links: [
      { label: "THE DAY ↗", href: "#the-day" },
      { label: "GOOD TO KNOW ↗", href: "#notes" },
      { label: "OUR STORY ↗", href: "#story" },
      { label: "BACK TO TOP ↑", href: "#top" },
    ],
  },
};

/** `**bold**` → <strong>. Copy is authored here, so no escaping needed. */
export const bold = (s: string) => s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
