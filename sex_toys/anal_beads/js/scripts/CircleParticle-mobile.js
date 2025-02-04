class CircleParticle {
  constructor(x, y, r, isStatic, composite, text, number) {
    this.x = x;
    this.y = y;
    this.r = r;
    // this.infoBubble = document.createElement("div");
    // this.infoBubble.classList.add("infoBubble");
    // p5jsCanvas.append(this.infoBubble);
    // this.textInfoBubble = document.createElement("p");
    // this.infoBubble.append(this.textInfoBubble);
    // this.textInfoBubble.classList.add("textInfoBubble");
    // this.textInfoBubble.innerText = text;
    this.infoCardDiv = document.createElement("div");
    this.infoCard = document.createElement("div");
    this.cardNumber = number;
    // console.log(this.infoCardDiv);
    // button for each card

    this.cardButton = document.createElement("button");
    this.cardNumberDiv = document.createElement("div");
    this.cardNumberText = document.createElement("p");

    this.cardNumberDiv.append(this.cardNumberText);
    this.infoCardDiv.append(this.cardNumberDiv);
    this.cardNumberText.innerHTML = number;

    this.cardNumberDiv.classList.add("cardNumber");
    this.cardNumberText.classList.add("cardNumberText");

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
          CATEGORY_CIRCLE_PARTICLE |
          CATEGORY_MOUSE, // Collide with bridge and rectangle
      },
    };

    this.body = Bodies.circle(this.x, this.y, this.r / 2, options);

    Composite.add(composite, this.body);
    this.createInfoCard();
  }

  createInfoCard() {
    this.infoCardDiv.classList.add("infoCardDiv");
    p5jsCanvas.append(this.infoCardDiv);
    this.infoCard.classList.add("infoCard");
    this.infoCardDiv.append(this.infoCard);
    this.textInfoCard = document.createElement("p");
    this.infoCard.append(this.textInfoCard);
    this.textInfoCard.classList.add("textInfoCard");
    this.textInfoCard.innerText = this.text;
    this.infoCardDiv.append(this.cardButton);
    this.cardButton.classList.add("continueButton");
    this.cardButton.innerText = "CONTINUER";

    this.cardButton.addEventListener("touchstart", () => {
      this.cardButton.style.backgroundColor = "#E2DBCC"; // Change to desired color
    });
    this.cardButton.addEventListener("touchend", (e) => {
      e.preventDefault(); // Prevent default touch behavior
      this.cardButton.style.backgroundColor = "#f5a623"; // Example color

      this.showCard = false;
      this.infoCardDiv.classList.remove("visible"); // Remove animation class

      this.infoCardDiv.style.display = "none";
      mouseConstraint.constraint.stiffness = 0.08;
    });

    this.cardButton.addEventListener("mousedown", () => {
      this.cardButton.style.backgroundColor = "#E2DBCC"; // Change to desired color
    });

    this.cardButton.addEventListener("mouseup", () => {
      this.cardButton.style.backgroundColor = "#FFF6F1"; // Reset to default (or another color)
    });
    this.cardButton.onclick = () => {
      // console.log(this.infoCardDiv);
      this.showCard = false;
      this.infoCardDiv.classList.remove("visible"); // Remove animation class
      this.infoCardDiv.style.display = "none";
      mouseConstraint.constraint.stiffness = 0.08;
    };
  }

  // position info card in the middle of the canvas even if user resizes
  moveInfoCardX() {
    // Get the current position of the canvas in the viewport
    let canvasRect = p5jsCanvas.getBoundingClientRect();
    // let infoCard = document.querySelector("#infoCardDiv");
    // card with is 240px (220+ 40 padding)
    let infoCardHalfWidth = 260 / 2;
    this.infoCardDiv.style.left =
      canvasRect.left + canvasDimensions.x / 2 - infoCardHalfWidth + "px"; // Center by subtracting 125 (half of 250px)
  }

  moveInfoCardY() {
    let canvasRect = p5jsCanvas.getBoundingClientRect();
    // card height is 280px + 40 padd
    let infoCardHalfHeight = 320 / 2;
    this.infoCardDiv.style.top =
      canvasRect.top + canvasDimensions.y / 2 - infoCardHalfHeight + "px"; // Center by subtracting 125 (half of 250px)
  }

  display(color, isHandle) {
    let { r, g, b } = color;
    push();
    let pos = this.body.position;
    let angle = this.body.angle;
    translate(pos.x, pos.y);
    rotate(angle);
    ellipseMode(CENTER);
    // keep cards in the middle x axis
    this.moveInfoCardX();
    this.moveInfoCardY();
    // show card when bead is popped but prevent last card from opening
    if (this.showCard && this.cardNumber !== 10) {
      this.infoCardDiv.classList.add("visible"); // Add visible class for animation

      // Add a delay before applying opacity
      setTimeout(() => {
        this.infoCard.classList.add("opacity"); // Add the opacity transition class
      }, 100); // Delay in milliseconds

      this.infoCardDiv.style.display = "flex";
      mouseConstraint.constraint.stiffness = 0;
    }
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
      // yellow dots
      // fillHsluv(61.8, 75.5, 81.9);
      // ellipse(0, 0, 30);
      // White reflection on beads
      // push();
      // strokeHsluv(0, 0, 100);
      // strokeWeight(13);
      // noFill();
      // arc(15, 15, 50, 50, 0, PI / 3.0); // lower quarter circle
      // fill(255);
      // noStroke();
      // ellipse(7, 45, 14);
      // pop();
      // Get the current position of the canvas in the viewport
      // let canvasRect = p5jsCanvas.getBoundingClientRect();

      // Update the div's position relative to the canvas
      // this.infoBubble.style.left = canvasRect.left + pos.x - 125 + "px"; // Center by subtracting 125 (half of 250px)
      // this.infoBubble.style.top = canvasRect.top + pos.y - 125 + "px";
      // rotate the element by the same angle
      // this.infoBubble.style.transform = `rotate(${angle}rad)`;
      pop();
    }
    pop();
  }
}
