/**
 * V4 behaviour and motion.
 *
 *  - Bar: stays put while scrolling (only the full-screen story close sends it
 *    away). MENU opens the full-screen panel (Esc and any link close it).
 *  - Countdown: live, to 2:00 PM Manila on Feb 13 2027; each digit rolls
 *    like an odometer as it changes, a hairline fills across every minute.
 *  - Our story: the pinned scroll stepper, then the close: the two of them
 *    slide together, with the menu bar away.
 *  - The band's photo wall: frames open in batches as they arrive, settling.
 *  - Entrance + scroll reveals with GSAP / ScrollTrigger, one language for
 *    every section: headings rise letter by letter from behind each word's
 *    mask, spaced caps tighten into place, photos open upward and settle
 *    from a slight zoom, everything else lifts in.
 *  - Values come alive: the countdown spins up like a slot machine the first
 *    time it is seen, the dress swatches' colour codes decode as they flip.
 *
 * Reduced motion: no entrance, no reveals, no cycling, no reel - the page is
 * still and complete. The countdown still counts (it is information).
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reduced = root.classList.contains("reduce-motion");
const qa = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => [
  ...scope.querySelectorAll<T>(sel),
];
const q = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  scope.querySelector<T>(sel);

/**
 * The bar steps aside (html.bar-away) while any of these is under it: the
 * story's full-screen close, the back cover. Each owns its own reason, so one
 * leaving never brings the bar back over the other.
 */
const awayFor = new Set<string>();
const away = (reason: string, on: boolean) => {
  if (on) awayFor.add(reason);
  else awayFor.delete(reason);
  root.classList.toggle("bar-away", awayFor.size > 0);
};
const barHeight = () => q("[data-v4-bar]")?.offsetHeight ?? 64;

/* ---------------- Bar + menu ---------------- */

