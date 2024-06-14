class AnalBeads {
  constructor(sX, sY, beadSize) {
    this.beads = [];

    this.beadConstraints = [];
    this.startX = sX;
    this.startY = sY;
    this.constraintLength = 120;
    this.toyLength = 200;
    this.beadSize = beadSize;
    this.spaceBetweenBeads = this.beadSize + 10;
    this.makeChain();
  } //constructor

  display() {
    for (let i = 0; i < this.beads.length; i++) {
      if (i > 0) {
        push();
        stroke(255, 105, 180);
        strokeWeight(200);
        line(
          this.beads[i - 1].body.position.x,
          this.beads[i - 1].body.position.y,
          this.beads[i].body.position.x,
          this.beads[i].body.position.y
        );
        pop();
      }
      // this.beads[i].display({ r: 200, g: 100, b: 100, a: 255 });
    }
  }

  makeChain() {
    let fixed = false;
    let prev = null;
    let first = null;
    let counter = 0;
    let x = this.startX;

    for (
      let y = this.startY;
      y < this.startY + this.toyLength;
      y += this.spaceBetweenBeads
    ) {
      if (prev === null) {
        fixed = true;
      } else {
        fixed = false;
      }

      let p = new CircleParticle(x, y, this.beadSize, false, world);
      this.beads.push(p);
      if (prev === null) {
        first = p;
      } else {
        let options = {
          bodyA: prev.body,
          bodyB: p.body,
          pointA: {
            x: 0,
            y: 0,
          },
          length: this.constraintLength,
          stiffness: 0.1,
        };
        let constraint = Constraint.create(options);
        World.add(world, constraint);
      }
      prev = p;
    } //for

    // // Add constraint from the last circle to the first circle
    // if (first !== null && prev !== null && first !== prev) {
    //   let options = {
    //     bodyA: prev.body,
    //     bodyB: first.body,
    //     pointA: {
    //       x: 0,
    //       y: 0,
    //     },
    //     length: this.constraintLength,
    //     stiffness: 0.1,
    //   };
    //   let constraint = Constraint.create(options);
    //   World.add(world, constraint);
    // }
  }
} //class
