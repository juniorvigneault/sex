class AnalBeads {
  constructor(sX, sY, beadSize, ballOffset) {
    this.beads = [];

    this.beadConstraints = [];
    this.startX = sX;
    this.startY = sY;
    this.constraintLength = 205;
    this.toyLength = 230;
    this.beadSize = beadSize;
    this.spaceBetweenBeads = this.beadSize + 0;
    this.ballOffset = ballOffset;
    this.makeChain();
  } //constructor

  display(p) {
    for (let i = 0; i < this.beads.length; i++) {
      if (i > 0) {
        p.push();
        strokeHsluv(293.4, 71.1, 90.1, p);
        // p.blendMode(p.DARKEST);

        p.strokeWeight(this.beadSize);
        p.line(
          this.beads[i - 1].body.position.x,
          this.beads[i - 1].body.position.y,
          this.beads[i].body.position.x,
          this.beads[i].body.position.y
        );
        p.pop();
      }
      this.beads[i].display({ h: 293.4, s: 71.1, l: 90.1, a: 255 }, p);
    }
  }

  makeChain() {
    let fixed = false;
    let prev = null;
    let counter = 0;
    let x = this.startX;

    for (let i = 0; i < 2; i++) {
      let y;
      if (i === 0) {
        // First bead (fixed)
        fixed = true;
        y = this.startY;
      } else {
        // Second bead (NOT fixed), CUSTOM position
        fixed = false;
        y = this.startY + 150; // 👈 change 100 to whatever offset you want
        x = this.startX + this.ballOffset; // 👈 you can even change X if you want
      }

      let p = new CircleParticle(x, y, this.beadSize, fixed, world);
      this.beads.push(p);

      if (prev !== null) {
        let options = {
          bodyA: prev.body,
          bodyB: p.body,
          pointA: { x: 0, y: 0 },
          length: this.constraintLength,
          stiffness: 0.04,
        };
        let constraint = Constraint.create(options);
        World.add(world, constraint);
      }
      prev = p;
    }
  }
} //class
