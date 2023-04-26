class Game_Controller {
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

  static playerTurn(e, gameloop) {
    if (
      gameloop.player.attackEnemy(
        Game_Controller.getCoordFromBoard(e.target.dataset.num),
        gameloop.computer.board
      )
    ) {
      let hit = document.createElement("div");
      hit.classList.add("hit");
      e.target.appendChild(hit);
    } else {
      let miss = document.createElement("div");
      miss.classList.add("miss");
      e.target.appendChild(miss);
    }
  }

  static enemyTurn(gameloop, playerBoard) {
    let coordinates = gameloop.computer.randomiseCoordinates();
    if (gameloop.computer.attackEnemy(coordinates, gameloop.player.board)) {
      playerBoard.children[
        Game_Controller.getIndexFromCoord(coordinates)
      ].classList.add("hit");
    } else {
      let miss = document.createElement("div");
      miss.classList.add("miss");
      playerBoard.children[
        Game_Controller.getIndexFromCoord(coordinates)
      ].appendChild(miss);
    }
  }

  static turnHandler(e, gameloop, playerBoard) {
    if (gameloop.player.turn && !e.target.firstChild) {
      Game_Controller.playerTurn(e, gameloop);
      if (gameloop.computer.board.allSunk()) {
        return console.log("Player Wins!");
      }
      gameloop.player.changeTurn();
      const enemyPromise = new Promise((resolve, reject) => {
        window.setTimeout(() => {
          resolve(Game_Controller.enemyTurn(gameloop, playerBoard));
        }, 100);
      });
      enemyPromise.then(() => {
        if (gameloop.player.board.allSunk()) {
          return console.log("Computer Wins!");
        }
        gameloop.player.changeTurn();
      });
    }
  }
}

export default Game_Controller;
