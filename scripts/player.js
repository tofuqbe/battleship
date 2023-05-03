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

  updateCoordinates(previous) {
    this.allCoordinates[
      this.allCoordinates.findIndex((coordinate) => {
        return coordinate[0] === previous[0] && coordinate[1] === previous[1];
      })
    ][2] = true;
  }

  randomiseCoordinates() {
    // filters every coordinate to see if it's been used already (2 index is boolean). Any that haven't are pushed to available coords.
    let availableCoordinates = this.allCoordinates.filter((coordinate) => {
      if (!coordinate[2]) return [coordinate[0], coordinate[1]];
    });
    let length = 0;

    if (this.hitConfirmation[0]) {
      length = this.hitConfirmation[1].length;
    }
    if (length > 0) {
      let array = availableCoordinates.filter((coordinate) => {
        for (let i = 0; i < length; i++) {
          if (
            coordinate[0] === this.hitConfirmation[1][i][0] &&
            coordinate[1] === this.hitConfirmation[1][i][1]
          )
            return coordinate;
        }
      });
      if (array.length > 0) {
        for (let i = 0; i < array.length; i++) {
          if (
            Math.abs(
              array[i][0].charCodeAt(0) -
                this.previousCoordinate[0].charCodeAt(0)
            ) === 1 ||
            Math.abs(array[i][1] - this.previousCoordinate[1]) === 1
          ) {
            this.previousCoordinate = this.hitConfirmation[1][i];
            this.updateCoordinates(this.previousCoordinate);
            return this.previousCoordinate;
          }
        }

        let randomNumber = Math.floor(Math.random() * array.length);
        this.previousCoordinate = this.hitConfirmation[1][randomNumber];
        this.updateCoordinates(this.previousCoordinate);
        return this.previousCoordinate;
      }
    }
    let randomNumber = Math.floor(
      Math.random() * (availableCoordinates.length - 1)
    );
    this.previousCoordinate = availableCoordinates[randomNumber];

    this.updateCoordinates(this.previousCoordinate);

    return this.previousCoordinate;
  }
}
export { Player, Computer };
