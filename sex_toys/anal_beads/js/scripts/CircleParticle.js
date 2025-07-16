class CircleParticle {
  constructor(x, y, r, isStatic, composite, text, number) {
    this.x = x;
    this.y = y;
    this.r = r;

    this.popped = false;
    this.showCard = false;
    this.text = text;
    this.inTunnel = true;
    this.handleWidth = 12;
    let options = {
      friction: 1,
      restitution: 0,
      // mass: ,
      isStatic: isStatic,
      density: 1,
      collisionFilter: {
        category: CATEGORY_CIRCLE_PARTICLE,
        mask:
          CATEGORY_BRIDGE |
          CATEGORY_RECTANGLE |
          // CATEGORY_CIRCLE_PARTICLE |
          CATEGORY_MOUSE, // Collide with bridge and rectangle
      },
      // isStatic: true,
    };

    this.body = Bodies.circle(this.x, this.y, this.r / 2, options);

    Composite.add(composite, this.body);
  }

  display(color, isHandle) {
    let { r, g, b } = color;
    push();
    let pos = this.body.position;
    let angle = this.body.angle;
    translate(pos.x, pos.y);
    rotate(angle);
    ellipseMode(CENTER);
    // if handle, then draw ellipse in the middle with color of background
    // to create illusion that it is a ring
    if (isHandle) {
      // strokeHsluv(h, s, l);
      stroke(r, g, b);
      strokeWeight(this.handleWidth);
      // fillHsluv(14, 79.6, 29.1);
      // fill();
      noFill();
      ellipse(0, 0, this.r - this.handleWidth);
    } else {
      push();
      noStroke();
      // fillHsluv(h, s, l);
      fill(r, g, b);
      ellipse(0, 0, this.r);

      pop();
    }
    pop();
  }
}
