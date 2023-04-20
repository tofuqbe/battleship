import Ship from "./ship.js";

class Gameboard {
  constructor() {
    this.grid = {
      a: [],
      b: [],
      c: [],
      d: [],
      e: [],
      f: [],
      g: [],
      h: [],
      i: [],
      j: [],
    };

    // Populate grid with null squares.
    let char = "a";
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        this.grid[char].push(null);
      }
      char = String.fromCharCode(char.charCodeAt(0) + 1);
    }

    this.fleet = {
      carrier: new Ship("Carrier", 5),
      battleship: new Ship("Battleship", 4),
      cruiser: new Ship("Cruiser", 3),
      submarine: new Ship("Submarine", 3),
      destroyer: new Ship("Destroyer", 2),
    };
  }

  isOnGrid(coordinates) {
    let unicode = coordinates[0].toLowerCase().charCodeAt(0);
    let n = coordinates[1];
    return unicode >= 97 && unicode <= 106 && n >= 1 && n <= 10 ? true : false;
  }

  isEmpty(coordinates) {
    return this.grid[coordinates[0]][coordinates[1]] === null ? true : false;
  }

  validateShip(ship, coordinates, direction) {
    for (let i = 0; i < ship.length; i++) {
      let x = coordinates[0];
      let y = coordinates[1] - 1;
      direction.toLowerCase() === "horizontal"
        ? (x = String.fromCharCode(coordinates[0].charCodeAt(0) + i))
        : (y += i);
      if (!this.isOnGrid([x, y])) return false;
      if (!this.isEmpty([x, y])) return false;
    }
    return true;
  }

  //   accepts ship Class and coordinates. E.g ["a", 6]
  placeShip(ship, coordinates, direction) {
    // if (this.validateShip(ship, coordinates, direction) === false) return false;
    for (let i = 0; i < ship.length; i++) {
      let x = coordinates[0];
      let y = coordinates[1] - 1;
      direction.toLowerCase() === "horizontal"
        ? (x = String.fromCharCode(coordinates[0].charCodeAt(0) + i))
        : (y += i);
      this.grid[x][y] = ship.name;
    }
  }

  placeShips(coordinates, directions) {
    let array = [
      this.fleet.carrier,
      this.fleet.battleship,
      this.fleet.cruiser,
      this.fleet.submarine,
      this.fleet.destroyer,
    ];
    for (let i = 0; i < array.length; i++) {
      this.placeShip(array[i], coordinates[i], directions[i]);
    }
  }

  randomiseBoard() {
    let array = [
      this.fleet.carrier,
      this.fleet.battleship,
      this.fleet.cruiser,
      this.fleet.submarine,
      this.fleet.destroyer,
    ];
    for (let i = 0; i < 5; i++) {
      let coordinates;
      do {
        coordinates = this.randomiseCoordinates();
      } while (!this.validateShip(array[i], coordinates, "horizontal"));
      this.placeShip(array[i], coordinates, "horizontal");
    }
  }

  receiveAttack(coordinates) {
    let x = coordinates[0];
    let y = coordinates[1] - 1;
    switch (this.grid[x][y]) {
      case null:
        this.grid[x][y] = "miss";
        break;
      case "Carrier":
        this.fleet.carrier.isHit(), this.fleet.carrier.isSunk();
        break;
      case "Battleship":
        this.fleet.battleship.isHit(), this.fleet.battleship.isSunk();
        break;
      case "Cruiser":
        this.fleet.cruiser.isHit(), this.fleet.cruiser.isSunk();
        break;
      case "Submarine":
        this.fleet.submarine.isHit(), this.fleet.submarine.isSunk();
        break;
      case "Destroyer":
        this.fleet.destroyer.isHit(), this.fleet.destroyer.isSunk();
    }
  }

  allSunk() {
    let count = 0;
    if (carrier.sunk === true) count++;
    if (battleship.sunk === true) count++;
    if (cruiser.sunk === true) count++;
    if (submarine.sunk === true) count++;
    if (destroyer.sunk === true) count++;
    return count === 5 ? true : false;
  }

  randomiseCoordinates() {
    let char = String.fromCharCode(Math.floor(Math.random() * 10 + 90));
    let n = Math.floor(Math.random() * 10);
    return [char, n];
  }
}

export default Gameboard;
