const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const header = document.querySelector(".site-header");
const navLinks = document.querySelectorAll(".nav a[href^='#']");

const updateHeader = () => {
  header?.classList.toggle("scrolling", window.scrollY > 8);
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});

const sections = document.querySelectorAll("section[id]");
if (sections.length > 0 && navLinks.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => link.classList.remove("active"));
        const active = document.querySelector(`.nav a[href="#${entry.target.id}"]`);
        active?.classList.add("active");
      });
    },
    { threshold: 0.45 },
  );

  sections.forEach((section) => observer.observe(section));
}

const filterButtons = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const tags = card.dataset.tags.split(" ");
      const visible = selected === "all" || tags.includes(selected);
      card.classList.toggle("hidden", !visible);
    });
  });
});

const glitchCanvas = document.querySelector("#letter-glitch");

if (glitchCanvas) {
  const ctx = glitchCanvas.getContext("2d");
  const colors = ["#5e4491", "#a476ff", "#241a38", "#a9ff5b"];
  const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$&*()_+-=[]{};:<>,".split("");
  const cellWidth = 10;
  const cellHeight = 20;
  const fontSize = 16;
  let letters = [];
  let columns = 0;
  let rows = 0;

  const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

  const initialize = () => {
    const parent = glitchCanvas.parentElement;
    if (!parent || !ctx) return;

    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    glitchCanvas.width = rect.width * dpr;
    glitchCanvas.height = rect.height * dpr;
    glitchCanvas.style.width = `${rect.width}px`;
    glitchCanvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    columns = Math.ceil(rect.width / cellWidth);
    rows = Math.ceil(rect.height / cellHeight);
    letters = Array.from({ length: columns * rows }, () => ({
      char: randomItem(glyphs),
      color: randomItem(colors),
    }));
  };

  const draw = () => {
    if (!ctx) return;

    const rect = glitchCanvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";

    letters.forEach((letter, index) => {
      const x = (index % columns) * cellWidth;
      const y = Math.floor(index / columns) * cellHeight;
      ctx.fillStyle = letter.color;
      ctx.fillText(letter.char, x, y);
    });
  };

  const update = () => {
    const updateCount = Math.max(1, Math.floor(letters.length * 0.05));

    for (let index = 0; index < updateCount; index += 1) {
      const letter = letters[Math.floor(Math.random() * letters.length)];
      if (!letter) continue;
      letter.char = randomItem(glyphs);
      letter.color = randomItem(colors);
    }

    draw();
  };

  initialize();
  draw();
  setInterval(update, 55);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initialize();
      draw();
    }, 120);
  });
}
