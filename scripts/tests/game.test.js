jest.mock("../game", () => {
  const Gameloop = jest.requireActual("../game");
  return {
    gameloop: new Gameloop("Steve", true),
  };
});

let tempCoordinates = [
  ["a", 1],
  ["b", 2],
  ["c", 3],
  ["d", 4],
  ["e", 5],
];
let directions = [
  "horizontal",
  "horizontal",
  "horizontal",
  "horizontal",
  "horizontal",
];

const gameloop = require("../game").gameloop;

/* *For Testing. Both player and computer have same placements. 
placeShips loops from biggest to smallest ship using above coordinates. 
ships sprawl from left to right or up to down on grid depending on direction.*/

gameloop.player.board.placeShips(tempCoordinates, directions);

gameloop.computer.board.placeShips(tempCoordinates, directions);

// it("provide correct name for player", () => {
//   expect(gameloop.player.name).toBe("Steve");
// });

// describe("correctly assigns turn order as boolean", () => {
//   it("for player", () => {
//     expect(gameloop.player.turn).toBeTruthy();
//   });
//   it("for computer", () => {
//     expect(gameloop.computer.turn).toBeFalsy();
//   });
// });

// describe("player has full fleet", () => {
//   it("player has carrier", () => {
//     expect(gameloop.player.board.fleet.carrier.name).toBe("Carrier");
//   });
//   it("player has battleship", () => {
//     expect(gameloop.player.board.fleet.battleship.name).toBe("Battleship");
//   });
//   it("player has cruiser", () => {
//     expect(gameloop.player.board.fleet.cruiser.name).toBe("Cruiser");
//   });
//   it("player has submarine", () => {
//     expect(gameloop.player.board.fleet.submarine.name).toBe("Submarine");
//   });
//   it("player has destroyer", () => {
//     expect(gameloop.player.board.fleet.destroyer.name).toBe("Destroyer");
//   });
// });

// describe("computer has full fleet", () => {
//   it("computer has carrier", () => {
//     expect(gameloop.computer.board.fleet.carrier.name).toBe("Carrier");
//   });
//   it("computer has battleship", () => {
//     expect(gameloop.computer.board.fleet.battleship.name).toBe("Battleship");
//   });
//   it("computer has cruiser", () => {
//     expect(gameloop.computer.board.fleet.cruiser.name).toBe("Cruiser");
//   });
//   it("computer has submarine", () => {
//     expect(gameloop.computer.board.fleet.submarine.name).toBe("Submarine");
//   });
//   it("computer has destroyer", () => {
//     expect(gameloop.computer.board.fleet.destroyer.name).toBe("Destroyer");
//   });
// });

describe("attacks are successfuly registered", () => {
  it("computer places carrer at [a,1] and it is successfuly hit by player", () => {
    gameloop.player.attackEnemy(["a", 1], gameloop.computer.board);
    gameloop.player.attackEnemy(["b", 1], gameloop.computer.board);
    gameloop.player.attackEnemy(["c", 1], gameloop.computer.board);
    expect(gameloop.computer.board.fleet.carrier.hit).toEqual(3);
  });

  it("computer places destroyer at [e,5] and it is successfuly hit by player 2 times", () => {
    gameloop.player.attackEnemy(["f", 5], gameloop.computer.board);
    gameloop.player.attackEnemy(["e", 5], gameloop.computer.board);
    expect(gameloop.computer.board.fleet.destroyer.hit).toEqual(2);
  });

  it("computer places submarine at [d,4] and it is successfuly hit by player 1 times", () => {
    gameloop.player.attackEnemy(["d", 4], gameloop.computer.board);

    expect(gameloop.computer.board.fleet.submarine.hit).toEqual(1);
  });
});

// describe("ships can sink", () => {
//   it("successive attacks by player sinks computers destroyer", () => {
//     gameloop.computer.board.placeShip(
//       gameloop.computer.board.fleet.destroyer,
//       ["g", 7],
//       "vertical"
//     );

//     gameloop.player.attackEnemy(["g", 7], gameloop.computer.board);
//     gameloop.player.attackEnemy(["g", 6], gameloop.computer.board);
//     expect(gameloop.computer.board.fleet.destroyer.hit).toEqual(2);

//     expect(gameloop.computer.board.fleet.destroyer.sunk).toBeTruthy();
//   });
// });
