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
