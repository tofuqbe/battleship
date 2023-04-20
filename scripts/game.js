import { Player, Computer } from "./player.js";

class Gameloop {
  constructor(player) {
    this.computer = new Computer("computer", false);
    this.player = new Player(player, true);
  }
}
