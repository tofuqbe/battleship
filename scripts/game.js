import { Player, Computer } from "./player.js";
import Display from "./display.js";
class Gameloop {
  constructor() {
    this.computer = new Computer("computer", false);
    this.player = new Player("player", true);
  }
}

let gameloop = new Gameloop();
const display = new Display();

// Start screen, get player name.

Display.getPlayerName(
  document.querySelector("form"),
  document.querySelector("#inputName"),
  gameloop.player
);

// Placement Phase Drag and rotate ships to place them on board.

Display.generateGrid(document.querySelector("#placement-container"), "board");

const placementBoard = document.querySelector("#placement-container .board");

const fleetSelection = document.querySelector(".fleet-selection");

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
  zone.addEventListener("keypress", (e) => {});
  zone.addEventListener("dragover", Display.dragend_handler);
  zone.removeEventListener;
  zone.addEventListener("drop", (e) => {
    display.dragdrop_handler(e, gameloop.player.board.fleet);
  });
});

// Display.rotate(document.querySelector(".fleet-selection"));

// Combat Phase. Generates two grids and begins taking turns until all ships on one side are sunk.

Display.generateGrid(
  document.querySelector("#board-container"),
  gameloop.player.name
);

Display.generateGrid(
  document.querySelector("#board-container"),
  gameloop.computer.name
);

// Selector Cache
const playerBoard = document.querySelector("#board-container .player");

// placementBoard.addEventListener("click", (e) => {
//   if (e.target.classList.contains("zone")) {
//     let coordinate = Display.getCoordFromBoard(e);
//   }
// });
