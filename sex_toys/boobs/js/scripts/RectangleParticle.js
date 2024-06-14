class RectangleParticle {
  constructor(x, y, w, h, isStatic, world) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    let options = {
      friction: 0,
      restitution: 0,
      isStatic: true,
      collisionFilter: {
        category: CATEGORY_RECTANGLE,
        mask: CATEGORY_CIRCLE_PARTICLE | CATEGORY_BRIDGE, // Collide only with circle particle
      },
    };

    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
    World.add(world, this.body);
  }

  display(color) {
    let { r, g, b, a } = color;
    push();
    let pos = this.body.position;
    let angle = this.body.angle;

    rectMode(CENTER);
    translate(pos.x, pos.y);
    rotate(angle);
    // noStroke();
    // fillHsluv(321, 49, 50);
    fill(r, g, b, a);
    rect(0, 0, this.w, this.h);
    pop();
  }
}
