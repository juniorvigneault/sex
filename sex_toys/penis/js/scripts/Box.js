class Box {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 200;
    this.h = 20;
    this.walls = [];
    this.bottom = new RectangleParticle(x, y, this.w, this.h, true, world);
    this.leftWall = new RectangleParticle(
      x - this.w / 2,
      y - this.w / 2,
      this.h,
      this.w,
      true,
      world
    );
    this.rightWall = new RectangleParticle(
      x + this.w / 2,
      y - this.w / 2,
      this.h,
      this.w,
      true,
      world
    );
    this.walls.push(this.bottom);
    this.walls.push(this.leftWall);
    this.walls.push(this.rightWall);
  }

  display() {
    p.push();
    p.pop();
  }
}
