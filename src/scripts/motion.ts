/**
 * All motion on the site. One page, one lifecycle:
 *
 *   load → preloader counts up while fonts settle → its window opens into
 *   the hero → smooth scroll + every ScrollTrigger is built.
 *
 * Everything scroll-driven lives inside a gsap.matchMedia so reduced motion
 * gets a still, fully visible page (and the CSS fallbacks in each component).
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const root = document.documentElement;
const MOTION = "(prefers-reduced-motion: no-preference)";
const DESKTOP = "(min-width: 900px)";

const q = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  scope.querySelector<T>(sel);
const qa = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => [
  ...scope.querySelectorAll<T>(sel),
];
const reduced = () => root.classList.contains("reduce-motion");
const vh = () => window.innerHeight;

let smoother: ScrollSmoother | null = null;

/* ------------------------------------------------------------------ */
/* Preloader                                                           */
/* ------------------------------------------------------------------ */

function preloader(): Promise<void> {
  const el = q("[data-preloader]");
  const done = () => {
    el?.remove();
    root.classList.remove("is-loading");
  };
  if (!el || reduced()) {
    done();
    return Promise.resolve();
  }

  const win = q("[data-preloader-window]", el)!;
  const pct = q("[data-preloader-pct]", el)!;
  const frames = qa(".preloader__frame", el);
  const type = q(".preloader__type", el)!;

  // Flick through the frames; the last one is the hero, so it lands there.
  let frame = 0;
  frames[0]?.classList.add("is-on");
  const flick = window.setInterval(() => {
    if (frame >= frames.length - 1) return;
    frames[frame]?.classList.remove("is-on");
    frames[++frame]?.classList.add("is-on");
  }, 520);

  let fontsReady = false;
  document.fonts.ready.then(() => (fontsReady = true));

  return new Promise((resolve) => {
    const state = { p: 0 };
    const tl = gsap.timeline();

    tl.to(win, { "--w": 1, duration: 0.9, ease: "expo.out", delay: 0.25 }, 0);
    tl.to(state, {
      p: 1,
      duration: 2.6,
      ease: "power2.inOut",
      onUpdate() {
        // Never claim 100% before the type is actually ready.
        const p = fontsReady ? state.p : Math.min(state.p, 0.9);
        el.style.setProperty("--p", p.toFixed(3));
        pct.textContent = `${Math.round(p * 100)}%`;
      },
    }, 0);

    tl.add(() => {
      const finish = () => {
        window.clearInterval(flick);
        frames.forEach((f, i) => f.classList.toggle("is-on", i === frames.length - 1));
        el.style.setProperty("--p", "1");
        pct.textContent = "100%";

        // Lift the window out of the type and open it to the full screen.
        const r = win.getBoundingClientRect();
        el.appendChild(win);
        gsap.set(win, {
          position: "fixed",
          margin: 0,
          left: r.left,
          top: r.top,
          width: r.width,
          height: r.height,
          "--w": 1,
        });

        gsap
          .timeline({
            onComplete() {
              done();
              resolve();
            },
          })
          .to(type, { autoAlpha: 0, duration: 0.5, ease: "power2.out" }, 0)
          .to(q(".preloader__bar", el), { autoAlpha: 0, duration: 0.4 }, 0)
          .to(pct, { autoAlpha: 0, duration: 0.4 }, 0)
          .to(win, {
            left: 0,
            top: 0,
            width: window.innerWidth,
            height: window.innerHeight,
            duration: 1.25,
            ease: "expo.inOut",
          }, 0.15)
          .to(el, { autoAlpha: 0, duration: 0.45, ease: "power1.out" }, ">-0.05");
      };
      fontsReady ? finish() : document.fonts.ready.then(finish);
    });
  });
}

/* ------------------------------------------------------------------ */
/* Header + menu + in-page links                                       */
/* ------------------------------------------------------------------ */

function chrome() {
  const header = q("[data-header]")!;
  const toggle = q<HTMLButtonElement>("[data-menu-toggle]")!;
  const hero = q("[data-hero]");

  const setMenu = (open: boolean) => {
    root.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    smoother?.paused(open);
  };

  toggle.addEventListener("click", () => setMenu(!root.classList.contains("menu-open")));
  q("[data-menu-close]")?.addEventListener("click", () => setMenu(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && root.classList.contains("menu-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  for (const link of qa<HTMLAnchorElement>("[data-scroll-to]")) {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      const target = id && id.startsWith("#") ? q(id) : null;
      if (!target) return;
      e.preventDefault();
      const wasOpen = root.classList.contains("menu-open");
      setMenu(false);
      // Let the menu start closing before the page moves under it.
      window.setTimeout(() => {
        if (smoother) smoother.scrollTo(target, true, "top top");
        else target.scrollIntoView({ behavior: reduced() ? "auto" : "smooth" });
      }, wasOpen ? 350 : 0);
    });
  }

  // Glass over the hero, solid once it's gone.
  if (hero) {
    ScrollTrigger.create({
      trigger: hero,
      start: "bottom top+=80",
      onEnter: () => header.classList.add("is-solid"),
      onLeaveBack: () => header.classList.remove("is-solid"),
    });
  } else {
    header.classList.add("is-solid");
  }

  // Like Vero, the name only sits in the header for the opening stretch -
  // after that the photography gets the whole top of the screen.
  const opening = q(".promise");
  if (opening) {
    ScrollTrigger.create({
      trigger: opening,
      start: "top bottom",
      // Through the opening headline, gone well before the invitation copy.
      end: "top -60%",
      toggleClass: { targets: header, className: "has-brand" },
    });
  }
}