function bar() {
  const toggle = q<HTMLButtonElement>("[data-v4-menu-toggle]");
  const panel = q("[data-v4-menu]");
  if (!toggle || !panel) return;

  const setOpen = (open: boolean) => {
    toggle.setAttribute("aria-expanded", String(open));
    if (open) {
      panel.hidden = false;
      requestAnimationFrame(() => root.classList.add("menu-open"));
      document.body.style.overflow = "hidden";
    } else {
      root.classList.remove("menu-open");
      document.body.style.overflow = "";
      window.setTimeout(() => {
        if (!root.classList.contains("menu-open")) panel.hidden = true;
      }, reduced ? 0 : 800);
    }
  };

  toggle.addEventListener("click", () => setOpen(!root.classList.contains("menu-open")));
  for (const link of qa("[data-v4-menu-link]", panel)) link.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && root.classList.contains("menu-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
}

/** The back cover has the screen to itself: the bar goes as it slides under. */
function cover() {
  const footer = q("[data-v4-cover]");
  if (!footer) return;
  ScrollTrigger.create({
    trigger: footer,
    start: () => `top ${barHeight()}px`,
    end: "bottom top",
    invalidateOnRefresh: true,
    onToggle: (self) => away("cover", self.isActive),
  });
}

/* ---------------- Countdown ---------------- */

function countdown() {
  const box = q("[data-v4-countdown]");
  if (!box) return;
  const target = Date.parse(box.dataset.target!);
  const cells = qa("[data-unit]", box);
  const minute = q("[data-v4-minute]", box);
  const pad = (n: number) => String(n).padStart(2, "0");

  // One window (.dg) per digit; a changed digit rolls: the old one up and
  // out, the new one up from below. The count of windows only changes when
  // the days lose a digit, and then they are simply rebuilt.
  const show = (el: HTMLElement, value: string, roll: boolean) => {
    if (el.children.length !== value.length) {
      el.replaceChildren(
        ...[...value].map((ch) => {
          const dg = document.createElement("span");
          dg.className = "dg";
          dg.dataset.v = ch;
          dg.innerHTML = `<span class="dg__v">${ch}</span>`;
          return dg;
        }),
      );
      return;
    }
    [...value].forEach((ch, i) => {
      const dg = el.children[i] as HTMLElement;
      if (dg.dataset.v === ch) return;
      dg.dataset.v = ch;
      const old = dg.lastElementChild as HTMLElement;
      if (!roll) {
        old.textContent = ch;
        return;
      }
      const next = document.createElement("span");
      next.className = "dg__v";
      next.textContent = ch;
      // Digits differ in width: measure the new one, then ease the window
      // from the old width to the new while the two roll past each other.
      const from = dg.offsetWidth;
      next.style.cssText = "position:absolute;left:0;right:auto;visibility:hidden";
      dg.append(next);
      const to = next.offsetWidth;
      next.style.cssText = "";
      gsap.fromTo(dg, { width: from }, { width: to, duration: 0.7, ease: "expo.out", clearProps: "width" });
      gsap.fromTo(next, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: "expo.out" });
      gsap.to(old, { yPercent: -100, duration: 0.7, ease: "expo.out", onComplete: () => old.remove() });
    });
  };

  // The first time the card is seen, its digits spin like a slot machine
  // and lock in left to right - days first, seconds last.
  let spinning = false;
  const spin = () => {
    spinning = true;
    const start = performance.now();
    const settle = cells.map((_, i) => 650 + i * 170);
    const step = () => {
      const t = performance.now() - start;
      cells.forEach((el, i) => {
        if (t > settle[i]!) return;
        for (const v of qa(".dg__v", el)) v.textContent = String(Math.floor(Math.random() * 10));
      });
      if (t < settle[settle.length - 1]!) {
        window.setTimeout(step, 55);
      } else {
        spinning = false;
        tick(false);
      }
      // Each cell settles to the real value as its time comes.
      cells.forEach((el, i) => {
        if (t > settle[i]! && el.dataset.settled !== "1") {
          el.dataset.settled = "1";
          for (const dg of qa(".dg", el)) qa(".dg__v", dg).forEach((v) => (v.textContent = dg.dataset.v ?? v.textContent));
        }
      });
    };
    step();
  };

  const tick = (roll = !reduced) => {
    if (spinning) return;
    const left = Math.max(0, target - Date.now());
    const s = Math.floor(left / 1000);
    const values = [String(Math.floor(s / 86400)), pad(Math.floor((s % 86400) / 3600)), pad(Math.floor((s % 3600) / 60)), pad(s % 60)];
    cells.forEach((el, i) => show(el, values[i]!, roll));
    // How much of this minute has gone; a new minute snaps back to the start
    // rather than sliding backwards.
    if (minute) {
      const gone = (60 - (s % 60)) / 60;
      const prev = Number(minute.style.getPropertyValue("--minute") || 0);
      minute.style.transition = gone < prev || reduced ? "none" : "";
      minute.style.setProperty("--minute", String(gone));
    }
  };
  tick(false);
  window.setInterval(() => tick(), 1000);
  if (!reduced) ScrollTrigger.create({ trigger: box, start: "top 90%", once: true, onEnter: spin });
}

/* ---------------- Our story: the pinned stepper ---------------- */

/**
 * The original site's stepper, in V4 type: pinned for the whole story, the
 * small card under the headline grows to the full screen while the headline
 * lifts away; then chapters II and III wipe in from the right, each with its
 * own caption phrase.
 */
