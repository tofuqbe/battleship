class Display {
  constructor() {
    this.dragged = null;
    this.rotated = {
      carrier: false,
      battleship: false,
      cruiser: false,
      submarine: false,
      destroyer: false,
    };
    this.hover = "fleet-selection";
    this.offset = {
      x: null,
      y: null,
    };
    this.shipsToPlace = 5;
  }

  static getPlayerName(form, inputId, player, fadeIn) {
    form.addEventListener("click", function eventHandler(e) {
      if (e.target.type === "button") {
        player.name = inputId.value;
        form.removeEventListener("click", eventHandler);
        form.parentElement.classList.add("hide");
        Display.fadeIn(fadeIn);
        form.parentElement.remove();
      }
    });
  }

  static fadeIn(target) {
    target.classList.remove("hide");
    target.classList.remove("fade");
    target.classList.remove("absolute");
  }

  // Drag and drop API usage below

  // stores offsets and sets element in the datatransfer object.

  dragstart_handler(e) {
    e.dataTransfer.setData("text", e.target.id);
    this.offset = { x: e.offsetX, y: e.offsetY };
  }

  static dragend_handler(e) {
    e.preventDefault();
  }

  // sets the variable data with element from datatransfer object.

  dragdrop_handler(e, board, target, copyLocation) {
    const data = e.dataTransfer.getData("text");
    // Gets index of target from dataset.
    let zoneNumber = e.target.dataset.num - 1;
    let length = board.fleet[data].length;
    let rotated = this.rotated[data];

    // offsets index to the left or topmost square of a ship's length, reguardless of the cursor location when it is dragged.
    while (this.offset.x > 50) {
      zoneNumber -= 1;
      this.offset.x -= 50;
    }
    while (this.offset.y > 50) {
      zoneNumber -= 10;
      this.offset.y -= 50;
    }

    // prevents drop by disreguarding inputs that leave a square of the ship outside of the grid.

    if (
      (!rotated && (zoneNumber % 10) + length - 1 > 9) ||
      (rotated && zoneNumber + 10 * (length - 1) > 99)
    ) {
      return 0;
    }

    let coordinates = Display.getCoordFromBoard(zoneNumber);
    // let boundValidate = validateShip.bind(board);
    // let boundPlace = placeShip.bind(board);

    if (board.validateShip(data, coordinates, rotated)) {
      board.placeShip(data, coordinates, rotated);
      e.target.parentElement.children[zoneNumber].appendChild(
        document.getElementById(data)
      );
      this.postPlacementTweaks(e, zoneNumber);
      this.shipsToPlace -= 1;
      if (this.shipsToPlace === 0) {
        this.hidePlacementBoard(target);
        Display.copyGrid(copyLocation, target.children[1]);
        Display.generateGrid(
          document.querySelector("#board-container"),
          "computer",
          "Enemy Fleet"
        );
        Display.fadeIn(copyLocation);
      }
    }
  }

  hidePlacementBoard(target) {
    target.classList.add("fade");
    target.addEventListener("transitionend", function hide() {
      target.classList.add("hide");
      target.removeEventListener("transitionend", hide);
    });
  }

  postPlacementTweaks(e, zoneNumber) {
    e.target.parentElement.children[zoneNumber].children[0].classList.add(
      "overlay"
    );
    e.target.parentElement.children[zoneNumber].children[0].draggable = false;
    e.target.parentElement.children[zoneNumber].children[0].style.userSelect =
      "none";
    this.setHover(null);
  }

  setHover(value) {
    this.hover = value;
  }

  hover_handler(e) {
    this.setHover(e.target.id);
  }

  rotate(key, hover) {
    if (key.code === "KeyR" && hover !== "fleet-selection") {
      this.rotated[hover]
        ? (this.rotated[hover] = false)
        : (this.rotated[hover] = true);
      document.querySelector(`#${hover}`).classList.toggle("rotate");
    }
  }

  static getCoordFromBoard(e) {
    let char = "a";
    let n = e + 1;
    while (n > 10) {
      n -= 10;
      char = String.fromCharCode(char.charCodeAt(0) + 1);
    }
    return [char, n];
  }

  static copyGrid(target, copy) {
    let grid = copy;
    console.log(grid);
    grid.classList.remove("board");
    grid.classList.add("player");
    target.appendChild(grid);
  }

  static generateGrid(target, owner, header) {
    let boardWrapper = document.createElement("div");
    boardWrapper.classList.add(owner);
    boardWrapper.classList.add("boardWrapper");

    let board = document.createElement("div");
    board.classList.add("board");
    board.classList.add(owner);
    let axisX = document.createElement("div");
    let axisY = document.createElement("div");

    let h2 = document.createElement("h2");
    h2.innerText = header;

    // axis labels
    for (let i = 1; i <= 10; i++) {
      let axisNumber = document.createElement("p");
      axisNumber.innerText = i;
      axisX.append(axisNumber);
      let axisLetter = document.createElement("p");
      axisLetter.innerText = String.fromCharCode(64 + i);
      axisY.append(axisLetter);
    }
    axisX.classList.add("axisX");
    axisY.classList.add("axisY");
    boardWrapper.append(h2);
    boardWrapper.append(axisX);
    boardWrapper.append(axisY);

    // zones

    for (let i = 0; i < 100; i++) {
      let zone = document.createElement("div");
      zone.classList.add("zone");
      let n = i;
      // linearly assigns a number to dataset.
      zone.dataset.num = i + 1;
      board.append(zone);
    }
    boardWrapper.append(board);
    target.append(boardWrapper);
  }
}

export default Display;
