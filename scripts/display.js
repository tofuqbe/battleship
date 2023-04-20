class Display {
  constructor() {}

  static getPlayerName(body) {}

  static generateGrid(element) {
    for (let i = 0; i < 100; i++) {
      let zone = document.createElement("div");
      zone.classList.add("zone");
      element.append(zone);
    }
  }
}

export default Display;
