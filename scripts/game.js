import { Player, Computer } from "./player.js";
import Display from "./display.js";
const replay = document.querySelector("#result").children[0].children[1];

replay.addEventListener("click", (e) => {
  window.location.reload();
});

class Gameloop {
  constructor() {
    this.computer = new Computer("computer", false);
    this.player = new Player("player", true);
  }
}

let gameloop = new Gameloop();
gameloop.computer.board.randomiseBoard();
let display = new Display();

Display.generateGrid(
  document.querySelector("#placement-container"),
  "board",
  "My Fleet"
);

const placementBoard = document.querySelector("#placement-container .board");
const placementContainer = document.querySelector("#placement-container");
const fleetSelection = document.querySelector("#fleet-selection");
const placementShips = document.querySelector(".placementShips");
const boardContainer = document.querySelector("#board-container");
const randomBtn = document.querySelector("#btn-random");
const resetBtn = document.querySelector("#btn-reset");
const startBtn = document.querySelector("#btn-start");
Display.getPlayerName(
  document.querySelector("form"),
  document.querySelector("#inputName"),
  gameloop.player,
  placementContainer
);

// Placement Phase Drag and rotate ships to place them on board.

fleetSelection.addEventListener("mouseover", (e) => {
  display.hover_handler(e);
});
window.addEventListener("keypress", (event) => {
  display.rotate(event, display.hover);
});

fleetSelection.addEventListener("dragstart", (e) => {
  display.dragstart_handler(e);
});

placementBoard.childNodes.forEach((zone) => {
  zone.addEventListener("dragover", Display.dragend_handler);
  zone.addEventListener("drop", (e) => {
    display.dragdrop_handler(e, gameloop, placementContainer, boardContainer);
  });
});

let startGame = () => {
  if (display.allPlaced !== 5) return 0;
  placementContainer.remove();
  Display.copyGrid(boardContainer, placementContainer.children[1]);
  Display.generateGrid(
    document.querySelector("#board-container"),
    "computer",
    "Enemy Fleet"
  );
  Display.fadeIn(boardContainer);
  boardContainer.children[1].addEventListener("click", (e) => {
    display.gameController.turnHandler(
      e,
      gameloop,
      boardContainer.children[0].children[3],
      Display.fadeIn
    );
  });
};

let resetBoard = () => {
  display.allPlaced = 0;
  gameloop.player.board.resetGrid();
  Display.resetShipsToPlace(placementShips);
  Display.resetGrid(placementContainer.children[1].children[3]);
  display.reset = true;
  for (let ship in display.rotated) {
    ship = false;
  }
};

let randomiseBoard = () => {
  resetBoard();
  display.reset = false;
  display.allPlaced = 5;
  let board = placementContainer.children[1].children[3];
  let direction = gameloop.player.board.randomiseBoard();
  let shipsToPlace = {
    Carrier: true,
    Battleship: true,
    Cruiser: true,
    Submarine: true,
    Destroyer: true,
  };
  for (let y in gameloop.player.board.grid) {
    for (let i = 0; i < 10; i++) {
      if (gameloop.player.board.grid[y][i] !== null) {
        let ship = gameloop.player.board.grid[y][i];
        if (shipsToPlace[ship]) {
          let charValue = (y.charCodeAt(0) - 97) * 10;
          let index = charValue + i;
          let div = document.createElement("div");
          switch (ship) {
            case "Carrier":
              div.innerText = "CV";
              break;
            case "Battleship":
              div.innerText = "BB";
              break;
            case "Cruiser":
              div.innerText = "CA";
              break;
            case "Submarine":
              div.innerText = "SS";
              break;
            case "Destroyer":
              div.innerText = "DD";
              break;
          }
          div.setAttribute("id", `${ship.toLowerCase()}`);
          div.classList.add("placedShip");
          if (direction[ship.toLowerCase()]) div.classList.add("rotate");
          board.children[index].appendChild(div);
          shipsToPlace[ship] = false;
        }
      }
    }
  }
  Display.removeShipstoPlace(placementShips);
};

randomBtn.addEventListener("click", randomiseBoard);

resetBtn.addEventListener("click", resetBoard);

startBtn.addEventListener("click", startGame);
