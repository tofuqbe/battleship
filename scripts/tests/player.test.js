jest.mock("../player", () => {
  const { Player, Computer } = jest.requireActual("../player");
  return {
    player: new Player("Steve", true),
    computer: new Computer("Computer", false),
  };
});

const player = require("../player").player;
const computer = require("../player").computer;

describe("player and computer have names", () => {
  it("player is Steve", () => {
    expect(player.name).toBe("Steve");
  });
  it("computer is Computer", () => {
    expect(computer.name).toBe("Computer");
  });
});

describe("randomiseCoordinates picks random number for computer", () => {
  it("it returns an array", () => {
    expect(Array.isArray(computer.randomiseCoordinates())).toBe(true);
  });
  it("it removes from availableCoordinates", () => {
    expect(computer.availableCoordinates.length).toEqual(99);
  });
});
