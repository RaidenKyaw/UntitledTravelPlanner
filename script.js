const notes = document.querySelectorAll(".price-notes .note");
const HOLD = 2400;
const GAP = 900;
const POP_OUT = 380;
let i = 0;

function cycle() {
  const note = notes[i];
  note.classList.remove("hide");
  note.classList.add("show");

  setTimeout(() => {
    note.classList.remove("show");
    note.classList.add("hide");

    setTimeout(() => {
      note.classList.remove("hide");
      i = (i + 1) % notes.length;
      setTimeout(cycle, GAP);
    }, POP_OUT);
  }, HOLD);
}

if (notes.length) setTimeout(cycle, 800);

/* ---------- header: hide on scroll down, reveal on scroll up ---------- */

const header = document.querySelector(".site-header");
let lastY = window.scrollY;
let headerTick = false;
window.addEventListener("scroll", () => {
  if (headerTick) return;
  headerTick = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    if (y <= 80) header.classList.remove("hidden");
    else if (y > lastY + 4) header.classList.add("hidden");
    else if (y < lastY - 4) header.classList.remove("hidden");
    lastY = y;
    headerTick = false;
  });
}, { passive: true });

/* ---------- explore shelves ---------- */

const SHELVES = [
  {
    label: "Flights",
    items: [
      { title: "Sydney \u21c4 Tokyo", price: 486, was: 812, hot: true },
      { title: "Sydney \u21c4 Bali", price: 342, was: 519 },
      { title: "Melbourne \u21c4 Osaka", price: 512, was: 745 },
      { title: "Melbourne \u21c4 Hobart", price: 189, was: 205 },
      { title: "Sydney \u21c4 Honolulu", price: 654, was: 1120 },
      { title: "Melbourne \u21c4 Singapore", price: 398, was: 585 },
      { title: "Sydney \u21c4 Seoul", price: 573, was: 890 },
      { title: "Perth \u21c4 Phuket", price: 441, was: 660 },
      { title: "Brisbane \u21c4 Auckland", price: 289, was: 402 },
    ],
  },
  {
    label: "Stays",
    unit: "/night",
    items: [
      { title: "Le Clark, Paris", price: 145, was: 292 },
      { title: "Shibuya Loft, Tokyo", price: 210, was: 318 },
      { title: "Villa Ubud, Bali", price: 96, was: 187, hot: true },
      { title: "Harbour View, Sydney", price: 232, was: 305 },
      { title: "Riad Zina, Marrakech", price: 118, was: 154 },
      { title: "Casa Roma, Rome", price: 167, was: 243 },
      { title: "Alpine Lodge, Queenstown", price: 201, was: 338 },
      { title: "The Boro, New York", price: 289, was: 312 },
    ],
  },
  {
    label: "Things to do",
    unit: "pp",
    items: [
      { title: "Go Karting in Tokyo", price: 19, was: 124, hot: true },
      { title: "Snorkel the Reef, Cairns", price: 89, was: 135 },
      { title: "Cooking Class, Bangkok", price: 42, was: 61 },
      { title: "Surf Lessons, Bali", price: 35, was: 58 },
      { title: "Louvre After Hours, Paris", price: 74, was: 92 },
      { title: "Bridge Climb, Sydney", price: 168, was: 244 },
      { title: "Onsen Day Trip, Hakone", price: 56, was: 97 },
      { title: "Food Tour, Tokyo", price: 64, was: 89 },
    ],
  },
];

// Placeholder art. Real photos should get a washed-out pastel treatment to match.
const CARD_BGS = [
  "linear-gradient(135deg, #f0f7e2, #d7ecc4)",
  "linear-gradient(135deg, #eae7f8, #d3ccf0)",
  "linear-gradient(135deg, #f9ecd9, #f1d4bd)",
  "linear-gradient(135deg, #e2f0f5, #c6e1ec)",
  "linear-gradient(135deg, #f7f1e1, #e8dcbf)",
  "linear-gradient(135deg, #f8e8ec, #ebccd6)",
];

function pillColor(price, was) {
  const discount = Math.max(0, 1 - price / was);
  const hue = Math.min(discount, 0.8) / 0.8 * 120;
  return "hsl(" + hue.toFixed(0) + ", 52%, 84%)";
}