function story() {
  const section = q("[data-v4-story]");
  if (!section) return;
  const pin = q("[data-story-pin]", section)!;
  const frame = q("[data-story-frame]", section)!;
  const intro = q("[data-story-intro]", section)!;
  const slides = qa("[data-story-slide]", section);
  const texts = qa(".story__caption", section);
  const vh = () => window.innerHeight;

  const mm = gsap.matchMedia();
  // Both conditions listed so the callback runs (and re-runs) at every width.
  mm.add({ desktop: "(min-width: 900px)", phone: "(max-width: 899px)" }, (ctx) => {
    const { desktop } = ctx.conditions as { desktop: boolean };
    // The card sits under the two-line headline; phones get a taller card.
    const card = desktop
      ? { "--t": "52%", "--x": "38%", "--b": "8%" }
      : { "--t": "42%", "--x": "16%", "--b": "10%" };
    gsap.set(texts, { autoAlpha: 0 });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: pin,
        start: "top top",
        end: () => `+=${vh() * (1.4 + slides.length * 1.1)}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });

    tl.fromTo(frame, card, { "--t": "0%", "--x": "0%", "--b": "0%", duration: 1.2, ease: "power2.inOut" })
      .to(intro, { yPercent: -30, autoAlpha: 0, duration: 0.8, ease: "power1.in" }, 0.15)
      .from(q(".media", slides[0]!), { scale: 1.3, duration: 1.2, ease: "power2.out" }, 0)
      .to(texts, { autoAlpha: 1, duration: 0.3 }, 1)
      .add(() => {}, "+=0.35");

    for (const slide of slides.slice(1)) {
      const at = tl.duration();
      tl.fromTo(
        slide,
        { clipPath: "inset(0% 0% 0% 100%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power2.inOut" },
        at,
      )
        .from(q(".media", slide), { xPercent: 18, duration: 1, ease: "power2.out" }, at)
        .add(() => {}, "+=0.3");
    }
  });
}

/**
 * "So that two become One.": in the apart photo, Rhaine's strip and Harvy's
 * slide toward each other and stop exactly where they sit in the side-by-side
 * photo underneath, which the strips then fade into as "become One." rises in. Only transform and opacity move - no blur - so it stays smooth.
 * Desktop pins a full screen for it; phones scrub it in place. The menu bar
 * stays away while the section is under it.
 */
function together() {
  const end = q("[data-story-end]");
  if (!end) return;
  const left = q('[data-story-half="left"]', end)!;
  const right = q('[data-story-half="right"]', end)!;
  const strips = qa("[data-story-half]", end);
  const one = q("[data-story-one]", end)!;

  const mm = gsap.matchMedia();
  mm.add({ desktop: "(min-width: 900px)", phone: "(max-width: 899px)" }, (ctx) => {
    const { desktop } = ctx.conditions as { desktop: boolean };
    // How far each strip travels, as a share of the photo (the strips are
    // sized to it): from where each sits apart to where they sit together.
    const [l, r] = [28, -26];

    // Away from the moment the section slides under the bar until it has
    // scrolled past: the pin (1.6 screens) plus one screen to leave.
    ScrollTrigger.create({
      trigger: end,
      start: () => `top ${barHeight()}px`,
      end: desktop ? () => `+=${window.innerHeight * 2.6}` : () => `bottom ${barHeight()}px`,
      invalidateOnRefresh: true,
      onToggle: (self) => away("close", self.isActive),
    });

    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: desktop
          ? { trigger: end, start: "top top", end: () => `+=${window.innerHeight * 1.6}`, pin: true, scrub: 1, invalidateOnRefresh: true }
          : { trigger: end, start: "top 70%", end: "bottom 25%", scrub: 1 },
      })
      .fromTo(left, { xPercent: 0 }, { xPercent: l, duration: 1, ease: "power2.inOut" }, 0)
      .fromTo(right, { xPercent: 0 }, { xPercent: r, duration: 1, ease: "power2.inOut" }, 0)
      // They overlap in the photo underneath, which straight-edged strips
      // can't: hand over to it while they're still just apart (her elbow
      // reaches his arm at ~0.8 of the slide), so no strip ever paints its
      // wall over the other.
      .to(strips, { autoAlpha: 0, duration: 0.22, ease: "power1.inOut" }, 0.6)
      .fromTo(one, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" }, 0.8)
      .to({}, { duration: 0.4 });

    return () => away("close", false);
  });
}

/**
 * The ribbon between the invitation and the story: its two lines of script
 * slide past each other, solid one way and outlined the other, only as the
 * page scrolls - so it moves with the reader, never on its own.
 */
function ribbon() {
  const box = q("[data-v4-ribbon]");
  if (!box) return;
  const [solid, outline] = qa("[data-v4-ribbon-row]", box);
  const st = { trigger: box, start: "top bottom", end: "bottom top", scrub: 0.6 };
  if (solid) gsap.fromTo(solid, { xPercent: -6 }, { xPercent: -26, ease: "none", scrollTrigger: st });
  if (outline) gsap.fromTo(outline, { xPercent: -30 }, { xPercent: -10, ease: "none", scrollTrigger: st });
}

/* ---------------- Entrance + reveals ---------------- */

function heartbeat(el: Element) {
  return gsap.timeline({ repeat: 1, repeatDelay: 0.25 })
    .to(el, { scale: 1.12, duration: 0.18, ease: "power2.out" })
    .to(el, { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.4)" });
}

function hero() {
  const section = q("[data-v4-hero]");
  if (!section) return;
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  // Shown in the same tick the tweens below set their starting states, so
  // the first painted frame is already the start of the entrance.
  tl.set(q(".hero__stage", section), { visibility: "visible" }, 0);
  tl.from(qa(".ch", section), { yPercent: 70, opacity: 0, duration: 1.1, stagger: 0.045 }, 0.15)
    .from(q("[data-v4-amp]", section), { scale: 0.3, rotate: -25, opacity: 0, duration: 1, ease: "back.out(2.2)" }, 0.55)
    .from(q('[data-v4-cut="left"]', section), { xPercent: -18, opacity: 0, duration: 1.4 }, 0.2)
    .from(q('[data-v4-cut="right"]', section), { xPercent: 18, opacity: 0, duration: 1.4 }, 0.2)
    .from(q("[data-v4-beat]", section), { scale: 0, opacity: 0, duration: 0.8, ease: "back.out(2)" }, 0.8)
    .add(() => { heartbeat(q("[data-v4-beat]", section)!); }, 1.5)
    .from(qa("[data-v4-hero-line]", section), { y: 24, opacity: 0, duration: 1, stagger: 0.12 }, 0.9);
  // The date and the place tighten into place as they rise.
  qa<HTMLElement>("[data-v4-hero-line]", section).forEach((el, i) => tl.add(trackIn(el, { from: "0.6em", fade: false }), 0.9 + i * 0.12));

  // The two of them drift apart a little as the hero scrolls away.
  gsap.to(q('[data-v4-cut="left"]', section), { xPercent: -6, ease: "none", scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true } });
  gsap.to(q('[data-v4-cut="right"]', section), { xPercent: 6, ease: "none", scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true } });
}

/**
 * Wraps each word of a heading in a mask (.wd) around a mover (.wd__i), and
 * each letter in its own span (.c), so the letters can rise from below
 * their word's line. The spaces stay plain text, so the heading still reads
 * as one line of words to a screen reader. Returns the letters.
 */
function splitLetters(el: Element) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  while (walker.nextNode()) texts.push(walker.currentNode as Text);
  for (const t of texts) {
    const frag = document.createDocumentFragment();
    for (const part of t.data.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        frag.append(part);
        continue;
      }
      const wd = document.createElement("span");
      wd.className = "wd";
      const inner = document.createElement("span");
      inner.className = "wd__i";
      for (const ch of part) {
        const c = document.createElement("span");
        c.className = "c";
        c.textContent = ch;
        inner.append(c);
      }
      wd.append(inner);
      frag.append(wd);
    }
    t.replaceWith(frag);
  }
  return qa(".c", el);
}

/**
 * Spaced capitals tighten into place: from wide tracking to their own, the
 * indent (which balances the tracking for centring) following along.
 */
function trackIn(el: HTMLElement, opts: { from?: string; fade?: boolean } = {}) {
  const cs = getComputedStyle(el);
  const to = { letterSpacing: cs.letterSpacing, textIndent: cs.textIndent };
  const from = opts.from ?? "0.6em";
  return gsap.fromTo(
    el,
    { letterSpacing: from, textIndent: cs.textIndent === "0px" ? "0px" : from, ...(opts.fade === false ? {} : { opacity: 0 }) },
    { ...to, ...(opts.fade === false ? {} : { opacity: 1 }), duration: 1.6, ease: "expo.out", clearProps: "letterSpacing,textIndent" },
  );
}

/**
 * A code decodes: random characters resolve into the real ones, left to
 * right (the "#" stays put).
 */
function decode(el: HTMLElement, delay = 0) {
  const real = el.textContent ?? "";
  const pool = "0123456789ABCDEF";
  const state = { p: 0 };
  el.style.fontVariantNumeric = "tabular-nums";
  return gsap.to(state, {
    p: 1,
    duration: 0.9,
    delay,
    ease: "power2.out",
    onUpdate: () => {
      const fixed = Math.floor(state.p * real.length);
      el.textContent = [...real].map((ch, i) => (i < fixed || ch === "#" ? ch : pool[Math.floor(Math.random() * pool.length)])).join("");
    },
    onComplete: () => {
      el.textContent = real;
    },
  });
}

/**
 * The band's photo wall: frames open upward as they scroll in, a few at a
 * time (ScrollTrigger.batch, so a long wall stays cheap), each photo
 * settling from a slight zoom as its frame opens.
 */
function collage() {
  const box = q("[data-v4-collage]");
  if (!box) return;
  const tiles = qa("[data-v4-tile]", box);
  gsap.set(tiles, { clipPath: "inset(100% 0% 0% 0%)" });

  ScrollTrigger.batch(tiles, {
    start: "top 92%",
    once: true,
    onEnter: (batch) => {
      gsap.to(batch, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, stagger: 0.08, ease: "expo.inOut" });
      gsap.fromTo(
        batch.map((t) => q(".media", t)).filter(Boolean),
        { scale: 1.2 },
        { scale: 1, duration: 1.6, stagger: 0.08, ease: "expo.out", delay: 0.15 },
      );
    },
  });
}

function reveals() {
  // Section headings: word by word, each rising from behind its own mask.
  // Section headings and the back cover's names: letter by letter, each
  // rising from behind its word's mask in a quick ripple.
  for (const el of qa("h2.v4-script[data-v4-rise], .cover__names .v4-script[data-v4-rise]")) {
    const letters = splitLetters(el);
    gsap.fromTo(
      letters,
      { yPercent: 115 },
      {
        yPercent: 0,
        duration: 1,
        stagger: 0.028,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
        // Lift the masks once settled, so no swash is ever clipped.
        onComplete: () => el.classList.add("is-in"),
      },
    );
    // The letters are tucked under their masks now, so the heading itself
    // can show (v4.css hides every [data-v4-rise] until its motion takes over).
    gsap.set(el, { opacity: 1 });
  }

  for (const el of qa("[data-v4-rise]:not(h2.v4-script):not(.cover__names .v4-script)")) {
    gsap.fromTo(el, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } });
  }

  // One-line spaced caps tighten into place as they arrive.
  for (const el of qa<HTMLElement>(".count__eyebrow")) {
    const tw = trackIn(el, { from: "0.45em" }).pause();
    ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: () => tw.play() });
  }
  // The back cover's closing line, desktop only: on a phone it may wrap,
  // and a line that rewraps mid-motion jumps.
  const closing = q<HTMLElement>(".cover__closing");
  if (closing) {
    gsap.matchMedia().add("(min-width: 900px)", () => {
      const tw = trackIn(closing, { from: "0.18em", fade: false }).pause();
      ScrollTrigger.create({ trigger: closing, start: "top 88%", once: true, onEnter: () => tw.play() });
    });
  }

  // The swatches' colour codes decode as their cards flip up.
  qa<HTMLElement>(".card__hex").forEach((el, i) => {
    ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: () => decode(el, 0.35 + i * 0.12) });
  });

  for (const el of qa("[data-v4-beat]").slice(1)) {
    ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: () => heartbeat(el) });
  }

  // Photos open upward, the picture settling from a slight zoom as it does.
  for (const el of qa("[data-v4-wipe]")) {
    const st = { trigger: el, start: "top 88%" };
    gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut", scrollTrigger: st });
    const img = q(".media__img, img", el);
    if (img) gsap.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.8, ease: "expo.out", scrollTrigger: st });
  }

  for (const el of qa("[data-v4-row]")) {
    gsap.from(el, { x: 40, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%" } });
  }

  // Swatch cards flip up one after another.
  const cards = qa("[data-v4-card]");
  if (cards.length) {
    gsap.from(cards, {
      rotateX: -70,
      y: 40,
      opacity: 0,
      transformOrigin: "50% 100%",
      transformPerspective: 900,
      duration: 1.1,
      stagger: 0.12,
      ease: "expo.out",
      scrollTrigger: { trigger: cards[0], start: "top 85%" },
    });
  }

  // "Before you arrive": each row wipes open left to right in turn, its icon
  // drawing itself stroke by stroke as its numeral rises into place.
  qa("[data-v4-note]").forEach((note, i) => {
    const paths = qa<SVGPathElement>(".note__icon path", note);
    paths.forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });
    const tl = gsap.timeline({ scrollTrigger: { trigger: note, start: "top 88%" }, delay: i * 0.12 });
    tl.fromTo(note, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut" })
      .from(q(".note__text", note), { x: -24, opacity: 0, duration: 0.9, ease: "expo.out" }, 0.35)
      .to(paths, { strokeDashoffset: 0, duration: 1, stagger: 0.12, ease: "power2.inOut" }, 0.4)
      .from(q(".note__n-i", note), { yPercent: 100, duration: 1, ease: "expo.out" }, 0.5)
      .set(note, { clearProps: "clipPath" });
  });

  // The quote settles in word by word.
  for (const quote of qa("[data-v4-words]")) {
    gsap.from(qa(".w", quote), { y: 30, opacity: 0, duration: 0.9, stagger: 0.035, ease: "expo.out", scrollTrigger: { trigger: quote, start: "top 80%" } });
  }

  // The wide moment drifts slower than the page.
  for (const box of qa("[data-v4-parallax]")) {
    const img = q(".media", box);
    if (img) gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: box, start: "top bottom", end: "bottom top", scrub: true } });
  }

  // The seal is pressed onto the reply card.
  // The reply form arrives in order: the choice, then each field, then send.
  const form = q("[data-rsvp]");
  if (form) {
    gsap.from(qa(".tiles, .line, .card__submit", form), {
      y: 18,
      opacity: 0,
      duration: 0.9,
      stagger: 0.07,
      ease: "expo.out",
      scrollTrigger: { trigger: form, start: "top 85%" },
      clearProps: "transform,opacity",
    });
  }

  const seal = q("[data-rsvp-seal]");
  if (seal) {
    gsap.from(seal, { scale: 1.8, rotate: -30, opacity: 0, duration: 0.9, ease: "back.out(2.4)", scrollTrigger: { trigger: seal, start: "top 85%" } });
  }
}

bar();
countdown();

if (!reduced) {
  // The bar starts tucked away (Header.astro); its own transition brings it in.
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add("bar-in")));
  hero();
  collage();
  ribbon();
  reveals();
  story();
  together();
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
}

// Last: it sits below the story's pinned scroll, so it must be measured after it.
cover();
