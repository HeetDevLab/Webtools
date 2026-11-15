/* Shared navigation helper for WebTools pages. Safe alongside legacy handlers. */
(() => {
  const button = document.getElementById("hamburger");
  const links = document.getElementById("navLinks");
  if (!button || !links) return;

  const setOpen = (open) => {
    button.classList.toggle("active", open);
    links.classList.toggle("open", open);
    links.classList.toggle("active", open);
    document.body.classList.toggle("nav-open", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  button.addEventListener("click", () => {
    setOpen(button.getAttribute("aria-expanded") !== "true");
  });
  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
  document.addEventListener("click", (event) => {
    if (links.classList.contains("open") &&
        !links.contains(event.target) &&
        !button.contains(event.target)) setOpen(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) setOpen(false);
  });
})();