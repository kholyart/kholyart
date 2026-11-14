/* Runs before first paint: turns the motion layer on only when the visitor has not asked for reduced motion. */
(function () {
  try {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
      document.documentElement.classList.add("mo");
    }
  } catch (e) {}
})();
