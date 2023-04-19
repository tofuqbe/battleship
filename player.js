class Player {
  constructor(name, turn) {
    this.name = name;
    this.turn = turn;
  }
  attackEnemy(coordinates, opponent) {
    let x = coordinates[0];
    let y = coordinates[1] - 1;
    opponent.receiveAttack([x, y]);
  }
}

class Computer extends Player {
  constructor(name, turn) {
    super(name, turn);

    this.availableCoordinates = [];
    let char = "a";
    for (let i = 0; i < 10; i++) {
      for (let j = 1; j < 10; j++) {
        this.availableCoordinates.push([char, j]);
      }
      char = String.fromCharCode(char.charCodeAt(0) + 1);
    }
  }

  randomiseCoordinates() {
    let randomNumber = Math.floor(
      Math.random() * (this.availableCoordinates.length - 1)
    );
    return this.availableCoordinates.splice(randomNumber, 1);
  }
}

module.exports = { Player, Computer };
