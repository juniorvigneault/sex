class AnalBeads {
  constructor(sX, sY, beadSize) {
    this.beads = [];

    this.beadConstraints = [];
    this.startX = sX;
    this.startY = sY;
    this.constraintLength = 225;
    this.toyLength = 1600;
    this.beadSize = beadSize;
    this.spaceBetweenBeads = this.beadSize + 40;
    this.makeChain();
    this.number = 0;
    // this.cardNumber;
    // this.cardNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  } //constructor

  display() {
    // make chain
    for (let i = 0; i < this.beads.length; i++) {
      let lastBead = this.beads.length - 1;
      if (i > 0) {
        push();
        strokeHsluv(2.9, 81.2, 7.4);
        strokeWeight(5);
        line(
          this.beads[i - 1].body.position.x,
          this.beads[i - 1].body.position.y,
          this.beads[i].body.position.x,
          this.beads[i].body.position.y
        );
        pop();
      }
      // color of beads and ring
      if (i === lastBead) {
        this.beads[i].display({ h: 2.9, s: 81.2, l: 7.4 }, true);
      } else {
        this.beads[i].display({ h: 2.9, s: 81.2, l: 7.4 }, false);
      }
    }
  }

  makeChain() {
    let handle = false;
    let prev = null;

    // Array of unique messages for each bead
    const messages = [
      "last_bead",
      "Message for bead 1: Welcome!",
      "Il faut donc lui donner un coup de pouce et enduire le jouet de lubrifiant pour que les stimulations ne causent pas trop de friction ou de l’inconfort.",
      "Savais-tu que la stimulation anale demande une bonne quantité de lubrifiants? C’est parce que l’anus ne lubrifie pas naturellement.",
      "Par exemple, utiliser des billes anales lors de la pénétration vaginale peut décupler les sensations.",
      "Les jouets comme les billes anales peuvent avoir le premier rôle, mais peuvent aussi être utilisés pour amplifier les sensations d'autres stimulations.",
      "L’anus peut être stimulé à son entrée doucement avec le doigt, la langue ou encore la bouche. Cette stimulation permet de détendre les muscles de l’anus et d’y faciliter la pénétration qui pourrait suivre.",
      "Ça vaut la peine de prendre son temps et de préparer l’anus avant d’y insérer un jouet.",
      "La principale sensation vient de la contraction et décontraction des muscles lors de l’insertion et le retrait lent des billes.",
      "Les billes anales sont un jouet sexuel constitué de billes sphériques ou ovales alignées sur un fil. La taille des billes augmente le long du fil, ce qui permet une insertion progressive.",
    ];

    for (
      let y = this.startY;
      y < this.startY + this.toyLength;
      y += this.spaceBetweenBeads
    ) {
      // Use the index of the bead to get the corresponding message
      const index = this.beads.length % messages.length; // Loop through messages if more beads than messages
      const message = messages[index];

      console.log(this.number);
      let p = new CircleParticle(
        this.startX,
        y,
        this.beadSize,
        false,
        world,
        message // Pass the unique message for the bead
      );
      this.beads.push(p);

      // console.log(index);
      // let cardNumberText = document.querySelector(".cardNumberText");
      // cardNumberText.innerHTML = index;

      if (prev !== null) {
        let options = {
          bodyA: prev.body,
          bodyB: p.body,
          pointA: {
            x: 0,
            y: 0,
          },
          length: this.constraintLength,
          stiffness: 0.18,
        };
        // Create the constraint between beads
        let constraint = Constraint.create(options);
        World.add(world, constraint);
      }
      prev = p;
    } //for
  } //makeChain
} //class
