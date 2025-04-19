class RectangleParticle {
  constructor(x, y, w, h, isStatic, world) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    let options = {
      friction: 1,
      restitution: 1,
      isStatic: isStatic,
      collisionFilter: {
        category: CATEGORY_RECTANGLE,
        mask: CATEGORY_MOUSE | CATEGORY_BLOB | CATEGORY_CLAMP | CATEGORY_CHAIN, // Collide only with circle particle
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
    fill(255, 0, 0, 0);
    rect(0, 0, this.w, this.h);
    pop();
  }
}
