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

  dragstart_handler(e) {
    e.dataTransfer.setData("text", e.target.id);
    this.offset = { x: e.offsetX, y: e.offsetY };
  }

  static dragend_handler(e) {
    e.preventDefault();
  }

  dragdrop_handler(e, fleet) {
    const data = e.dataTransfer.getData("text");
    let zoneNumber = e.target.dataset.num - 1;
    let length = fleet[data].length - 1;
    let rotated = this.rotated[data];

    while (this.offset.x > 50) {
      zoneNumber -= 1;
      this.offset.x -= 50;
    }
    while (this.offset.y > 50) {
      zoneNumber -= 10;
      this.offset.y -= 50;
    }

    if (
      (rotated === false && (zoneNumber % 10) + length > 9) ||
      (rotated && zoneNumber + 10 * length > 99)
    ) {
      return 0;
    }

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

  setHover(value) {
    this.hover = value;
  }

  hover_handler(e) {
    this.setHover(e.target.id);
  }

  rotate(key, hover) {
    if (key.code === "KeyR" && hover !== "") {
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
    let n = e.target.dataset.num;
    while (n > 10) {
      n -= 10;
      char = String.fromCharCode(char.charCodeAt(0) + 1);
    }
    console.log([char, n]);
    return [char, n];
  }

  static removeForm(form) {
    form.parentElement.remove();
  }

  static generateGrid(element, owner) {
    let board = document.createElement("div");
    board.classList.add(owner);
    for (let i = 0; i < 100; i++) {
      let zone = document.createElement("div");
      zone.classList.add("zone");
      let n = i;
      zone.dataset.num = i + 1;
      board.append(zone);
    }
    element.append(board);
  }
}

export default Display;
