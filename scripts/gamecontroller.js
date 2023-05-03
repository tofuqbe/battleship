const audioController = document.querySelector("#audio-controller");
const result = document.querySelector("#result");
class Game_Controller {
  constructor() {
    this.audio = document.querySelectorAll(".audio");
    this.playerCannons = [this.audio[0], this.audio[1]];
    this.computerCannons = [this.audio[2], this.audio[3]];
    this.splashPlayer = this.audio[4];
    this.explosionPlayer = this.audio[5];
    this.splashComputer = this.audio[6];
    this.explosionComputer = this.audio[7];
    this.playerShot = false;
    this.computerShot = false;
    this.state = "open";
    (() => {
      const animation = bodymovin.loadAnimation({
        // animationData: { /* ... */ },
        container: document.querySelector("#audio-controller"), // required
        path: ".//assets/volumeBlack.json", // required
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
    let playerShot = gameloop.player.attackEnemy(
      Game_Controller.getCoordFromBoard(e.target.dataset.num),
      gameloop.computer.board
    );
    if (playerShot[0]) {
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
    // Communicate back to enemy class the array of coordinates to fire at once hit a ship and remove them from the total list left.
    let coordinates = gameloop.computer.randomiseCoordinates();
    let enemyShot = gameloop.computer.attackEnemy(
      coordinates,
      gameloop.player.board
    );
    if (enemyShot[0]) {
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

  turnHandler(e, gameloop, playerBoard, fadeIn) {
    let cannonPlayer = this.playerCannons;
    let cannonComputer = this.computerCannons;
    let splashPlayer = this.splashPlayer;
    let explosionPlayer = this.explosionPlayer;
    let splashComputer = this.splashComputer;
    let explosionComputer = this.explosionComputer;
    function fireCannon(type) {
      let randomNumber = Math.floor(Math.random() * 2);
      type[randomNumber].play();
    }
    function fireFeedbackPlayer(hit) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(hit ? explosionPlayer.play() : splashPlayer.play());
        }, 100);
      });
    }

    function fireFeedbackComputer(hit) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(hit ? explosionComputer.play() : splashComputer.play());
        }, 100);
      });
    }
    function playerWin(gameloop) {
      if (gameloop.computer.board.allSunk()) {
        result.children[0].children[0].innerText = "Victory!";
        result.children[0].children[1].innerText = "Restart?";
        return fadeIn(result);
      }
    }

    function computerWin(gameloop) {
      if (gameloop.player.board.allSunk()) {
        result.children[0].children[0].innerText = "Defeat...";
        result.children[0].children[1].innerText = "Try Again?";
        return fadeIn(result);
      }
      return false;
    }

    if (
      gameloop.player.turn &&
      !e.target.firstChild &&
      e.target.classList.contains("zone")
    ) {
      gameloop.player.changeTurn();
      fireCannon(cannonPlayer);
      this.playerFires(e, gameloop)
        .then(fireFeedbackPlayer)
        .then(() => {
          playerWin(gameloop);
        })
        .then(() => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(fireCannon(cannonComputer));
            }, 1000);
          });
        })
        .then(() => {
          this.computerFires(gameloop, playerBoard)
            .then(fireFeedbackComputer)
            .then(() => {
              if (!computerWin(gameloop)) {
                window.setTimeout(() => {
                  gameloop.player.changeTurn();
                }, 100);
              }
            });
        });
    }
  }
}

export default Game_Controller;