function buildShelf(shelf, index) {
  const el = document.createElement("div");
  el.className = "shelf";

  const head = document.createElement("div");
  head.className = "shelf-head";
  const h = document.createElement("h3");
  h.textContent = shelf.label;
  head.appendChild(h);
  el.appendChild(head);

  const carousel = document.createElement("div");
  carousel.className = "carousel";
  const track = document.createElement("div");
  track.className = "track";

  const addCard = (item, i) => {
    const card = document.createElement("a");
    card.className = "card";
    card.href = "#";
    card.style.background = CARD_BGS[(index * 2 + i) % CARD_BGS.length];

    const title = document.createElement("span");
    title.className = "card-title";
    title.textContent = item.title;
    card.appendChild(title);

    const pill = document.createElement("span");
    pill.className = "price-pill";
    pill.style.background = pillColor(item.price, item.was);
    const now = document.createElement("strong");
    now.textContent = "A$" + item.price;
    let unit = null;
    if (shelf.unit) {
      unit = document.createElement("span");
      unit.className = "unit";
      unit.textContent = shelf.unit;
    }
    const before = document.createElement("s");
    before.textContent = "A$" + item.was;
    const pct = document.createElement("span");
    pct.className = "pct";
    const discount = Math.max(0, 1 - item.price / item.was);
    pct.textContent = "↓" + Math.round(discount * 100) + "%";
    pct.style.color = "hsl(" + (Math.min(discount, 0.8) / 0.8 * 120).toFixed(0) + ", 45%, 32%)";
    pill.appendChild(now);
    if (unit) pill.appendChild(unit);
    pill.appendChild(before);
    pill.appendChild(pct);
    card.appendChild(pill);

    const tag = document.createElement("span");
    tag.className = "sample-tag";
    tag.textContent = "Sample";
    card.appendChild(tag);

    if (item.hot) {
      const badge = document.createElement("span");
      badge.className = "hot-flag";
      const flame = document.createElement("img");
      flame.src = "assets/fire.png";
      flame.alt = "";
      badge.appendChild(flame);
      badge.appendChild(document.createTextNode("Hot"));
      card.appendChild(badge);
    }

    track.appendChild(card);
  };
  for (let copy = 0; copy < 3; copy++) {
    shelf.items.forEach(addCard);
  }

  carousel.appendChild(track);
  el.appendChild(carousel);

  const nav = document.createElement("div");
  nav.className = "shelf-nav";
  const prev = document.createElement("button");
  prev.type = "button";
  prev.setAttribute("aria-label", "Previous " + shelf.label.toLowerCase());
  prev.innerHTML = "&#8592;";
  const next = document.createElement("button");
  next.type = "button";
  next.setAttribute("aria-label", "More " + shelf.label.toLowerCase());
  next.innerHTML = "&#8594;";
  nav.appendChild(prev);
  nav.appendChild(next);
  head.appendChild(nav);

  function step() {
    const card = track.querySelector(".card");
    return card ? card.offsetWidth + 16 - 40 : carousel.clientWidth;
  }
  function setWidth() {
    const kids = track.children;
    if (kids.length <= shelf.items.length) return 0;
    return kids[shelf.items.length].offsetLeft - kids[0].offsetLeft;
  }
  prev.addEventListener("click", () =>
    carousel.scrollBy({ left: -step(), behavior: "smooth" })
  );
  next.addEventListener("click", () =>
    carousel.scrollBy({ left: step(), behavior: "smooth" })
  );
  let settle;
  carousel.addEventListener("scroll", () => {
    clearTimeout(settle);
    settle = setTimeout(() => {
      const w = setWidth();
      if (!w) return;
      if (carousel.scrollLeft < w * 0.5) carousel.scrollLeft += w;
      else if (carousel.scrollLeft > w * 1.5) carousel.scrollLeft -= w;
    }, 140);
  }, { passive: true });
  requestAnimationFrame(() => {
    const card = track.querySelector(".card");
    const w = setWidth();
    const startFactor = [0.6, 1.35, 2.15][index % 3];
    if (card && w) carousel.scrollLeft = w + Math.round(card.offsetWidth * startFactor);
  });

  return el;
}

const shelvesRoot = document.getElementById("shelves");
if (shelvesRoot) {
  SHELVES.forEach((shelf, i) => shelvesRoot.appendChild(buildShelf(shelf, i)));
}

/* ---------- how it works: scroll-driven step wheel ---------- */

