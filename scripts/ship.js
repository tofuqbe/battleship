class Ship {
  constructor(name, length) {
    (this.name = name), (this.length = length);
    this.hit = 0;
    this.sunk = false;
  }

  isHit() {
    this.hit++;
  }

  isSunk() {
    if (this.hit === this.length) this.sunk = true;
  }
}

export default Ship;
