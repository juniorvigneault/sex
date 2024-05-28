class RectangleParticle {
  constructor(x, y, w, h, isStatic, world) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    let options = {
      friction: 1,
      restitution: 0,
      isStatic: isStatic,
    };

    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
    World.add(world, this.body);
  }

  display(color) {
    let { r, g, b } = color;
    push();
    let pos = this.body.position;
    let angle = this.body.angle;

    rectMode(CENTER);
    translate(pos.x, pos.y);
    rotate(angle);
    noStroke();
    // fillHsluv(321, 49, 50);
    fill(r, g, b);
    rect(0, 0, this.w, this.h);
    pop();
  }
}