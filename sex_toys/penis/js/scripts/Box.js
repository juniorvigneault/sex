class Box {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.w = 220;
    this.h = 20;
    this.walls = [];
    this.bottom = new RectangleParticle(x, y, this.w, this.h, true, world);
    this.leftWall = new RectangleParticle(
      x - this.w / 2,
      y - this.w / 2,
      this.h,
      this.w,
      true,
      world
    );
    this.rightWall = new RectangleParticle(
      x + this.w / 2,
      y - this.w / 2,
      this.h,
      this.w,
      true,
      world
    );
    this.walls.push(this.bottom);
    this.walls.push(this.leftWall);
    this.walls.push(this.rightWall);

    this.infoBubble = document.createElement("div");
    this.infoBubble.classList.add("infoBubble");
    this.canvas = document.querySelector("#p5js-canvas");
    this.canvas.append(this.infoBubble);
    this.textInfoBubble = document.createElement("p");
    this.infoBubble.append(this.textInfoBubble);
    this.textInfoBubble.classList.add("textInfoBubble");
    this.textInfoBubble.innerText = text;
  }

  //   display(p) {
  //     p.push();
  //     p.fill(0);
  //     p.textSize(32);
  //     p.textAlign(p.CENTER);
  //     p.text(
  //       `Le gland contient une concentration de terminaisons nerveuses qui en fait LA zone de stimulation du pénis. Cependant, d’autres zones méritent notre attention: le frein (situé à la jonction du gland et de la verge), le périnée (la zone entre les testicules et l’anus) et les testicules sont particulièrement sensibles pour certaines personnes et peuvent susciter du plaisir si elles sont stimulées doucement.
  // `,
  //       this.x,
  //       this.y - this.w / 2
  //     );
  //     p.pop();
  //   }

  display(p) {
    // let { h, s, l } = color;
    p.push();

    let canvasRect = this.canvas.getBoundingClientRect();
    this.infoBubble.style.left = `${this.x - this.w / 2}px`;
    this.infoBubble.style.top = `${this.y - this.w}px`;

    // Update the div's position relative to the canvas
    // this.infoBubble.style.left =
    //   canvasRect.left + this.bottom.body.position.x - 125 + "px"; // Center by subtracting 125 (half of 250px)
    // this.infoBubble.style.top =
    //   canvasRect.top + this.bottom.body.position.y - 125 + "px";
    // rotate the element by the same angle
    // this.infoBubble.style.transform = `rotate(${angle}rad)`;
    p.pop();
  }
}
