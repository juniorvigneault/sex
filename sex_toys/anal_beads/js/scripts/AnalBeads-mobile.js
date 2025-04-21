class AnalBeads {
  constructor(sX, sY, beadSize) {
    this.beads = [];

    this.beadConstraints = [];
    this.startX = sX;
    this.startY = sY;
    this.constraintLength = 250;
    this.toyLength = 1400;
    this.beadSize = beadSize;
    this.spaceBetweenBeads = this.beadSize + 40;
    this.makeChain();
    // this.numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    // this.cardNumber;
    // this.cardNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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
    let handle = false;
    let prev = null;

    // Array of unique messages for each bead

    //fr
    // const messages = [
    //   "Il faut donc lui donner un coup de pouce et enduire le jouet de lubrifiant pour que les stimulations ne causent pas trop de friction ou de l’inconfort.",
    //   "Savais-tu que la stimulation anale demande une bonne quantité de lubrifiants? C’est parce que l’anus ne lubrifie pas naturellement.",
    //   "Par exemple, utiliser des billes anales lors de la pénétration vaginale peut décupler les sensations.",
    //   "Les jouets comme les billes anales peuvent avoir le premier rôle, mais peuvent aussi être utilisés pour amplifier les sensations d'autres stimulations.",
    //   "L’anus peut être stimulé à son entrée doucement avec le doigt, la langue ou encore la bouche. En plus de procurer du plaisir, cette stimulation permet de détendre les muscles de l’anus et d’y faciliter la pénétration qui pourrait suivre.",
    //   "Ça vaut la peine de prendre son temps et de préparer l’anus avant d’y insérer un jouet.",
    //   "La principale sensation vient de la contraction et décontraction des muscles lors de l’insertion et le retrait lent des billes.",
    //   "Les billes anales sont un jouet sexuel constitué de billes sphériques ou ovales alignées sur un fil. La taille des billes augmente le long du fil, ce qui permet une insertion progressive",
    // ];

    const messages = [
      "Give the toy a little help by applying lubricant, so that stimulation doesn’t cause too much friction or discomfort. Lubricant helps ensure smoother, more comfortable sensations during play.",
      "Did you know that anal stimulation requires a good amount of lubricant? That’s because the anus does not naturally produce its own lubrication, making external lubrication essential for comfort and safety.",
      "For example, using anal beads during vaginal penetration can dramatically enhance sensations. Combining different types of stimulation can create more intense, layered, and unique sexual experiences for many people.",
      "Toys like anal beads can take center stage but can also be used to amplify sensations during other forms of stimulation, adding a playful or intensified dimension to sexual exploration.",
      "The anus can be gently stimulated at its entrance with a finger, tongue, or mouth. Besides providing pleasure, this kind of stimulation helps relax the muscles, making penetration easier and more enjoyable.",
      "It's worth taking your time to prepare the anus before inserting a toy. Patience and gradual stimulation not only increase comfort but can also lead to much more pleasurable sensations overall.",
      "The main sensation comes from the contraction and relaxation of muscles during the slow insertion and withdrawal of the beads, creating waves of pleasure through rhythmic and controlled movements.",
      "Anal beads are a sex toy made of spherical or oval beads aligned along a string. The size of the beads can sometimes gradually increases, allowing for progressive insertion and customizable levels of sensation.",
    ];

    let beadIndex = 0; // Track bead numbers
    let cardCounter = 1; // Track card numbers starting at 1

    for (
      let y = this.startY;
      y < this.startY + this.toyLength;
      y += this.spaceBetweenBeads
    ) {
      let message = null;
      let cardNumber = null;

      // Assign messages and card numbers only for beads 1 to 8
      if (beadIndex > 0 && beadIndex < 9) {
        message = messages[cardCounter - 1]; // Get correct message
        cardNumber = cardCounter; // Assign correct card number
        cardCounter++; // Increase card counter
      }

      let p = new CircleParticle(
        this.startX,
        y,
        this.beadSize,
        false,
        world,
        message,
        cardNumber
      );

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
