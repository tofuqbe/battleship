import Gameboard from "./gameboard.js";
class Player {
  constructor(name, turn) {
    this.name = name;
    this.turn = turn;
    this.board = new Gameboard();
    this.hitConfirmation = false;
  }

  setName(name) {
    this.name = name;
  }
  attackEnemy(coordinates, opponent) {
    this.hitConfirmation = opponent.receiveAttack(coordinates);
    return this.hitConfirmation;
  }

  changeTurn() {
    this.turn ? (this.turn = false) : (this.turn = true);
  }

  hasLost(dom) {
    let boolean = true;
    for (let i = 0; i < 5; i++) {
      if (!Object.keys(this.board.fleet)[i].sunk) return false;
    }
    return dom;
  }
}

class Computer extends Player {
  constructor(...args) {
    super(...args);
    this.previousCoordinate = null;
    this.hitShipCoordinates = [];
    this.allCoordinates = [];
    let char = "a";
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        this.allCoordinates.push([char, j, false]);
      }
      char = String.fromCharCode(char.charCodeAt(0) + 1);
    }
  }

  randomiseCoordinates() {
    let availableCoordinates = this.allCoordinates.filter((coordinate) => {
      if (!coordinate[2]) return [coordinate[0], coordinate[1]];
    });

    if (this.hitConfirmation) {
      let char = this.previousCoordinate[0];
      let n = this.previousCoordinate[1];
      let up = [String.fromCharCode(char.charCodeAt(0) - 1), n];
      let down = [String.fromCharCode(char.charCodeAt(0) + 1), n];
      let left = [char, this.previousCoordinate[1] - 1];
      let right = [char, this.previousCoordinate[1] + 1];
      let adjacentCoordinates = [up, down, left, right];
      let availableAdjacentCoordinates = [];
      for (let i = 0; i < availableCoordinates.length; i++) {
        adjacentCoordinates.filter((coordinate) => {
          if (
            availableCoordinates[i][0] === coordinate[0] &&
            availableCoordinates[i][1] === coordinate[1]
          ) {
            availableAdjacentCoordinates.push(coordinate);
          }
        });
      }
      if (availableAdjacentCoordinates.length > 0) {
        let randomNumber = Math.floor(
          Math.random() * (availableAdjacentCoordinates.length - 1)
        );
        this.previousCoordinate = availableAdjacentCoordinates[randomNumber];
      } else {
        let randomNumber = Math.floor(
          Math.random() * (availableCoordinates.length - 1)
        );
        this.previousCoordinate = availableCoordinates[randomNumber];
      }
    } else {
      let randomNumber = Math.floor(
        Math.random() * (availableCoordinates.length - 1)
      );
      this.previousCoordinate = availableCoordinates[randomNumber];
    }

    this.allCoordinates[
      this.allCoordinates.findIndex((coordinate) => {
        return (
          coordinate[0] === this.previousCoordinate[0] &&
          coordinate[1] === this.previousCoordinate[1]
        );
      })
    ][2] = true;
    return this.previousCoordinate;
  }
}
export { Player, Computer };
