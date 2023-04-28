import { Player, Computer } from "./player.js";
import Display from "./display.js";

class Gameloop {
  constructor() {
    this.computer = new Computer("computer", false);
    this.player = new Player("player", true);
  }
}

let gameloop = new Gameloop();
gameloop.computer.board.randomiseBoard();
const display = new Display();

Display.generateGrid(
  document.querySelector("#placement-container"),
  "board",
  "My Fleet"
);

const placementBoard = document.querySelector("#placement-container .board");
const placementContainer = document.querySelector("#placement-container");
const fleetSelection = document.querySelector("#fleet-selection");
const boardContainer = document.querySelector("#board-container");

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
  zone.addEventListener("keypress", (e) => {});
  zone.addEventListener("dragover", Display.dragend_handler);
  zone.removeEventListener;
  zone.addEventListener("drop", (e) => {
    display.dragdrop_handler(e, gameloop, placementContainer, boardContainer);
  });
});

// Combat Phase. Generates two grids and begins taking turns until all ships on one side are sunk.
