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

  resetGrid() {
    for (let y in this.grid) {
      for (let i = 0; i < 10; i++) {
        this.grid[y][i] = null;
      }
    }
  }

  isOnGrid(coordinates) {
    let unicode = coordinates[0].toLowerCase().charCodeAt(0);
    let n = coordinates[1];
    return unicode >= 97 && unicode <= 106 && n >= 1 && n <= 10 ? true : false;
  }

  isEmpty(coordinates) {
    return this.grid[coordinates[0]][coordinates[1] - 1] === null
      ? true
      : false;
  }

  validateShip(ship, coordinates, rotated) {
    for (let i = 0; i < this.fleet[ship].length; i++) {
      let x = coordinates[0];
      let y = coordinates[1];
      rotated
        ? (x = String.fromCharCode(coordinates[0].charCodeAt(0) + i))
        : (y += i);
      if (!this.isOnGrid([x, y])) return false;
      if (!this.isEmpty([x, y])) return false;
    }
    return true;
  }

  //   accepts ship Class and coordinates. E.g ["a", 6]
  placeShip(ship, coordinates, rotated) {
    // if (this.validateShip(ship, coordinates, rotated) === false) return false;
    for (let i = 0; i < this.fleet[ship].length; i++) {
      let x = coordinates[0];
      let y = coordinates[1] - 1;
      rotated
        ? (x = String.fromCharCode(coordinates[0].charCodeAt(0) + i))
        : (y += i);
      this.grid[x][y] = this.fleet[ship].name;
    }
  }

  placeShips(coordinates, rotations) {
    let array = [
      this.fleet.carrier,
      this.fleet.battleship,
      this.fleet.cruiser,
      this.fleet.submarine,
      this.fleet.destroyer,
    ];
    for (let i = 0; i < array.length; i++) {
      this.placeShip(array[i], coordinates[i], rotations[i]);
    }
  }

  randomiseBoard() {
    let direction = {
      carrier: false,
      battleship: false,
      cruiser: false,
      submarine: false,
      destroyer: false,
    };
    let array = [
      this.fleet.carrier.name.toLowerCase(),
      this.fleet.battleship.name.toLowerCase(),
      this.fleet.cruiser.name.toLowerCase(),
      this.fleet.submarine.name.toLowerCase(),
      this.fleet.destroyer.name.toLowerCase(),
    ];
    for (let i = 0; i < 5; i++) {
      let coordinates;
      let randomBoolean;
      do {
        coordinates = this.randomiseCoordinates();
        randomBoolean = Math.floor(Math.random() * 2);
      } while (!this.validateShip(array[i], coordinates, randomBoolean));
      this.placeShip(array[i], coordinates, randomBoolean);
      direction[array[i]] = randomBoolean;
    }
    return direction;
  }

  computerPriorityHits(shipType, x, y) {
    let char = "a";
    let shipCoordinates = [];
    for (let i = 0; i < 10; i++) {
      char = String.fromCharCode(97 + i);
      for (let j = 0; j < 10; j++) {
        if (this.grid[char][j] === shipType && char + j !== x + y)
          shipCoordinates.push([char, j]);
      }
    }
    return shipCoordinates;
  }

  receiveAttack(coordinates) {
    let x = coordinates[0];
    let y = coordinates[1];

    switch (this.grid[x][y]) {
      case null:
        this.grid[x][y] = "miss";
        return [false];
      case "Carrier":
        this.fleet.carrier.isHit(), this.fleet.carrier.isSunk();
        this.grid[x][y] = "hit";
        return [true, this.computerPriorityHits(this.fleet.carrier.name, x, y)];

      case "Battleship":
        this.fleet.battleship.isHit(), this.fleet.battleship.isSunk();
        this.grid[x][y] = "hit";
        return [
          true,
          this.computerPriorityHits(this.fleet.battleship.name, x, y),
        ];

      case "Cruiser":
        this.fleet.cruiser.isHit(), this.fleet.cruiser.isSunk();
        this.grid[x][y] = "hit";
        return [true, this.computerPriorityHits(this.fleet.cruiser.name, x, y)];

      case "Submarine":
        this.fleet.submarine.isHit(), this.fleet.submarine.isSunk();
        this.grid[x][y] = "hit";
        return [
          true,
          this.computerPriorityHits(this.fleet.submarine.name, x, y),
        ];

      case "Destroyer":
        this.fleet.destroyer.isHit(), this.fleet.destroyer.isSunk();
        this.grid[x][y] = "hit";
        return [
          true,
          this.computerPriorityHits(this.fleet.destroyer.name, x, y),
        ];
    }
  }

  allSunk() {
    let array = Object.keys(this.fleet);

    let shipsSunk = 0;
    for (let i = 0; i < 5; i++) {
      if (this.fleet[array[i]].sunk) shipsSunk++;
    }
    return shipsSunk === 5 ? true : false;
  }

  randomiseCoordinates() {
    let char = String.fromCharCode(Math.floor(Math.random() * 10 + 97));
    let n = Math.floor(Math.random() * 10);
    return [char, n];
  }
}

export default Gameboard;
