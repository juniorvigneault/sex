class CircleParticle {
  constructor(x, y, r, isStatic, composite, p) {
    this.x = x;
    this.y = y;
    this.r = r;

    let options = {
      friction: 0.1,
      restitution: 1,
      isStatic: isStatic,
      // density: 0.001,
      frictionAir: 0.03,
      mass: 10000,
      collisionFilter: {
        category: CATEGORY_CIRCLE_PARTICLE,
        mask:
          CATEGORY_PENIS |
          CATEGORY_RECTANGLE |
          CATEGORY_MOUSE |
          CATEGORY_CIRCLE_PARTICLE, // Collide with bridge and rectangle
      },
    };

    this.body = Bodies.circle(this.x, this.y, this.r / 2, options);
    // hack to make the balls separated at the beginning without mouse interaction...
    setTimeout(() => {
      this.body.collisionFilter.mask =
        CATEGORY_PENIS | CATEGORY_RECTANGLE | CATEGORY_MOUSE;
    }, 100);

    Composite.add(composite, this.body);
    this.p = p;
  }

  display(color, p) {
    let { r, g, b, a } = color;
    p.push();
    let pos = this.body.position;
    let angle = this.body.angle;
    p.noStroke();
    p.ellipseMode(p.CENTER);
    p.translate(pos.x, pos.y);
    p.rotate(angle);
    fillHsluv(color.r, color.g, color.b, p);
    p.ellipse(0, 0, this.r);
    p.pop();
  }
}
