const Ship = require("./ship");

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
    if (this.validateShip(ship, coordinates, direction) === false) return false;
    for (let i = 0; i < ship.length; i++) {
      let x = coordinates[0];
      let y = coordinates[1] - 1;
      direction.toLowerCase() === "horizontal"
        ? (x = String.fromCharCode(coordinates[0].charCodeAt(0) + i))
        : (y += i);
      this.grid[x][y] = ship.name;
    }
  }

  receiveAttack(coordinates) {
    let x = coordinates[0];
    let y = coordinates[1] - 1;
    switch (this.grid[x][y]) {
      case null:
        this.grid[x][y] = "miss";
      case "Carrier":
        Ship.hit(carrier), Ship.isSunk(carrier);
      case "Battleship":
        Ship.hit(battleship), Ship.isSunk(battleship);
      case "Cruiser":
        Ship.hit(cruiser), Ship.isSunk(cruiser);
      case "submarine":
        Ship.hit(submarine), Ship.isSunk(submarine);
      case "destroyer":
        Ship.hit(destroyer), Ship.isSunk(destroyer);
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
}

module.exports = Gameboard;
