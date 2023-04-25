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
    this.hover = null;
    this.offset = {
      x: null,
      y: null,
    };
  }

  static getPlayerName(form, inputId, player) {
    form.addEventListener("click", function eventHandler(e) {
      if (e.target.type === "button") {
        player.name = inputId.value;
        console.log(player);
        form.removeEventListener("click", eventHandler);
        form.parentElement.classList.add("fade");
        form.addEventListener("transitionend", function remove() {
          form.classList.add("hide");
          form.removeEventListener("transitionend", remove);
          Display.removeForm(form);
        });
      }
    });
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

  dragdrop_handler(e, board) {
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
      e.target.parentElement.children[zoneNumber].children[0].classList.add(
        "overlay"
      );
      e.target.parentElement.children[zoneNumber].children[0].draggable = false;
      e.target.parentElement.children[zoneNumber].children[0].style.userSelect =
        "none";
      this.setHover(null);
    }
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

  static paintShip(coordinate) {
    coordinate.classList.add("ship");
  }

  static getCoordFromBoard(e) {
    let char = "a";
    let n = e + 1;
    while (n > 10) {
      n -= 10;
      char = String.fromCharCode(char.charCodeAt(0) + 1);
    }
    console.log[(char, n)];
    return [char, n];
  }

  static removeForm(form) {
    form.parentElement.remove();
  }

  static generateGrid(element, owner) {
    let boardWrapper = document.createElement("div");
    boardWrapper.classList.add(owner);
    boardWrapper.classList.add("boardWrapper");
    let board = document.createElement("div");
    board.classList.add("board");
    board.classList.add(owner);
    let axisX = document.createElement("div");
    let axisY = document.createElement("div");

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
    element.append(boardWrapper);
  }
}

export default Display;
