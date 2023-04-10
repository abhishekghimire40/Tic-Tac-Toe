"use-strict";

const App = {
  $: {
    grid: document.querySelector(".grid"),
    menu: document.querySelector(".menu"),
    menuItems: document.querySelector(".items"),
    squares: document.querySelectorAll(".square"),
    turn: document.querySelector(".turn"),
    score: document.querySelectorAll(".score"),
    modal: document.querySelector(".modal"),
    winMessage: document.querySelector(".modal-contents p"),
    playAgain: document.querySelector(".modal-contents button"),
  },
  state: {
    moves: [],
    wins: { p1: 0, p2: 0, ties: 0 },
  },

  checkGame(moves) {
    // check if game is complete or not and who is the winner or the game tied
    const player1Moves = moves
      .filter((move) => move.playerId === 1)
      .map((mov) => mov.move);
    const player2Moves = moves
      .filter((move) => move.playerId === 2)
      .map((mov) => mov.move);
    const winningMoves = [
      [1, 5, 9], // diagonal from top left
      [3, 5, 7], // diagonal from top right
      [1, 2, 3], // top row
      [4, 5, 6], // middle row
      [7, 8, 9], // bottom row
      [1, 4, 7], // left column
      [2, 5, 8], // middle column
      [3, 6, 9], // right column
    ];
    let winner = null;
    winningMoves.forEach((move) => {
      const p1Win = move.every((mv) => player1Moves.includes(mv));
      const p2Win = move.every((mv) => player2Moves.includes(mv));
      if (p1Win) winner = 1;
      if (p2Win) winner = 2;
    });

    return {
      status: `${
        moves.length === 9 || winner != null ? "complete" : "in-progress"
      }`,
      winner,
    };
  },

  // function to toggle menu
  toggleMenu() {
    App.$.menuItems.classList.toggle("hidden");
  },

  // change playerTurn
  displayPlayerName(player) {
    const [add1, add2] =
      player === 1 ? ["fa-x", "turquoise"] : ["fa-o", "yellow"];
    const [rem1, rem2] =
      player === 1 ? ["fa-o", "yellow"] : ["fa-x", "turquoise"];
    const icon = App.$.turn.querySelector("i");
    const par = App.$.turn.querySelector("p");
    icon.classList.remove(rem1, rem2);
    icon.classList.add(add1, add2);
    par.textContent = `Player ${player}, you are up!`;
    par.classList.remove(rem2);
    par.classList.add(add2);
  },
  // getCurrentPlayer
  getCurrentPlayer(moves) {
    if (moves.length === 0) return 1;
    const player = moves.at(-1).playerId === 1 ? 2 : 1;
    return player;
  },

  // show and remove modal
  toggleModal(state) {
    state === "add" && App.$.modal.classList.remove("hidden");
    state === "remove" && App.$.modal.classList.add("hidden");
  },

  // resetGame
  reset() {
    App.state.moves.forEach((mov) => {
      document.querySelector(`[data-id ='${mov.move}']`).innerHTML = "";
    });
    App.state.moves = [];
    App.toggleModal("remove");
    App.displayPlayerName(1);
  },

  // set  Score and show it in UI
  setScore(result) {
    console.log(result);
    const val = result === null ? 1 : result === 1 ? 0 : 2;
    const el = App.$.score[val].querySelector("span");
    App.state.wins[val === 1 ? "ties" : `p${result}`] += 1;
    console.log(App.state.wins);
    el.textContent = `${App.state.wins[val === 1 ? "ties" : `p${result}`]} ${
      val === 1 ? "" : "wins"
    }`;
  },

  // clearScore
  clearScore() {
    App.state.wins.p1 = 0;
    App.state.wins.ties = 0;
    App.state.wins.p2 = 0;
    App.$.score.forEach((el, i) => {
      el.querySelector("span").textContent = i === 1 ? `0` : `0 wins`;
    });
  },

  init() {
    App.registerEventListeners();
    App.$.turn.querySelector("p").classList.add("turquoise");
    // App.$.turn.querySelector('p').classList.add('turquoise')
  },

  registerEventListeners() {
    // event for whole game
    App.$.grid.addEventListener("click", function (e) {
      const target = e.target;

      if (!target.classList.contains("square")) return;
      if (target.hasChildNodes()) return;

      const currPlayer = App.getCurrentPlayer(App.state.moves);
      target.innerHTML = `<i class='fa-solid ${
        currPlayer === 1 ? "fa-x turquoise" : "fa-o yellow"
      }'>`;
      App.state.moves.push({
        move: +target.dataset.id,
        playerId: +currPlayer,
      });
      console.log(App.state.moves);
      const game = App.checkGame(App.state.moves);
      if (game.status === "complete") {
        App.toggleModal("add");
        App.$.winMessage.textContent =
          game.winner === null ? `Game Tied!` : `Player${game.winner} wins`;
        App.setScore(game.winner);
        return;
      }
      // App.state.currentPlayer = App.state.currentPlayer === 1 ? 2 : 1;
      currPlayer === 1 ? App.displayPlayerName(2) : App.displayPlayerName(1);
    });

    // event for dropdown menu
    App.$.menu.addEventListener("click", function (e) {
      const target = e.target;
      if (target.dataset.id === "menu-btn") {
      } else if (target.dataset.id === "reset-btn") {
        App.reset();
      } else if (target.dataset.id === "new-round-btn") {
        App.reset();
        App.clearScore();
      } else return;
      App.toggleMenu();
    });

    App.$.playAgain.addEventListener("click", function (e) {
      App.reset();
    });
  },
};

window.addEventListener("load", App.init);
