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
  /** Rhaine, Nov 9 2026: reply on or before January 5, 2027. */
  rsvpBy: "January 5, 2027",
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
    place: "Manila Prince Hotel - Sapphire Hall B & C, Lower Ground",
    venue: "Manila Prince Hotel",
    room: "Sapphire Hall B & C, Lower Ground",
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
  details: "Ceremony at 2:00 PM, San Vicente de Paul Parish. Reception to follow at Manila Prince Hotel, Sapphire Hall B & C, Lower Ground.",
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
    date: "January 5, 2027",
    cta: "KINDLY RSVP →",
    /** The moving ribbon between the invitation and the story. */
    ribbon: ["Rhaine & Harvy", "02 · 13 · 2027", "Ermita, Manila"],
  },
  chapters: {
    story: ["№ 02", "OUR STORY"],
    day: ["№ 03", "THE DAY"],
    moments: ["№ 04", "MOMENTS"],
    entourage: ["№ 05", "ENTOURAGE"],
    notes: ["№ 06", "GOOD TO KNOW"],
    reply: ["№ 07", "REPLY"],
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
    /** The order of the afternoon - no times, just what comes next. */
    /** Each stop carries its watercolour vignette (public/v4/step-*.webp, made in Figma). */
    timeline: {
      label: "HOW THE DAY UNFOLDS",
      steps: [
        { label: "Ceremony", img: "/v4/step-ceremony.webp" },
        { label: "Photos", img: "/v4/step-photos.webp" },
        { label: "Pica-pica", img: "/v4/step-picapica.webp" },
        { label: "Dinner", img: "/v4/step-dinner.webp" },
        { label: "Party & games", img: "/v4/step-party.webp" },
        { label: "Messages", img: "/v4/step-messages.webp" },
      ],
    },
  },
  dress: {
    title: "Dress for an evening in Burgundy.",
    intro: "We encourage you to dress in our wedding colours",
    /** Who wears what, each row beside its illustrated pair (transparent WebPs). */
    roles: [
      {
        looks: [
          { what: "Modern Filipiniana", who: "For the ninangs, in champagne" },
          { what: "Barong & black slacks", who: "For the ninongs, with black shoes" },
        ],
        img: { src: "/v4/dress-sponsors.webp", width: 639, height: 1000 },
        /** Each row's colours, shown as dots under it. */
        palette: [{ name: "Champagne", who: "Principal sponsors", hex: "#E3CFA8" }],
        alt: "A ninong in a cream barong with black slacks and black shoes beside a ninang in a champagne modern Filipiniana gown with butterfly sleeves.",
      },
      {
        looks: [{ what: "Semi-formal attire", who: "For our guests, ladies & gentlemen, in shades of burgundy" }],
        img: { src: "/v4/dress-guests.webp", width: 522, height: 1001 },
        palette: [
          { name: "Deep burgundy", hex: "#3A0D16" },
          { name: "Burgundy", hex: "#6E1A2B" },
          { name: "Wine", hex: "#7F1D33" },
          { name: "Dusty burgundy", hex: "#8A4552" },
        ],
        alt: "A guest couple: a woman in a burgundy midi dress with a sash and a man in a cream suit with a burgundy tie.",
      },
    ],
  },
  moments: {
    title: "Every moment led us here.",
    quote: "“We never wanted a big day. We wanted the right people in the room - and that means You.”",
    by: "— RHAINE & HARVY",
    cta: "KINDLY RSVP →",
  },
  /** Rhaine's final list (Notes, Nov 9 2026) - spellings and titles as she typed them. */
  entourage: {
    title: "Standing with us.",
    lede: "The family and friends who will walk beside us as we say I do.",
    partyTitle: "The Bridal Party",
    littleTitle: "Our Little Ones",
    parents: [
      { role: "Parents of the Groom", names: ["Mr. Hector Ramirez", "Mrs. Dotthy Ramirez"] },
      { role: "Parents of the Bride", names: ["Mr. Loreno Rativo", "Mrs. Wilma Rativo"] },
    ],
    sponsors: {
      role: "Principal Sponsors",
      pairs: [
        ["Mr. Emmanuel Alfiler", "Mrs. Cherie Alfiler"],
        ["Mr. Roderick Dela Cruz", "Mrs. Franelie Dela Cruz"],
        ["Mr. Rodolfo Doronila", "Mrs. Grace Doronila"],
        ["Mr. Larry Ibuan", "Mrs. Julie Ibuan"],
        ["Mr. Marvin Monterona", "Mrs. Annie Monterona"],
        ["Mr. Solon Rativo", "Mrs. Luzviminda Rativo"],
        ["Mr. Patrick Christian Rativo", "Mrs. Rovi Rativo"],
        ["Atty. Manuel Rodriguez II", "Ms. Loreta Dizon"],
      ],
    },
    honor: [
      { role: "Best Man", names: ["Harold Dexter Ramirez"] },
      { role: "Maid of Honor", names: ["Annie Agan-Chavez"] },
    ],
    secondary: {
      role: "Secondary Sponsors",
      groups: [
        { role: "Veil", names: ["Keith Dicang", "Jasper Dicang"] },
        { role: "Candle", names: ["Aiko Manuel", "Martel John De Leon"] },
        { role: "Cord", names: ["Renelyn Velarde", "Engr. Anjoe Pengco"] },
      ],
    },
    party: [
      { role: "Groomsmen", names: ["Lawrence Gabriel Noble", "John Paul Tarrayo", "Allan Kliene Ligaya"] },
      { role: "Bridesmaids", names: ["Joan Christel Aquino", "Bianca Lorenzo", "Beata Doronila"], note: "Beata Doronila represented by Jo-ann Episcope" },
    ],
    little: [
      { role: "Bible & Coin Bearer", names: ["Brylle Laurence Pulanco"] },
      { role: "Ring Bearer", names: ["Hermes Lyrel Ramirez"] },
      { role: "Flower Girls", names: ["Samantha Avery Menulas", "Olivia Chandria Mercado"] },
    ],
  },
  /** Its own framed note above "Before you Arrive." (after the inspo invitation). */
  gifts: {
    eyebrow: "A note on gifts",
    title: "Your presence is our present.",
    body: [
      "Truly, having you there as we say I do is the greatest gift we could ask for.",
      "If you would like to bless us as we begin our life together, a monetary gift would mean the world to us. Whatever you decide, just come — and bring your biggest smile.",
    ],
    signoff: "With all our love,",
    signature: "Rhaine & Harvy",
  },

  notes: {
    title: "Before you Arrive.",
    lede: "**A few little things** before the big day.",
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
        icon: "unplugged",
        title: "An unplugged ceremony",
        body: "Kindly keep **phones and cameras away** during the ceremony. Our photographers have every moment covered, and we’ll share them with you.",
      },
      {
        n: "4",
        icon: "arrival",
        title: "Come a little early",
        body: "Please arrive **at least 30 minutes before** the 2:00 PM ceremony, so you can find your seat and settle in.",
      },
    ],
  },
  reply: {
    eyebrow: "R · S · V · P",
    title: "Will you join us?",
    sub: "Kindly reply on or before January 5, 2027.",
    /** The invitation side of the reply card, set like stationery. */
    facts: [
      { label: "When", lines: ["Saturday, February 13, 2027", "2:00 in the afternoon"], short: ["Sat, Feb 13, 2027", "2:00 PM"] },
      { label: "Where", lines: ["San Vicente de Paul Parish", "Ermita, Manila"], short: ["San Vicente de Paul", "Ermita, Manila"] },
    ],
    /** Phones: the reply-by line, shorter. */
    subShort: "Kindly reply by January 5, 2027.",
    ask: "Will you attend?",
    /** Full wording, and the short form small phones show. */
    accept: ["Joyfully accept", "Accept"],
    decline: ["Regretfully decline", "Decline"],
    fields: {
      name: "Your name",
      namePh: "As written on your invitation",
      guests: "How many of you are coming?",
      guestsHint: "Including you — only the guests named on your invitation, please.",
      note: "A note for us",
      notePh: "A wish, a hello, anything at all",
      /** Phones: the same questions in fewer words. */
      short: {
        ask: "Attending?",
        guests: "How many?",
        guestsHint: "Including you, as named on your invite.",
        note: "A note",
      },
      optional: "optional",
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
      { label: "ENTOURAGE ↗", href: "#entourage" },
      { label: "GOOD TO KNOW ↗", href: "#notes" },
      { label: "OUR STORY ↗", href: "#story" },
      { label: "BACK TO TOP ↑", href: "#top" },
    ],
  },
};

/** `**bold**` → <strong>. Copy is authored here, so no escaping needed. */
export const bold = (s: string) => s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
