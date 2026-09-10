(() => {
  "use strict";

  const menuButton = document.querySelector(".menu-button");
  const navigation = document.querySelector("#site-navigation");

  if (!menuButton || !navigation) return;

  function setMenuState(open) {
    document.body.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
      "aria-label",
      open ? "Fechar navegação" : "Abrir navegação",
    );
  }

  menuButton.addEventListener("click", () => {
    setMenuState(!document.body.classList.contains("menu-open"));
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuState(false);
  });
})();
