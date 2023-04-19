class Ship {
  constructor(name, length) {
    (this.name = name), (this.length = length);
    this.hit = 0;
    this.sunk = false;
  }

  static hit(ship) {
    ship.hit++;
  }

  static isSunk(ship) {
    if (ship.hit === ship.length) ship.sunk = true;
  }
}

let carrier = new Ship("Carrier", 5);
let battleship = new Ship("Battleship", 4);
let cruiser = new Ship("Cruiser", 3);
let submarine = new Ship("Submarine", 3);
let destroyer = new Ship("Destroyer", 2);

module.exports = Ship;
