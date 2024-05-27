class CircleParticle {
  constructor(x, y, r, isStatic, world) {
    this.x = x;
    this.y = y;
    this.r = r;

    let options = {
      friction: 1,
      restitution: 0,
      isStatic: isStatic,
    };

    this.body = Bodies.circle(this.x, this.y, this.r / 2, options);
    World.add(world, this.body);
  }

  display() {
    push();
    let pos = this.body.position;
    let angle = this.body.angle;

    ellipseMode(CENTER);
    translate(pos.x, pos.y);
    rotate(angle);
    noStroke();
    // fillHsluv(321, 49, 50);
    fill(0, 200, 0);
    ellipse(0, 0, this.r);
    // fill(255);
    // ellipse(0, 0, 12);
    pop();
  }
}
