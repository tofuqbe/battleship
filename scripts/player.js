import Gameboard from "./gameboard.js";
class Player {
  constructor(name, turn) {
    this.name = name;
    this.turn = turn;
    this.board = new Gameboard();
  }

  setName(name) {
    this.name = name;
  }
  attackEnemy(coordinates, opponent) {
    return opponent.receiveAttack(coordinates);
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

    this.availableCoordinates = [];
    let char = "a";
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        this.availableCoordinates.push([char, j]);
      }
      char = String.fromCharCode(char.charCodeAt(0) + 1);
    }
  }

  randomiseCoordinates() {
    let randomNumber = Math.floor(
      Math.random() * (this.availableCoordinates.length - 1)
    );
    return this.availableCoordinates.splice(randomNumber, 1)[0];
  }
}

export { Player, Computer };
