class RectangleParticle {
  constructor(x, y, w, h, isStatic, world) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    let options = {
      friction: 0,
      restitution: 0,
      isStatic: isStatic,
      collisionFilter: {
        category: CATEGORY_RECTANGLE,
        mask: CATEGORY_CIRCLE_PARTICLE | CATEGORY_SPERM, // Collide only with circle particle
      },
    };

    this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, options);
    World.add(world, this.body);
  }

  display(color, p) {
    p.push();
    let pos = this.body.position;
    let angle = this.body.angle;

    p.rectMode(p.CENTER);
    p.translate(pos.x, pos.y);
    p.rotate(angle);
    // noStroke();
    // fillHsluv(321, 49, 50);
    p.fill(color, 0, 0, 0);
    p.noStroke();
    p.rect(0, 0, this.w, this.h);
    p.pop();
  }
}
