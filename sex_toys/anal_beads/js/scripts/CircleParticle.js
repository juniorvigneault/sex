class CircleParticle {
  constructor(x, y, r, isStatic, composite) {
    this.x = x;
    this.y = y;
    this.r = r;

    let options = {
      friction: 0,
      restitution: 0,
      isStatic: isStatic,
      density: 1,
      collisionFilter: {
        category: CATEGORY_CIRCLE_PARTICLE,
        mask: CATEGORY_BRIDGE | CATEGORY_RECTANGLE | CATEGORY_CIRCLE_PARTICLE, // Collide with bridge and rectangle
      },
    };

    this.body = Bodies.circle(this.x, this.y, this.r / 2, options);

    Composite.add(composite, this.body);
  }

  display(color) {
    let { r, g, b, a } = color;
    push();
    let pos = this.body.position;
    let angle = this.body.angle;

    ellipseMode(CENTER);
    translate(pos.x, pos.y);
    rotate(angle);
    fill(r, g, b, a);
    ellipse(0, 0, this.r);
    pop();
  }
}
