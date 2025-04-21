class CircleParticle {
  constructor(x, y, r, isStatic, composite) {
    this.x = x;
    this.y = y;
    this.r = r;

    let options = {
      friction: 0.8,
      restitution: 1,
      isStatic: isStatic,
      // density: 0.001,
      frictionAir: 0.1,
      mass: 10000,
      collisionFilter: {
        category: CATEGORY_CIRCLE_PARTICLE,
        mask:
          CATEGORY_BRIDGE |
          CATEGORY_RECTANGLE |
          CATEGORY_MOUSE |
          CATEGORY_CIRCLE_PARTICLE, // Collide with bridge and rectangle
      },
    };

    this.body = Bodies.circle(this.x, this.y, this.r / 2, options);
    console.log(this.body);
    // hack to make the balls separated at the beginning without mouse interaction...
    setTimeout(() => {
      this.body.collisionFilter.mask =
        CATEGORY_BRIDGE | CATEGORY_RECTANGLE | CATEGORY_MOUSE;
    }, 100);

    Composite.add(composite, this.body);
  }

  display(color) {
    let { r, g, b, a } = color;
    push();
    let pos = this.body.position;
    let angle = this.body.angle;
    noStroke();
    ellipseMode(CENTER);
    translate(pos.x, pos.y);
    rotate(angle);
    fill(r, g, b, a);
    ellipse(0, 0, this.r);

    pop();

    push();

    pop();
  }
}
