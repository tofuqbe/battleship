const audioController = document.querySelector("#audio-controller");

class Game_Controller {
  constructor() {
    this.audio = document.querySelectorAll(".audio");
    this.cannons = [this.audio[0], this.audio[1]];
    this.splash = this.audio[2];
    this.explosion = this.audio[3];
    this.playerShot = false;
    this.computerShot = false;
    this.state = "open";
    (() => {
      const animation = bodymovin.loadAnimation({
        // animationData: { /* ... */ },
        container: document.querySelector("#audio-controller"), // required
        path: ".//assets/volume.json", // required
        renderer: "svg", // required
        loop: false, // optional
        autoplay: false, // optional
        name: "audio-animation", // optional
      });
      animation.goToAndStop(0, true);
      animation.setSpeed(1.2);

      const animateMenu = () => {
        if (this.state === "open") {
          animation.playSegments([10, 30], true);
          this.state = "closed";
          this.soundControl();
        } else {
          animation.playSegments([42, 60], true);
          this.state = "open";
          this.soundControl();
        }
      };
      audioController.addEventListener("click", animateMenu);
    })();
  }
  soundControl() {
    this.audio.forEach((sound) => {
      sound.muted ? (sound.muted = false) : (sound.muted = true);
    });
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
      }, 1200);
    });
  }

  computerFires(gameloop, playerBoard) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.enemyTurn(gameloop, playerBoard));
      }, 1200);
    });
  }

  turnHandler(e, gameloop, playerBoard) {
    let state = this.state;
    let cannon = this.cannons;
    let splash = this.splash;
    let explosion = this.explosion;
    function fireCannon(type) {
      let randomNumber = Math.floor(Math.random() * 2);
      type[randomNumber].play();
    }
    function fireFeedback(hit) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(hit ? explosion.play() : splash.play());
        }, 100);
      });
    }
    function playerWin(gameloop) {
      if (gameloop.computer.board.allSunk()) {
        return console.log("Player wins!");
      }
    }

    function computerWin(gameloop) {
      if (gameloop.player.board.allSunk()) {
        console.log("Computer wins!");
        return true;
      }
      return false;
    }

    if (
      gameloop.player.turn &&
      !e.target.firstChild &&
      e.target.classList.contains("zone")
    ) {
      gameloop.player.changeTurn();
      fireCannon(cannon);
      this.playerFires(e, gameloop)
        .then(fireFeedback)
        .then(() => {
          playerWin(gameloop);
        })
        .then(() => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(fireCannon(cannon));
            }, 1200);
          });
        })
        .then(() => {
          this.computerFires(gameloop, playerBoard)
            .then(fireFeedback)
            .then(() => {
              if (!computerWin(gameloop)) {
                window.setTimeout(() => {
                  gameloop.player.changeTurn();
                }, 700);
              }
            });
        });

      // .then(() => {
      //   return new Promise((resolve) => {
      //     setTimeout(() => {
      //       resolve(gameloop.player.changeTurn());
      //     });
      //   });
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
