class AnalBeads {
  constructor(sX, sY) {
    this.beads = [];

    this.beadConstraints = [];
    this.startX = sX;
    this.startY = sY;
    this.constraintLength = 185;
    this.toyLength = 900;
    this.beadSize = 140;
    this.spaceBetweenBeads = this.beadSize + 40;
    this.makeChain();
  } //constructor

  display() {
    for (let i = 0; i < this.beads.length; i++) {
      if (i > 0) {
        push();
        stroke(0, 255, 0);
        strokeWeight(5);
        line(
          this.beads[i - 1].body.position.x,
          this.beads[i - 1].body.position.y,
          this.beads[i].body.position.x,
          this.beads[i].body.position.y
        );
        pop();
      }
      this.beads[i].display();
    }
  }

  makeChain() {
    let fixed = false;
    let prev = null;

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
          stiffness: 0,
        };
        //see doc
        let constraint = Constraint.create(options);
        World.add(world, constraint);
      }
      prev = p;
    } //for
  }
} //class
