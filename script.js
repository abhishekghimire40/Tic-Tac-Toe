"use-strict";

const App = {
  $: {
    grid: document.querySelector(".grid"),
    menu: document.querySelector(".menu"),
    menuItems: document.querySelector(".items"),
  },
  state: {
    currentPlayer: 1,
  },
  // function to toggle menu
  toggleMenu() {
    App.$.menuItems.classList.toggle("hidden");
  },

  init() {
    App.registerEventListeners();
  },

  registerEventListeners() {
    App.$.grid.addEventListener("click", function (e) {
      const target = e.target;
      if (!target.classList.contains("square")) return;
      if (target.hasChildNodes()) return;
      target.innerHTML = `<i class='fa-solid ${
        App.state.currentPlayer === 1 ? "fa-x turquoise" : "fa-o yellow"
      }'>`;
      App.state.currentPlayer = App.state.currentPlayer === 1 ? 2 : 1;
    });

    App.$.menu.addEventListener("click", function (e) {
      const target = e.target;
      if (target.dataset.id === "menu-btn") {
      } else if (target.dataset.id === "reset-btn") {
        console.log("reset");
      } else if (target.dataset.id === "new-round-btn") {
        console.log("new Round started");
      } else return;
      App.toggleMenu();
    });
  },
};

window.addEventListener("load", App.init);
