class AnalBeads {
  constructor(sX, sY, beadSize) {
    this.beads = [];

    this.beadConstraints = [];
    this.startX = sX;
    this.startY = sY;
    this.constraintLength = 250;
    this.toyLength = 300;
    this.beadSize = beadSize;
    this.spaceBetweenBeads = this.beadSize + 10;
    this.makeChain();
  } //constructor

  display(p) {
    for (let i = 0; i < this.beads.length; i++) {
      if (i > 0) {
        p.push();
        p.stroke(0, 150, 0);
        p.strokeWeight(200);
        p.line(
          this.beads[i - 1].body.position.x,
          this.beads[i - 1].body.position.y,
          this.beads[i].body.position.x,
          this.beads[i].body.position.y
        );
        p.pop();
      }
      this.beads[i].display({ r: 0, g: 150, b: 0, a: 255 }, p);
    }
  }

  makeChain() {
    let fixed = false;
    let prev = null;
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

      let p = new CircleParticle(x, y, this.beadSize, fixed, world);
      this.beads.push(p);
      if (prev !== null) {
        let options = {
          bodyA: prev.body,
          bodyB: p.body,
          pointA: {
            x: 0,
            y: 0,
          },
          length: this.constraintLength,
          stiffness: 0.17,
        };
        //see doc
        let constraint = Constraint.create(options);
        World.add(world, constraint);
      }
      prev = p;
    } //for
  }
} //class
