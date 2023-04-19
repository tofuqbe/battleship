jest.mock("./gameboard", () => {
  const Gameboard = jest.requireActual("./gameboard");
  return {
    gameBoard: new Gameboard(),
  };
});

// creates a battleship mock from ship class.
jest.mock("./ship", () => {
  const Ship = jest.requireActual("./ship");

  return {
    ship: new Ship("Battleship", 4),
  };
});

const gameBoard = require("./gameboard").gameBoard;
const ship = require("./ship").ship;

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
    expect(gameBoard.validateShip(ship, ["d", 5], "horizontal")).toBe(true);
  });

  it("false when a ship has a part of it's length off the grid", () => {
    expect(gameBoard.validateShip(ship, ["h", 5], "Horizontal")).toBe(false);
  });
});

describe("validateShip vertically returns", () => {
  it("true when a ship has all of it's length on the grid", () => {
    expect(gameBoard.validateShip(ship, ["e", 3], "vertical")).toBe(true);
  });
  it("false when a ship has a part of it's length off the grid", () => {
    expect(gameBoard.validateShip(ship, ["e", 8], "vertical")).toBe(false);
  });
});

describe("placeShip succesfully places ship", () => {
  it("horizontally from [c,5]", () => {
    gameBoard.placeShip(ship, ["c", 5], "horizontal");
    expect(gameBoard.grid.c[4]).toBe("Battleship");
    expect(gameBoard.grid.d[4]).toBe("Battleship");
    expect(gameBoard.grid.e[4]).toBe("Battleship");
    expect(gameBoard.grid.f[4]).toBe("Battleship");
  });

  it("vertically from [a,2]", () => {
    gameBoard.placeShip(ship, ["a", 2], "vertical");
    expect(gameBoard.grid.a[1]).toBe("Battleship");
    expect(gameBoard.grid.a[2]).toBe("Battleship");
    expect(gameBoard.grid.a[3]).toBe("Battleship");
    expect(gameBoard.grid.a[4]).toBe("Battleship");
  });
});

it("placeShip returns false if coordinates already contain part of another ship.", () => {
  expect(gameBoard.placeShip(ship, ["c", 5], "horizontal")).toBe(false);
});
