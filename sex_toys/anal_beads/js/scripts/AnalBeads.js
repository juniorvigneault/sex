class AnalBeads {
  constructor(sX, sY, beadSize) {
    this.beads = [];

    this.beadConstraints = [];
    this.startX = sX;
    this.startY = sY;
    this.constraintLength = 200;
    this.toyLength = 1000;
    this.beadSize = beadSize;
    this.spaceBetweenBeads = this.beadSize + 40;
    this.makeChain();
  } //constructor

  display() {
    for (let i = 0; i < this.beads.length; i++) {
      let lastBead = this.beads.length - 1;
      if (i > 0) {
        push();
        strokeHsluv(0, 0, 13.2);
        strokeWeight(5);
        line(
          this.beads[i - 1].body.position.x,
          this.beads[i - 1].body.position.y,
          this.beads[i].body.position.x,
          this.beads[i].body.position.y
        );
        pop();
      }
      if (i === lastBead) {
        this.beads[i].display({ h: 0, s: 0, l: 13.2 }, true);
      } else {
        this.beads[i].display({ h: 0, s: 0, l: 13.2 }, false);
      }
    }
  }

  makeChain() {
    let handle = false;
    let prev = null;
    let counter = 0;
    for (
      let y = this.startY;
      y < this.startY + this.toyLength;
      y += this.spaceBetweenBeads
    ) {
      let p = new CircleParticle(this.startX, y, this.beadSize, false, world);
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
