jest.mock("../gameboard", () => {
  const Gameboard = jest.requireActual("../gameboard");
  return {
    gameBoard: new Gameboard(),
  };
});

// creates a battleship mock from ship class.

const gameBoard = require("../gameboard").gameBoard;

describe("the gameboards grid contains", () => {
  it("10 points on it's X axis", () => {
    expect(Object.keys(gameBoard.grid).length).toBe(10);
  });

  it("10 points on it's Y axis", () => {
    expect(gameBoard.grid.j.length).toBe(10);
  });
});

describe("validateShip horizontally returns", () => {
  it("true when a ship has has all of it's length on the grid ", () => {
    expect(
      gameBoard.validateShip(gameBoard.fleet.battleship, ["d", 5], false)
    ).toBe(true);
  });

  it("false when a ship has a part of it's length off the grid", () => {
    expect(
      gameBoard.validateShip(gameBoard.fleet.battleship, ["h", 5], false)
    ).toBe(false);
  });
});

describe("validateShip vertically returns", () => {
  it("true when a ship has all of it's length on the grid", () => {
    expect(
      gameBoard.validateShip(gameBoard.fleet.battleship, ["e", 3], true)
    ).toBe(true);
  });
  it("false when a ship has a part of it's length off the grid", () => {
    expect(
      gameBoard.validateShip(gameBoard.fleet.battleship, ["e", 8], true)
    ).toBe(false);
  });
});

describe("placeShip succesfully places ship", () => {
  it("horizontally from [c,5]", () => {
    gameBoard.placeShip(gameBoard.fleet.battleship, ["c", 5], false);
    expect(gameBoard.grid.c[4]).toBe("Battleship");
    expect(gameBoard.grid.d[4]).toBe("Battleship");
    expect(gameBoard.grid.e[4]).toBe("Battleship");
    expect(gameBoard.grid.f[4]).toBe("Battleship");
  });

  it("vertically from [a,2]", () => {
    gameBoard.placeShip(gameBoard.fleet.battleship, ["a", 2], true);
    expect(gameBoard.grid.a[1]).toBe("Battleship");
    expect(gameBoard.grid.a[2]).toBe("Battleship");
    expect(gameBoard.grid.a[3]).toBe("Battleship");
    expect(gameBoard.grid.a[4]).toBe("Battleship");
  });
});

// it("placeShip returns false if coordinates already contain part of another ship.", () => {
//   expect(gameBoard.placeShip(ship, ["c", 5], false)).toBe(false);
// });
