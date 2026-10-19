// aleem89.github.io — small enhancements, no dependencies.
(() => {
  const $ = (sel) => document.querySelector(sel);

  // Live date, Dallas time, and a day-of-week phrase. Refreshes every 30 s.
  const phrases = [
    "Relax, it's Sunday",
    "Motivation Monday",
    "Take-it-easy Tuesday",
    "Wellness Wednesday",
    "Thriving Thursday",
    "Feel-good Friday",
    "Super Saturday",
  ];
  const ordinal = (d) => (d > 3 && d < 21 ? "th" : ["th", "st", "nd", "rd"][d % 10] || "th");
  const tz = "America/Chicago";

  function tick() {
    const now = new Date();
    const dallas = new Date(now.toLocaleString("en-US", { timeZone: tz }));
    const month = dallas.toLocaleString("en-US", { month: "long", timeZone: tz });
    const day = dallas.getDate();
    const dateEl = $("#todayDate");
    if (dateEl) {
      dateEl.textContent = `${month} ${day}${ordinal(day)}, ${dallas.getFullYear()}`;
      dateEl.dateTime = now.toISOString().slice(0, 10);
    }
    const timeEl = $("#localTime");
    if (timeEl) timeEl.textContent = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz }) + " CT";
    const phrase = phrases[dallas.getDay()];
    const p = $("#dayPhrase");
    if (p) p.textContent = phrase;
    const f = $("#footerPhrase");
    if (f) f.textContent = phrase + ".";
  }
  tick();
  setInterval(tick, 30_000);

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Nav border once scrolled; active link via IntersectionObserver.
  const nav = $("#nav");
  const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const links = [...document.querySelectorAll(".nav-links a")];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => spy.observe(s));
  }

  // Reveal-on-scroll. ?static=1 disables it (used for screenshot/QA runs).
  const reveals = document.querySelectorAll(".reveal");
  const isStatic = new URLSearchParams(location.search).has("static");
  if (isStatic) {
    reveals.forEach((el) => el.classList.add("in"));
    const d = document.createElement("div");
    d.id = "qa-overflow";
    d.hidden = true;
    d.textContent = `scrollWidth=${document.documentElement.scrollWidth} clientWidth=${document.documentElement.clientWidth}`;
    document.body.appendChild(d);
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { threshold: 0.12 },
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  // Copy email button.
  const copy = $("#copyEmail");
  if (copy) {
    const label = copy.textContent;
    copy.addEventListener("click", async () => {
      const email = copy.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        copy.textContent = "Copied!";
      } catch {
        window.location.href = "mailto:" + email;
        return;
      }
      copy.classList.add("copied");
      setTimeout(() => {
        copy.textContent = label;
        copy.classList.remove("copied");
      }, 1800);
    });
  }
})();
