class Bum {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.cheeks = [];
    this.cheekSize = 500;
    this.rightCheek = new CircleParticle(
      this.x - this.cheekSize / 2.2,
      this.y,
      this.cheekSize,
      true,
      world
    );

    this.leftCheek = new CircleParticle(
      this.x + this.cheekSize / 2.2,
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
      cheek.display();
    }
  }
}
