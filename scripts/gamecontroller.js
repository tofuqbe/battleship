class Game_Controller {
  constructor() {
    this.cannon = new Audio("assets/cannonShot.mp3");
    this.cannon2 = new Audio("assets/cannonShot2.mp3");
    this.splash = new Audio("assets/splash.mp3");
    this.explosion = new Audio("assets/explosion.mp3");
    this.playerShot = false;
    this.computerShot = false;
  }
  static getCoordFromBoard(e) {
    let char = "a";
    let n = e;
    while (n > 10) {
      n -= 10;
      char = String.fromCharCode(char.charCodeAt(0) + 1);
    }
    return [char, n - 1];
  }

  static getIndexFromCoord(coordinates) {
    let unicode = (coordinates[0].charCodeAt(0) - 97) * 10;
    let i = unicode + coordinates[1];
    return i;
  }

  playerTurn(e, gameloop) {
    if (
      gameloop.player.attackEnemy(
        Game_Controller.getCoordFromBoard(e.target.dataset.num),
        gameloop.computer.board
      )
    ) {
      let hit = document.createElement("div");
      hit.classList.add("hit");
      e.target.appendChild(hit);
      return (this.playerShot = true);
    } else {
      let miss = document.createElement("div");
      miss.classList.add("miss");
      e.target.appendChild(miss);
      return (this.playerShot = false);
    }
  }

  enemyTurn(gameloop, playerBoard) {
    let coordinates = gameloop.computer.randomiseCoordinates();
    if (gameloop.computer.attackEnemy(coordinates, gameloop.player.board)) {
      let hit = document.createElement("div");
      hit.classList.add("hitPlayer");
      playerBoard.children[
        Game_Controller.getIndexFromCoord(coordinates)
      ].appendChild(hit);
      return true;
    } else {
      let miss = document.createElement("div");
      miss.classList.add("miss");
      playerBoard.children[
        Game_Controller.getIndexFromCoord(coordinates)
      ].appendChild(miss);
      return false;
    }
  }

  playerFires(e, gameloop) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.playerTurn(e, gameloop));
      }, 2000);
    });
  }

  computerFires(gameloop, playerBoard) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.enemyTurn(gameloop, playerBoard));
      }, 2000);
    });
  }

  turnHandler(e, gameloop, playerBoard) {
    let cannon = this.cannon;
    let cannon2 = this.cannon2;
    let splash = this.splash;
    let explosion = this.explosion;
    function fireCannon(type) {
      type.play();
    }
    function fireFeedback(hit) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(hit ? explosion.play() : splash.play());
        }, 2000);
      });
    }
    function playerWin(gameloop) {
      if (gameloop.computer.board.allSunk()) {
        return console.log("Player Wins!");
      }
    }

    if (gameloop.player.turn && !e.target.firstChild) {
      fireCannon(cannon);
      this.playerFires(e, gameloop)
        .then(fireFeedback(this.playerShot))
        .then(playerWin(gameloop));

      // .then(() => {
      //   this.computerFires(gameloop, playerBoard);
      // });
    }

    // })
    // .then(() => {
    //   const enemyPromise = new Promise((resolve) => {
    //     window.setTimeout(() => {
    //       resolve(this.enemyTurn(gameloop, playerBoard));
    //     }, 2000);
    //   });
    //   enemyPromise.then(() => {
    //     if (gameloop.player.board.allSunk()) {
    //       return console.log("Computer Wins!");
    //     }
    //     gameloop.player.changeTurn();
    //   });
    // });
  }
}

export default Game_Controller;
