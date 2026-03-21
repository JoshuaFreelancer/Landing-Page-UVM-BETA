export function initNavigation() {
  const toggleButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");

  if (!toggleButton || !menu) {
    return;
  }

  const menuLinks = menu.querySelectorAll("a[href^='#']");

  const closeMenu = () => {
    menu.classList.remove("menu-open");
    toggleButton.setAttribute("aria-expanded", "false");
  };

  toggleButton.addEventListener("click", () => {
    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
    toggleButton.setAttribute("aria-expanded", String(!isExpanded));
    menu.classList.toggle("menu-open");
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId) {
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (!targetElement) {
        return;
      }

      event.preventDefault();
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMenu();
    });
  });
}
