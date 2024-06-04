class Bum {
  constructor(x, y, bumSize) {
    this.x = x;
    this.y = y;

    this.cheeks = [];
    this.cheekSize = bumSize;
    this.rightCheek = new CircleParticle(
      this.x - this.cheekSize / 2.5,
      this.y,
      this.cheekSize,
      true,
      world
    );

    this.leftCheek = new CircleParticle(
      this.x + this.cheekSize / 2.5,
      this.y,
      this.cheekSize,
      true,
      world
    );

    this.cheeks.push(this.rightCheek);
    this.cheeks.push(this.leftCheek);
  }

  display() {
    for (let cheek of this.cheeks) {
      cheek.display({ r: 0, g: 0, b: 200, a: 0 });
    }
  }
}
