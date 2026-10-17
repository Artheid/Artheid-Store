/* =========================================================
   app.js  -  builds the page from apps.js
   You normally do NOT need to edit this file.
   ========================================================= */

const ROOT    = document.body.dataset.root || "";
const CURRENT = document.body.dataset.app || MAIN_APP;
const app     = APPS[CURRENT];

let screenshotList = [];   // used by the fullscreen viewer
let gradientCount  = 0;    // gives every SVG gradient its own id


/* ---------- 1. ICONS ---------- */

const ICONS = {
  x:      '<path d="M6 6l12 12M18 6L6 18"/>',
  dl:     '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
  check:  '<path class="draw" pathLength="1" d="M5 12.5l4.5 4.5L19 7"/>',
  globe:  '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  star:   '<path d="M12 3l2.8 6 6.2.7-4.6 4.2 1.3 6.1L12 17l-5.7 3 1.3-6.1L3 9.7 9.2 9z"/>',
  box:    '<path d="M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  tag:    '<path d="M4 12V4h8l8 8-8 8z"/><path d="M8.5 8.5h.01"/>',
  clock:  '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  phone:  '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',
  coin:   '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 10a2.5 2 0 0 1 5 0c0 2.5-5 1.5-5 4a2.5 2 0 0 0 5 0"/>',
};

function icon(name, extraClass = "") {
  return `<svg class="icon ${extraClass}" viewBox="0 0 24 24">${ICONS[name]}</svg>`;
}


/* ---------- 2. SMALL HELPERS ---------- */

// Make every path relative to the page, so it works on GitHub Pages
// (https://username.github.io/repo-name/) and on any other host.
// "https://..." links are kept as they are.
function fileUrl(path) {
  if (!path) return "";
  if (/^https?:/i.test(path)) return path;
  return ROOT + path.replace(/^\/+/, "");
}

// APK link: put the APK file name (or a full https link) in apps.js -> apk
function apkUrl(a) {
  return fileUrl(a.apk);
}

// Where an app page lives
function pageUrl(key) {
  if (APPS[key].page) return APPS[key].page;
  return ROOT + (key === MAIN_APP ? "index.html" : key + ".html");
}


/* ---------- 3. SVG DRAWINGS (logo, screenshots, stars) ---------- */

function gradient(a, id, x2 = 1) {
  return `
    <linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="1">
      <stop offset="0" stop-color="${a.colorFrom}"/>
      <stop offset="1" stop-color="${a.colorTo}"/>
    </linearGradient>`;
}

function logoSvg(a) {
  // logo image given: use it. Otherwise draw the logo from "glyph"
  if (a.logo) {
    return `<img class="logo" src="${fileUrl(a.logo)}" alt="${a.name} logo">`;
  }
  const id = "logo" + gradientCount++;
  return `
    <svg class="logo" viewBox="0 0 48 48">
      <defs>${gradient(a, id)}</defs>
      <rect width="48" height="48" fill="url(#${id})"/>
      <g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${a.glyph}</g>
    </svg>`;
}

