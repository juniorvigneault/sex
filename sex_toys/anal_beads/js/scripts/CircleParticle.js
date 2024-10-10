class CircleParticle {
  constructor(x, y, r, isStatic, composite) {
    this.x = x;
    this.y = y;
    this.r = r;

    this.popped = false;
    this.inTunnel = true;
    this.handleWidth = 12;
    let options = {
      friction: 0,
      restitution: 0,
      isStatic: isStatic,
      density: 1,
      collisionFilter: {
        category: CATEGORY_CIRCLE_PARTICLE,
        mask:
          CATEGORY_BRIDGE |
          CATEGORY_RECTANGLE |
          CATEGORY_CIRCLE_PARTICLE |
          CATEGORY_MOUSE, // Collide with bridge and rectangle
      },
    };

    this.body = Bodies.circle(this.x, this.y, this.r / 2, options);

    Composite.add(composite, this.body);
  }

  display(color, isHandle) {
    let { h, s, l } = color;
    push();
    let pos = this.body.position;
    let angle = this.body.angle;
    translate(pos.x, pos.y);
    rotate(angle);
    ellipseMode(CENTER);

    if (isHandle) {
      strokeHsluv(h, s, l);
      strokeWeight(this.handleWidth);
      fillHsluv(230, 72.9, 78.2);
      ellipse(0, 0, this.r - this.handleWidth);
    } else {
      push();
      noStroke();
      fillHsluv(h, s, l);
      ellipse(0, 0, this.r);
      pop();
      // yellow dots
      // fillHsluv(61.8, 75.5, 81.9);
      // ellipse(0, 0, 30);
      // White reflection on beads
      // push();
      // strokeHsluv(0, 0, 100);
      // strokeWeight(13);
      // noFill();
      // arc(15, 15, 50, 50, 0, PI / 3.0); // lower quarter circle
      // fill(255);
      // noStroke();
      // ellipse(7, 45, 14);
      // pop();
    }
    pop();
  }
}