const howSection = document.querySelector(".how-section");
if (howSection) {
  const howSteps = Array.from(howSection.querySelectorAll(".step"));
  const howDots = Array.from(howSection.querySelectorAll(".dot"));
  const howBlob = howSection.querySelector(".how-blob");
  const BLOB_STATES = [
    { bg: "#cdeab3", br: "61% 39% 52% 48% / 44% 59% 41% 56%", rot: 0, sc: 1, x: 0, y: 0 },
    { bg: "#daf0bd", br: "73% 27% 38% 62% / 51% 74% 26% 49%", rot: 38, sc: 1, x: -30, y: 25 },
    { bg: "#bfe3d2", br: "29% 71% 64% 36% / 57% 33% 67% 43%", rot: -32, sc: 1.03, x: 35, y: -25 },
    { bg: "#f0ead2", br: "67% 33% 26% 74% / 39% 62% 38% 61%", rot: 55, sc: 0.98, x: -25, y: -30 },
    { bg: "#bfe4b0", br: "34% 66% 43% 57% / 71% 29% 71% 29%", rot: -50, sc: 1.02, x: 28, y: 30 },
  ];
  let howLastActive = -1;
  let howRaf = 0;

  function howUpdate() {
    const vh = window.innerHeight;
    const rect = howSection.getBoundingClientRect();
    const total = howSection.offsetHeight - vh;
    const progress = Math.min(1, Math.max(0, -rect.top / total));
    const n = howSteps.length;
    const staticMode =
      window.innerWidth < 760 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const raw = progress * (n - 1);
    const base = Math.floor(raw);
    const frac = raw - base;
    let e = 0;
    if (frac >= 0.85) e = 1;
    else if (frac > 0.15) {
      const t = (frac - 0.15) / 0.7;
      e = t * t * (3 - 2 * t);
    }
    const pos = Math.min(base + e, n - 1);

    if (staticMode) {
      if (howBlob) howBlob.style.background = BLOB_STATES[0].bg;
      return;
    }

    howSteps.forEach((el, i) => {
      const d = i - pos;
      const ad = Math.abs(d);
      const y = d * 150 * (1 + Math.min(ad, 2) * 0.15);
      const scale = Math.min(1, Math.max(0.6, 1.05 - ad * 0.25));
      let opacity = ad < 0.1 ? 1 : Math.max(0.62, 1 - ad * 0.24);
      const yAbs = Math.abs(y);
      if (yAbs > 195) opacity *= Math.max(0, 1 - (yAbs - 195) / 65);
      el.style.transform = "translateY(calc(-50% + " + y + "px)) scale(" + scale + ")";
      el.style.opacity = opacity.toFixed(3);
      const title = el.querySelector(".step-title");
      if (title) {
        const t = Math.max(0, 1 - ad);
        const mix = (a, b) => Math.round(a + (b - a) * t);
        title.style.color = "rgb(" + mix(107, 23) + ", " + mix(122, 33) + ", " + mix(92, 15) + ")";
      }
      el.style.pointerEvents = ad < 0.5 ? "auto" : "none";
    });

    const active = Math.round(pos);
    if (active !== howLastActive) {
      const first = howLastActive === -1;
      howLastActive = active;
      if (!first) {
        const tick = howSteps[active] && howSteps[active].querySelector(".step-inner");
        if (tick)
          tick.animate(
            [
              { transform: "scale(0.96)" },
              { transform: "scale(1.045)", offset: 0.55 },
              { transform: "scale(1)" },
            ],
            { duration: 280, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }
          );
      }
      const s = BLOB_STATES[active];
      if (howBlob && s) {
        howBlob.style.background = s.bg;
        howBlob.style.borderRadius = s.br;
        howBlob.style.transform =
          "translate(" + s.x + "px, " + s.y + "px) rotate(" + s.rot + "deg) scale(" + s.sc + ")";
      }
    }

    howDots.forEach((dot, i) => {
      const on = i === active;
      dot.style.background = on ? "#3a3a3a" : "#c2c9b8";
      dot.style.transform = on ? "scale(1.3)" : "scale(1)";
    });
  }

  function howGoTo(i) {
    const vh = window.innerHeight;
    const total = howSection.offsetHeight - vh;
    const top = howSection.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top + (i / (howSteps.length - 1)) * total,
      behavior: "smooth",
    });
  }

  howDots.forEach((dot, i) => dot.addEventListener("click", () => howGoTo(i)));
  window.addEventListener("scroll", () => {
    if (howRaf) return;
    howRaf = requestAnimationFrame(() => {
      howRaf = 0;
      howUpdate();
    });
  }, { passive: true });
  window.addEventListener("resize", howUpdate);
  setTimeout(howUpdate, 60);
}
