// 顶部年份
document.getElementById("year").textContent = new Date().getFullYear();

// 移动端菜单
const toggleBtn = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
toggleBtn?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggleBtn.setAttribute("aria-expanded", String(open));
});

// 轮播
const carousel = document.querySelector(".carousel");
const track = document.querySelector(".carousel-track");
const slides = Array.from(document.querySelectorAll(".slide"));
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");
const dotsWrap = document.querySelector(".carousel-dots");

let index = 0;
let timer = null;

function buildDots() {
  dotsWrap.innerHTML = "";
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "dot" + (i === 0 ? " is-active" : "");
    dot.type = "button";
    dot.setAttribute("aria-label", `跳到第 ${i + 1} 张`);
    dot.addEventListener("click", () => goTo(i, true));
    dotsWrap.appendChild(dot);
  });
}

function setActiveState() {
  slides.forEach((s, i) => {
    const active = i === index;
    s.classList.toggle("is-active", active);
    s.setAttribute("aria-hidden", String(!active));
  });
  const dots = Array.from(document.querySelectorAll(".dot"));
  dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
}

function goTo(i, userAction = false) {
  index = (i + slides.length) % slides.length;
  track.style.transform = `translateX(${-index * 100}%)`;
  setActiveState();
  if (userAction) restartAutoplay();
}

function next(userAction = false) { goTo(index + 1, userAction); }
function prev(userAction = false) { goTo(index - 1, userAction); }

prevBtn?.addEventListener("click", () => prev(true));
nextBtn?.addEventListener("click", () => next(true));

function startAutoplay() {
  if (!carousel) return;
  const autoplay = carousel.dataset.autoplay === "true";
  const interval = Number(carousel.dataset.interval || 4500);
  if (!autoplay) return;
  timer = setInterval(() => next(false), interval);
}
function stopAutoplay() {
  if (timer) clearInterval(timer);
  timer = null;
}
function restartAutoplay() {
  stopAutoplay();
  startAutoplay();
}

// 鼠标悬停暂停（PC 友好）
carousel?.addEventListener("mouseenter", stopAutoplay);
carousel?.addEventListener("mouseleave", startAutoplay);

// 触屏滑动（手机）
let startX = 0;
let dx = 0;
let dragging = false;

carousel?.addEventListener("touchstart", (e) => {
  stopAutoplay();
  dragging = true;
  startX = e.touches[0].clientX;
  dx = 0;
}, { passive: true });

carousel?.addEventListener("touchmove", (e) => {
  if (!dragging) return;
  dx = e.touches[0].clientX - startX;
}, { passive: true });

carousel?.addEventListener("touchend", () => {
  if (!dragging) return;
  dragging = false;
  const threshold = 50; // 滑动阈值
  if (dx > threshold) prev(true);
  else if (dx < -threshold) next(true);
  else restartAutoplay();
});

// 初始化
buildDots();
goTo(0);
startAutoplay();
