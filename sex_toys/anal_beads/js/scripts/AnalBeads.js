class AnalBeads {
  constructor(sX, sY, beadSize) {
    this.beads = [];

    this.beadConstraints = [];
    this.startX = sX;
    this.startY = sY;
    this.constraintLength = 235;
    this.toyLength = 2700;
    this.beadSize = beadSize;
    this.spaceBetweenBeads = this.beadSize + 150;
    this.makeChain();
  } //constructor

  display() {
    for (let i = 0; i < this.beads.length; i++) {
      let lastBead = this.beads.length - 1;

      if (i > 0) {
        let p1 = this.beads[i - 1].body.position;
        let p2 = this.beads[i].body.position;

        push();
        stroke(140, 19, 19);
        strokeWeight(5);

        // If the current bead is the HANDLE (last bead), clip the line
        if (i === lastBead) {
          // Calculate direction vector between beads
          let dx = p2.x - p1.x;
          let dy = p2.y - p1.y;
          let len = Math.sqrt(dx * dx + dy * dy);

          // Shorten the line by the radius of the handle hole (half of (r - handleWidth))
          let shrinkAmount = (this.beads[i].r - this.beads[i].handleWidth) / 2;

          // Calculate new target point
          let newX = p2.x - (dx / len) * shrinkAmount;
          let newY = p2.y - (dy / len) * shrinkAmount;

          line(p1.x, p1.y, newX, newY);
        } else {
          // Normal full line between beads
          line(p1.x, p1.y, p2.x, p2.y);
        }
        pop();
      }

      if (i === lastBead) {
        this.beads[i].display({ r: 140, g: 19, b: 19 }, true);
      } else {
        this.beads[i].display({ r: 140, g: 19, b: 19 }, false);
      }
    }
  }

  makeChain() {
    let prev = null;
    // Array of unique messages for each bead

    let beadIndex = 0; // Track bead index

    for (
      let y = this.startY;
      y < this.startY + this.toyLength;
      y += this.spaceBetweenBeads
    ) {
      let p = new CircleParticle(this.startX, y, this.beadSize, false, world);

      if (beadIndex === 9) {
        // 🧠 If it's the first bead after the handle, mark it as popped right away
        p.popped = true;
      }

      this.beads.push(p);

      if (prev !== null) {
        let options = {
          bodyA: prev.body,
          bodyB: p.body,
          pointA: { x: 0, y: 0 },
          length: this.constraintLength,
          stiffness: 0.2,
        };
        let constraint = Constraint.create(options);
        World.add(world, constraint);
      }
      prev = p;
      beadIndex++;
    }
  }
}