/* ------------------------------------------------------------------ */
/* Scroll scenes                                                       */
/* ------------------------------------------------------------------ */

/** Masked lines rise into place. */
function lines(scope: Element, opts: gsap.TweenVars = {}) {
  return gsap.from(qa(".line__inner", scope), {
    yPercent: 108,
    duration: 1.3,
    ease: "expo.out",
    stagger: 0.08,
    ...opts,
  });
}

function reveals() {
  for (const el of qa("[data-reveal]")) {
    lines(el, { scrollTrigger: { trigger: el, start: "top 88%" } });
  }

  for (const el of qa("[data-reveal-fade], [data-fade]")) {
    gsap.from(el, {
      autoAlpha: 0,
      y: el.hasAttribute("data-fade") ? 40 : 12,
      duration: 1.4,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  }

  // Photos open upward from their bottom edge, settling from a slight zoom.
  for (const el of qa("[data-mask]")) {
    const inner = el.querySelector("img") ?? el;
    gsap
      .timeline({ scrollTrigger: { trigger: el, start: "top 92%" } })
      .fromTo(
        el,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" },
      )
      .from(inner === el ? [] : inner, { scale: 1.25, duration: 1.8, ease: "expo.out" }, 0.2);
  }
}

function hero() {
  const section = q("[data-hero]");
  if (!section) return;
  const frame = q("[data-hero-frame]", section)!;
  const brand = q("[data-hero-brand]", section)!;

  // Entrance once the preloader has handed over.
  gsap.from(brand.children, {
    yPercent: 40,
    autoAlpha: 0,
    duration: 1.6,
    ease: "expo.out",
    stagger: 0.12,
  });

  // On the way out the frame draws in to a card and the name sinks away.
  gsap
    .timeline({
      scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
    })
    .fromTo(
      frame,
      { clipPath: "inset(0% 0% 0% 0%)" },
      { clipPath: "inset(8% 4% 0% 4%)", ease: "none" },
      0,
    )
    .to(q(".hero__media, .hero__video", frame), { yPercent: 18, scale: 1.08, ease: "none" }, 0)
    .to(brand, { yPercent: 35, autoAlpha: 0, ease: "power1.in" }, 0);
}

function promise() {
  const stage = q("[data-promise-stage]");
  const bottom = q("[data-promise-bottom]");
  if (!stage || !bottom) return;
  lines(bottom, { scrollTrigger: { trigger: stage, start: "top 20%" } });
}

/*
 * Pins that CSS sticky can't do under ScrollSmoother (the content moves by
 * transform, so nothing ever "scrolls" for sticky to react to).
 */
function pins(isDesktop: boolean) {
  // Diptych: the portrait holds while the right column scrolls past it.
  const diptych = q("[data-diptych]");
  const portrait = q("[data-pin-diptych]");
  if (isDesktop && diptych && portrait) {
    const gutter = () => parseFloat(getComputedStyle(root).getPropertyValue("--gutter")) || 20;
    ScrollTrigger.create({
      trigger: portrait,
      start: () => `top ${gutter()}px`,
      end: () => `+=${Math.max(0, diptych.offsetHeight - portrait.offsetHeight)}`,
      pin: true,
      pinSpacing: false,
      invalidateOnRefresh: true,
    });
  }

  // Moments: like Vero's "Explore the gallery", the button only shows while
  // the grid is under it - it fades in as it pins mid-screen, holds while the
  // grid drifts past, and fades out as the grid leaves.
  const field = q("[data-moments-field]");
  const cta = q("[data-pin-cta]");
  const btn = cta && q(".btn", cta);
  if (field && cta && btn) {
    gsap.set(btn, { autoAlpha: 0 });
    const show = (on: boolean) =>
      gsap.to(btn, { autoAlpha: on ? 1 : 0, duration: 0.5, ease: "power2.out", overwrite: true });
    ScrollTrigger.create({
      trigger: cta,
      start: "top 50%",
      endTrigger: field,
      end: "bottom 60%",
      pin: true,
      pinSpacing: false,
      onToggle: (self) => show(self.isActive),
    });
  }
}

function story(isDesktop: boolean) {
  const section = q("[data-story]");
  if (!section) return;
  const pin = q("[data-story-pin]", section)!;
  const frame = q("[data-story-frame]", section)!;
  const intro = q("[data-story-intro]", section)!;
  const slides = qa("[data-story-slide]", section);
  const steps = qa("[data-story-step]", section);
  const dots = qa("[data-story-dot]", section);
  const caption = q("[data-story-caption]", section)!;
  const dotList = q(".story__dots", section)!;

  // The small card sits under the headline; narrower screens get a taller card.
  const card = isDesktop
    ? { "--t": "68%", "--x": "44%", "--b": "9%" }
    : { "--t": "62%", "--x": "34%", "--b": "12%" };
  gsap.set([caption, dotList], { autoAlpha: 0 });

  let active = -1;
  const setStep = (i: number) => {
    if (i === active) return;
    active = i;
    steps.forEach((s, n) => s.classList.toggle("is-active", n === i));
    dots.forEach((d, n) => d.classList.toggle("is-active", n === i));
  };
  setStep(0);

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
    .from(q("img, .media", slides[0]!), { scale: 1.3, duration: 1.2, ease: "power2.out" }, 0)
    .to([caption, dotList], { autoAlpha: 1, duration: 0.3 }, 1)
    .add(() => {}, "+=0.35");

  // Timeline times at which each later chapter's wipe is halfway across;
  // its word lights up from there.
  const marks: number[] = [];
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
    marks.push(at + 0.5);
  }

  tl.eventCallback("onUpdate", () => {
    const t = tl.time();
    setStep(marks.filter((m) => t >= m).length);
  });
}

function moments(isDesktop: boolean) {
  const items = qa(".moments__item");
  if (!items.length) return;
  const grid = q(".moments__grid")!;
  // Each column drifts at its own pace, like Vero's staggered grid.
  const speeds = isDesktop ? [0.04, 0.2, 0.1, 0.26, 0.07] : [0.05, 0.18, 0.1, 0.18, 0.05];
  for (const item of items) {
    const col = Number(item.dataset.col ?? 0) % (isDesktop ? 5 : 3);
    gsap.fromTo(
      item,
      { y: () => vh() * speeds[col]! },
      {
        y: () => -vh() * speeds[col]!,
        ease: "none",
        scrollTrigger: {
          trigger: grid,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );
  }
}

function verse() {
  const body = q("[data-verse]");
  if (!body) return;
  const seal = q("[data-verse-seal]", body)!;
  const svg = q("svg", seal)!;

  qa("[data-verse-line]", body).forEach((line, i) => {
    const dir = i % 2 ? -1 : 1;
    gsap.fromTo(
      line,
      { xPercent: 6 * dir },
      {
        xPercent: -6 * dir,
        ease: "none",
        scrollTrigger: { trigger: body, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });

  // The seal travels down the lane between the halves and turns as it goes.
  gsap
    .timeline({
      scrollTrigger: {
        trigger: body,
        start: "top 70%",
        end: "bottom 40%",
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    })
    .fromTo(
      seal,
      { y: 0 },
      { y: () => body.offsetHeight - seal.offsetHeight, ease: "none" },
      0,
    )
    .fromTo(svg, { rotateY: -40, rotateZ: -8 }, { rotateY: 680, rotateZ: 8, ease: "none" }, 0);
}

function rsvpSeal() {
  const seal = q("[data-rsvp-seal]");
  if (!seal) return;
  gsap.from(q("svg", seal), {
    rotateY: -540,
    scale: 0.7,
    autoAlpha: 0,
    duration: 2.2,
    ease: "expo.out",
    scrollTrigger: { trigger: seal, start: "top 85%" },
  });
}

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */

async function init() {
  window.scrollTo(0, 0);
  await preloader();

  const mm = gsap.matchMedia();
  mm.add(
    { motion: MOTION, desktop: DESKTOP },
    (ctx) => {
      const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
      if (!motion) return;

      root.classList.add("has-smoother");
      smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.1,
        smoothTouch: false,
        normalizeScroll: false,
      });

      hero();
      promise();
      story(desktop);
      // After story(): pins are measured in creation order, and these sit
      // below the story's pin spacer.
      pins(desktop);
      reveals();
      moments(desktop);
      verse();
      rsvpSeal();

      return () => {
        root.classList.remove("has-smoother");
        smoother?.kill();
        smoother = null;
      };
    },
  );

  chrome();

  // Late-arriving photos and fonts can shift layout; re-measure once settled.
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
}

init();