// one white rounded box (used to draw the screenshot screens)
function box(x, y, w, h, radius, opacity) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="#fff" fill-opacity="${opacity}"/>`;
}

// 3 different screen layouts
const SCREEN_LAYOUTS = [
  () => box(14, 44, 132, 76, 12, 0.28) + box(14, 132, 132, 34, 10, 0.2) + box(14, 174, 132, 34, 10, 0.2) + box(14, 216, 132, 34, 10, 0.2),
  () => box(14, 44, 62, 86, 12, 0.28) + box(84, 44, 62, 86, 12, 0.2) + box(14, 138, 62, 86, 12, 0.2) + box(84, 138, 62, 86, 12, 0.28),
  (a) => `
    <circle cx="80" cy="100" r="40" fill="#fff" fill-opacity="0.25"/>
    <g transform="translate(56 76)" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${a.glyph}</g>
    ${box(30, 164, 100, 10, 5, 0.5)} ${box(45, 184, 70, 8, 4, 0.3)} ${box(30, 246, 100, 36, 18, 1)}`,
];

function screenshotSvg(a, n) {
  const id = "shot" + gradientCount++;
  const content = SCREEN_LAYOUTS[n % 3](a);
  return `
    <svg viewBox="0 0 160 320">
      <defs>${gradient(a, id, n % 2)}</defs>
      <rect width="160" height="320" fill="url(#${id})"/>
      ${box(14, 14, 40, 8, 4, 0.6)} ${box(118, 14, 28, 8, 4, 0.4)}
      ${content}
    </svg>`;
}

// 5 stars. Full star = full color, partly filled = lighter
function starsHtml(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    const opacity = rating >= i ? 1 : rating > i - 1 ? 0.55 : 0.2;
    html += `<svg class="icon" viewBox="0 0 24 24" style="opacity:${opacity}">${ICONS.star}</svg>`;
  }
  return `<div class="stars">${html}</div>`;
}


/* ---------- 4. BUILD THE PAGE ---------- */

function render() {

  /* screenshots: your images if given, else SVG screens */
  if (app.screenshots.length) {
    screenshotList = app.screenshots.map((src) => `<img src="${fileUrl(src)}" alt="${app.name} screenshot">`);
  } else {
    screenshotList = [0, 1, 2, 3, 4].map((n) => screenshotSvg(app, n));
  }

  /* --- top: logo, name, company --- */
  const topHtml = `
    <div class="top-row">
      <button data-logo aria-label="View logo">${logoSvg(app)}</button>
      <div class="top-text">
        <h1 class="one-line">${app.name}</h1>
        <div class="company one-line">${app.company}</div>
      </div>
    </div>`;

  /* --- website button (hidden when no website link) --- */
  const websiteHtml = app.website ? `
      <a class="btn btn-website" href="${app.website}" target="_blank" rel="noopener">
        ${icon("globe")}
        <span>Visit website</span>
      </a>` : "";

  /* --- buttons --- */
  const buttonsHtml = `
    <div class="buttons">
      <a class="btn btn-install" id="install" href="${apkUrl(app)}" download="${app.name}.apk">
        <i class="btn-fill"></i>
        <span class="btn-icon">${icon("dl")}</span>
        <span class="btn-label">Install</span>
      </a>
      ${websiteHtml}
    </div>`;

  /* --- stats row: add or remove items here --- */
  const stats = [
    { icon: "star",   value: app.rating.toFixed(1), label: app.reviews + " reviews", cls: "gold" },
    { icon: "dl",     value: app.downloads,         label: "Downloads" },
    { icon: "box",    value: app.size,              label: "Size" },
    { icon: "shield", value: app.age,               label: "Age rating" },
    { icon: "tag",    value: "v" + String(app.version).replace(/^v/i, ""),     label: "Version" },
    { icon: "clock",  value: app.updated,           label: "Updated" },
    { icon: "phone",  value: app.android,           label: "Android" },
    { icon: "coin",   value: app.price,             label: "Price" },
  ];
  const statsHtml = `
    <div class="stats">
      ${stats.map((s) => `
        <div class="stat">
          ${icon(s.icon, s.cls || "")}
          <b>${s.value}</b>
          <span>${s.label}</span>
        </div>`).join("")}
    </div>`;

  /* --- screenshots --- */
  const shotsHtml = `
    <div class="row-scroll">
      ${screenshotList.map((s, i) => `
        <button class="shot" data-shot="${i}" aria-label="Screenshot ${i + 1}">${s}</button>`).join("")}
    </div>`;

  /* --- about + tags --- */
  const aboutHtml = `
    <h2>About</h2>
    <p class="about">${app.about}</p>
    <div class="row-scroll">
      ${app.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
    </div>`;

  /* --- ratings (display only) --- */
  const barWidths = [1, 2, 3, 4, 5].map((star) => {
    const w = 100 * Math.exp(-Math.pow(star - app.rating, 2) / 1.2);
    return Math.max(3, Math.round(w));
  }).reverse();
  const ratingHtml = `
    <h2>Ratings</h2>
    <div class="ratings">
      <div>
        <span class="rating-number">${app.rating.toFixed(1)}</span>
        ${starsHtml(app.rating)}
        <small class="muted one-line">${app.reviews} reviews</small>
      </div>
      <div class="bars">
        ${barWidths.map((w, i) => `
          <div class="bar-line">${5 - i}
            <span class="bar-track"><span class="bar-fill" data-width="${w}"></span></span>
          </div>`).join("")}
      </div>
    </div>`;

  /* --- related apps (each one opens its own file) --- */
  const otherKeys = Object.keys(APPS).filter((k) => k !== CURRENT).slice(0, 6);
  const relatedHtml = `
    <h2>You might also like</h2>
    <div class="row-scroll">
      ${otherKeys.map((k) => `
        <a class="related" href="${pageUrl(k)}">
          ${logoSvg(APPS[k])}
          <b class="one-line">${APPS[k].name}</b>
          <span class="one-line">${APPS[k].category} · ${APPS[k].rating}★</span>
        </a>`).join("")}
    </div>`;

  /* --- put everything on the page (sections appear one by one) --- */
  const sections = [topHtml, buttonsHtml, statsHtml, shotsHtml, aboutHtml, ratingHtml, relatedHtml];
  const main = document.getElementById("app");
  main.className = "reveal";
  main.innerHTML = sections.map((html, i) => `<div style="--delay:${i * 60}ms">${html}</div>`).join("");

  document.title = app.name + " - " + app.company;

  /* animate the rating bars */
  requestAnimationFrame(() => requestAnimationFrame(() => {
    main.querySelectorAll("[data-width]").forEach((bar) => {
      bar.style.width = bar.dataset.width + "%";
    });
  }));
}


/* ---------- 5. INSTALL BUTTON ANIMATION ---------- */
/* The APK download starts from the link itself.
   This only plays the progress animation. */

function startInstall(btn) {
  if (btn.dataset.busy) return;
  btn.dataset.busy = "1";

  const fill  = btn.querySelector(".btn-fill");
  const label = btn.querySelector(".btn-label");
  const iconBox = btn.querySelector(".btn-icon");
  const DURATION = 2400;   // milliseconds
  const start = performance.now();

  iconBox.classList.add("bounce");

  function tick(now) {
    const progress = Math.min(1, (now - start) / DURATION);
    const eased = 1 - Math.pow(1 - progress, 2);
    fill.style.width = eased * 100 + "%";
    label.textContent = progress < 1 ? "Downloading " + Math.round(eased * 100) + "%" : "Downloaded";

    if (progress < 1) {
      requestAnimationFrame(tick);
      return;
    }
    iconBox.classList.remove("bounce");
    iconBox.innerHTML = icon("check");
    btn.classList.add("done");
    setTimeout(() => resetInstall(btn, fill, label, iconBox), 2600);
  }
  requestAnimationFrame(tick);
}

function resetInstall(btn, fill, label, iconBox) {
  btn.classList.remove("done");
  fill.style.width = 0;
  label.textContent = "Install";
  iconBox.innerHTML = icon("dl");
  delete btn.dataset.busy;
}


/* ---------- 6. FULLSCREEN VIEWER ---------- */
/* list = array of SVG/img html. Swipe left/right, pinch or double-tap to zoom */

function openLightbox(list, startIndex) {
  const box = document.createElement("div");
  box.className = "lightbox";
  box.innerHTML = `
    <button class="lb-close" aria-label="Close">${icon("x")}</button>
    <div class="lb-count"></div>
    <div class="lb-track">
      ${list.map((s) => `<div class="lb-slide"><div class="lb-zoom">${s}</div></div>`).join("")}
    </div>`;
  document.body.appendChild(box);
  document.body.style.overflow = "hidden";

  const track   = box.querySelector(".lb-track");
  const counter = box.querySelector(".lb-count");

  let index = startIndex;                 // slide now visible
  let scale = 1, x = 0, y = 0;            // zoom and move
  let pinchStart = 0, scaleStart = 1;     // pinch zoom
  let lastX = 0, lastY = 0;               // finger position

  const zoomBox = () => track.children[index].firstChild;

  function applyZoom() {
    zoomBox().style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    track.style.overflowX = scale > 1 ? "hidden" : "";   // stop sliding while zoomed
  }

  function resetZoom() {
    scale = 1; x = 0; y = 0;
    applyZoom();
  }

  function showCounter() {
    counter.textContent = list.length > 1 ? (index + 1) + " / " + list.length : "";
  }

  function closeBox() {
    box.remove();
    document.body.style.overflow = "";
    removeEventListener("keydown", onKey);
  }

  function onKey(e) {
    const page = track.clientWidth;
    if (e.key === "Escape")     closeBox();
    if (e.key === "ArrowRight") track.scrollBy({ left: page, behavior: "smooth" });
    if (e.key === "ArrowLeft")  track.scrollBy({ left: -page, behavior: "smooth" });
  }

  function fingerDistance(touches) {
    return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
  }

  /* open + close */
  addEventListener("keydown", onKey);
  box.querySelector(".lb-close").onclick = closeBox;
  track.scrollLeft = startIndex * track.clientWidth;
  showCounter();

  /* slide changed */
  track.onscroll = () => {
    const now = Math.round(track.scrollLeft / track.clientWidth);
    if (now === index) return;
    resetZoom();
    index = now;
    showCounter();
  };

  /* zoom: double click / double tap */
  track.ondblclick = () => {
    if (scale > 1) { resetZoom(); return; }
    scale = 2.4;
    applyZoom();
  };

  /* zoom: mouse wheel */
  track.onwheel = (e) => {
    e.preventDefault();
    scale = Math.min(5, Math.max(1, scale - e.deltaY * 0.004));
    if (scale === 1) { x = 0; y = 0; }
    applyZoom();
  };

  /* zoom: two fingers, move: one finger while zoomed */
  track.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) {
      pinchStart = fingerDistance(e.touches);
      scaleStart = scale;
    } else {
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
    }
  });

  track.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      scale = Math.min(5, Math.max(1, scaleStart * fingerDistance(e.touches) / pinchStart));
      if (scale === 1) { x = 0; y = 0; }
      applyZoom();
    } else if (scale > 1) {
      e.preventDefault();
      x += e.touches[0].clientX - lastX;
      y += e.touches[0].clientY - lastY;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      applyZoom();
    }
  }, { passive: false });
}


/* ---------- 7. CLICKS + START ---------- */

document.addEventListener("click", (e) => {
  const logoBtn = e.target.closest("[data-logo]");
  const shotBtn = e.target.closest("[data-shot]");
  const install = e.target.closest("#install");

  if (install) startInstall(install);
  else if (shotBtn) openLightbox(screenshotList, Number(shotBtn.dataset.shot));   // screenshots slide
  else if (logoBtn) openLightbox([logoSvg(app)], 0);                              // logo only, no slide
});

setTimeout(render, 500);   // short loading skeleton first
