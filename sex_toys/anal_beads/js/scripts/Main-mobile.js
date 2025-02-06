// matter.js components
let Engine = Matter.Engine;
let Events = Matter.Events;
let Runner = Matter.Runner;
let Bodies = Matter.Bodies;
let Vector = Matter.Vector;
let Body = Matter.Body; // Ensure Body is correctly imported
let Composite = Matter.Composite;
let World = Matter.World;
let Composites = Matter.Composites;
let MouseConstraint = Matter.MouseConstraint;
let Mouse = Matter.Mouse;
let Constraint = Matter.Constraint;
let engine;
let world;
let mouseConstraint;
let particles = [];
let enclosures = [];
let analBeads;
let bum;
let mouse;
let beads = [];
let numBeads = 6;
let showInfoBox = false;
let textIMG;
let mouseIsPressed = false;
let toyIsGone = false;
let p5jsCanvas;
let showCard = false;

// shrinking/growing bead animation variables

let ellipseSize = 0; // Initial size of the ellipse
let fadeAmount = 0; // Initial fade value for the image (opacity)
let targetSize = 250; // Target size of the ellipse
let shrinking = false; // Track if we are shrinking the ellipse

let easeFactors = {
  grow: 0.2,
  shrink: 0.1,
  fadeIn: 0.5,
  fadeOut: 0.4,
};

let hoverTime = 300; // Time (in ms) to wait before growing (1 second)
let hoverStartTime = 0; // Time when the bead was first hovered
let isHovering = false; // Track whether we're currently hovering a bead
let currentBead = null; // Track the current bead being hovered

let gameX = 0;
let gameY = -50;
let canvasDimensions = {
  x: 550,
  y: 800,
};

// let gameX = 200;
// let gameY = 1400;
// let canvasDimensions = {
//   x: 1000,
//   y: 1000,
// };

const CATEGORY_BRIDGE = 0x0001;
const CATEGORY_CIRCLE_PARTICLE = 0x0002;
const CATEGORY_RECTANGLE = 0x0004;
const CATEGORY_MOUSE = 0x0008;
let endMessage;

function setup() {
  // let canvas = createCanvas(1000, 1000);
  // DESKTOP CANVAS
  let canvas = createCanvas(canvasDimensions.x, canvasDimensions.y);
  // MOBILE CANVAS
  let mobileCanvasWidth = displayWidth;

  soundMobile = new Soundmobile();
  // soundMobile.preloadSounds();
  // console.log(mobileCanvasWidth);
  // gameX = -mobileCanvasWidth / 2;
  // let canvasDesktopWidth = 500;

  // let canvas = createCanvas(displayWidth, displayHeight);

  p5jsCanvas = document.querySelector("#p5js-canvas");
  // Move the canvas within the HTML into the appropriate section
  canvas.parent("p5js-canvas");
  engine = Engine.create();
  world = engine.world;
  Runner.run(engine);
  // engine.world.gravity.scale = 0.00;

  (mouse = Mouse.create(document.querySelector("#p5js-canvas"))),
    (mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      collisionFilter: { category: CATEGORY_MOUSE },
      constraint: {
        stiffness: 0.08,
      },
    }));

  World.add(world, mouseConstraint);
  endMessage = document.querySelector("#end-message");
  // getAudioContext().resume(); // Resume the audio context

  //bum = new Bum(width / 2, 300, 400);

  addEnclosures();
  addBridge(); // Add the bridge here
  //addBeads();
  analBeads = new AnalBeads(gameX + 400, gameY - 1300, 115);
  let lastBead = analBeads.beads.length - 1;
  analBeads.beads[lastBead].popped = true;
  // Add event listener for mouse clicks

  Events.on(mouseConstraint, "mousedown", function (event) {
    const mousePosition = event.mouse.position;
    const bodies = Composite.allBodies(bridge);

    const collidedBodies = Matter.Query.point(bodies, mousePosition);
    let slappedCheek = collidedBodies[0];
    if (collidedBodies.length > 0) {
      Matter.Body.applyForce(slappedCheek, slappedCheek.position, {
        x: -50000,
        y: -50000,
      });
      // sounds.slap.play();
      soundMobile.playSound("slap");
    }
  });
  // createInfoCard();
}

function draw() {
  // background(255);
  displayBackground();
  // console.log("Velocity:", bridge.bodies[0].velocity);
  // if the beads go low enough, change the collision filter so
  // they don't collide with the the tunnel enclosure
  // this is in place to make the beads stay
  push();
  stroke(255);
  pop();

  for (let bead of analBeads.beads) {
    if (bead.body.position.y >= 500) {
      bead.inTunnel = false;
      bead.body.collisionFilter.mask =
        CATEGORY_BRIDGE | CATEGORY_CIRCLE_PARTICLE | CATEGORY_MOUSE;
    }

    // console.log(bead.popped);
    if (bead.body.position.y >= 250) {
      if (!bead.popped) {
        // sounds.pop.play();
        soundMobile.playSound("pop");
        bead.popped = true;
        bead.showCard = true;
      }
    }
  }

  analBeads.display();
  // mouseInfoBox();

  //bum.display();
  for (let enclosure of enclosures) {
    enclosure.display({ r: 200, g: 200, b: 200, a: 0 });
  }
  // push();
  // ellipseMode(CENTER);
  // ellipse();
  // pop();

  let rightCheek = bridge.bodies[0];
  let leftCheek = bridge.bodies[1];

  // push();
  // strokeWeight(1);
  // strokeHsluv(0, 0, 13.2);
  // noStroke();
  // ellipseMode(CENTER);
  // fillHsluv(16.4, 98.4, 42.5);
  // ellipse(rightCheek.position.x, rightCheek.position.y, 400);
  // beginClip();
  // // strokeWeight(0.4);
  // // strokeHsluv(0, 0, 13.2);
  // ellipseMode(CENTER);
  // fillHsluv(126.6, 62.2, 66.8);
  // ellipse(leftCheek.position.x, leftCheek.position.y, 400);
  // endClip();

  // pop();
  // strokeWeight(0.4);
  // strokeHsluv(0, 0, 13.2);
  let buttCheekSize = rightCheek.circleRadius * 2;

  ellipseMode(CENTER);
  // fill(255, 115, 191);

  fillHsluv(339.1, 100, 67.5);
  ellipse(leftCheek.position.x, leftCheek.position.y, buttCheekSize);
  noStroke();
  ellipseMode(CENTER);
  // fillHsluv(16.4, 98.4, 42.5);
  ellipse(rightCheek.position.x, rightCheek.position.y, buttCheekSize);

  if (analBeads.beads[0].body.position.y > height + 200) {
    toyIsGone = true;
  }
  if (toyIsGone) {
    articleLink();
  }

  // createInfoCard();
  // beadHover();
  // moveInfoCardX();
  // moveInfoCardY();

  // if (showCard) {
  //   // displayCard();
  // }

  // push();
  // ellipseMode(CORNER);
  // fill(0, 0, 0, 100);
  // ellipse(gameX - 30, -120, 320);
  // pop();
}

// function displayCard() {
//   let infoCardDiv = document.querySelector("#infoCardDiv");
//   let cardButton = document.querySelector("#cardButton");
//   infoCardDiv.style.display = "flex";

//   cardButton.onclick = function () {
//     // showCard == false;
//     // infoCardDiv.style.display = "none";
//     // console.log("clicked");
//   };
// }

function addEnclosures() {
  let bottomEnclosure = new RectangleParticle(
    width / 2,
    height + 50,
    width,
    100,
    true,
    world
  );

  enclosures.push(bottomEnclosure);

  let tunnelEnclosureLeft = new RectangleParticle(
    gameX - 30,
    gameY + 300,
    500,
    3000,
    true,
    world
  );
  let tunnelEnclosureRight = new RectangleParticle(
    gameX + 580,
    gameY + 300,
    500,
    3000,
    true,
    world
  );

  enclosures.push(tunnelEnclosureRight);
  enclosures.push(tunnelEnclosureLeft);
}

function mousePressed() {
  mouseIsPressed = true;
}

function mouseReleased() {
  mouseIsPressed = false;
}

// function addBeads() {
//   // Create a composite to hold the beads and constraints
//   let beadComposite = Composite.create();
//   let x = 0;
//   let beadSize = 1;
//   let spaceBetweenBeads = 40;
//   // Create beads
//   for (let i = 0; i < numBeads; i++) {
//     let bead = new CircleParticle(
//       x + i * beadSize + spaceBetweenBeads,
//       100,
//       beadSize,
//       true,
//       beadComposite,
//       "hello"
//     );
//     beads.push(bead);
//   }

//   // Add constraints (links) between the beads
//   for (let i = 0; i < beads.length - 1; i++) {
//     let options = {
//       bodyA: beads[i].body,
//       bodyB: beads[i + 1].body,
//       length: 60, // Distance between centers of beads
//       stiffness: 0.038,
//     };
//     let constraint = Constraint.create(options);
//     Composite.add(beadComposite, constraint);
//   }

//   // Add the bead composite to the world
//   Composite.add(world, beadComposite);
// }

function displayBackground() {
  push();
  fill(255, 51, 0);
  rect(0, 0, width, height);
  let gradient = drawingContext.createLinearGradient(0, height / 2, 0, height); // Vertical gradient from middle to bottom

  let rgb = hsluv.hsluvToRgb([284.9, 100, 70.1]);
  let colorBottom = `rgba(${rgb[0] * 255}, ${rgb[1] * 255}, ${
    rgb[2] * 255
  }, 1)`; // Fully opaque
  let colorTop = `rgba(${rgb[0] * 255}, ${rgb[1] * 255}, ${rgb[2] * 255}, 0)`; // Fully transparent

  gradient.addColorStop(0, colorTop); // Transparent at the midpoint
  gradient.addColorStop(1, colorBottom); // Full color at the bottom

  drawingContext.fillStyle = gradient;
  rect(0, height / 2, width, height / 2); // Draw the gradient
  pop();
}

function addBridge() {
  let group = Body.nextGroup(true);

  bridge = Composites.stack(0, 0, 2, 1, 200, 0, function (x, y) {
    return Bodies.circle(x, y, 175, {
      collisionFilter: {
        group: group,
        category: CATEGORY_BRIDGE,
        mask: CATEGORY_CIRCLE_PARTICLE,
      }, // Collide only with circle particle
      // chamfer: 0,
      density: 0.8,
      frictionAir: 0.01,
      // torque: 1,
      resititution: 0,
      friction: 1,
    });
  });

  // lenght between buttcheeks
  //
  Composites.chain(bridge, 0, 0, 0, 0, {
    stiffness: 0.15,
    length: 130,
  });

  Composite.add(world, [
    bridge,
    Constraint.create({
      pointA: { x: gameX + 50, y: gameY + 100 },
      bodyB: bridge.bodies[0],
      //
      pointB: { x: -60, y: 0 },
      length: 0,
      stiffness: 0,
    }),
    Constraint.create({
      pointA: { x: gameX + 500, y: gameY + 100 },
      bodyB: bridge.bodies[bridge.bodies.length - 1],
      pointB: { x: 60, y: 0 },
      length: 0,
      stiffness: 0,
    }),
  ]);
}

// function beadHover() {
//   const mousePosition = mouse.position;
//   let foundBead = false;
//   let beadsOnly = analBeads.beads.length - 1;

//   for (let i = 0; i < beadsOnly; i++) {
//     let bead = analBeads.beads[i];

//     if (Matter.Query.point([bead.body], mousePosition).length > 0) {
//       foundBead = true;

//       if (!isHovering) {
//         hoverStartTime = millis(); // Start the hover timer
//         isHovering = true;
//       }

//       if (millis() - hoverStartTime >= hoverTime) {
//         // Grow the bubble when hovered
//         animateBubble(bead.infoBubble, true);
//         currentBead = bead;
//         bead.body.circleRadius = 250;
//       }
//       break;
//     }
//   }

//   if (!foundBead) {
//     if (currentBead) {
//       // Shrink the bubble when the mouse leaves
//       animateBubble(currentBead.infoBubble, false);
//     }
//     isHovering = false;
//   }
// }

// function animateBubble(bubble, grow) {
//   if (grow) {
//     bubble.style.transform = "scale(1)"; // Grow to full size

//     // Fade in the text with a slight delay
//     setTimeout(() => {
//       bubble.querySelector(".textInfoBubble").style.opacity = "1";
//     }, 200);
//   } else {
//     bubble.style.transform = "scale(0)"; // Shrink to invisible
//     bubble.querySelector(".textInfoBubble").style.opacity = "0";
//   }
// }

// function beadHover() {
//   const mousePosition = mouse.position; // Get current mouse position
//   let foundBead = false; // Flag to track if a bead is hovered
//   let beadsOnly = analBeads.beads.length - 1;
//   for (let i = 0; i < beadsOnly; i++) {
//     //     // if (!bead.inTunnel) {
// //     // Check if the mouse is over this bead
// //     if (Matter.Query.point([bead.body], mousePosition).length > 0) {
// //       // if (!mouseIsPressed) {
// //       foundBead = true;
// //       if (!isHovering) {
// //         // Start the hover timer if this is the first time we're hovering
// //         hoverStartTime = millis();
// //         isHovering = true;
// //       }
//   }
// }
// function mouseInfoBox() {
//   const mousePosition = mouse.position; // Get current mouse position
//   let foundBead = false; // Flag to track if a bead is hovered
//   let beadsOnly = analBeads.beads.length - 1;

//   for (let i = 0; i < beadsOnly; i++) {
//     let bead = analBeads.beads[i];

//     // if (!bead.inTunnel) {
//     // Check if the mouse is over this bead
//     if (Matter.Query.point([bead.body], mousePosition).length > 0) {
//       // if (!mouseIsPressed) {
//       foundBead = true;
//       if (!isHovering) {
//         // Start the hover timer if this is the first time we're hovering
//         hoverStartTime = millis();
//         isHovering = true;
//       }

//       // Check if we've hovered for the required delay time (1 second)
//       if (millis() - hoverStartTime >= hoverTime) {
//         shrinking = false; // Stop shrinking when hovering
//         currentBead = bead; // Track the current bead being hovered
//         // Animate the info box and image
//         animateInfoBox(bead.body.position.x, bead.body.position.y, true);
//       }
//       break; // Exit the loop once we've found the hovered bead
//       // }
//     }
//     // }
//   }

//   // Start shrinking if not hovering over any bead
//   if (!foundBead) {
//     shrinking = true;
//     isHovering = false; // Reset hovering state when mouse leaves the bead
//   }

//   // Animate shrinking if not hovering, using the current bead's position
//   if (shrinking && currentBead) {
//     animateInfoBox(
//       currentBead.body.position.x,
//       currentBead.body.position.y,
//       false
//     );
//   }
// }

// function animateInfoBox(x, y, grow) {
//   if (grow) {
//     // Apply easing to increase the size smoothly and slow down near the target size
//     let sizeDifference = targetSize - ellipseSize;
//     ellipseSize += sizeDifference * easeFactors.grow; // Easing effect for growth

//     // Gradually fade in the image as the ellipse grows
//     if (ellipseSize >= targetSize * 0.9) {
//       fadeAmount += (255 - fadeAmount) * easeFactors.fadeIn; // Ease in the image
//     }
//   } else {
//     // Apply easing to shrink the ellipse smoothly
//     ellipseSize += (0 - ellipseSize) * easeFactors.shrink; // Easing effect for shrinking

//     // Gradually fade out the image as the ellipse shrinks
//     fadeAmount += (0 - fadeAmount) * easeFactors.fadeOut; // Ease out the image
//   }

//   // Ensure the ellipse size and fade amount remain within valid bounds
//   ellipseSize = constrain(ellipseSize, 0, targetSize);
//   fadeAmount = constrain(fadeAmount, 0, 255);

//   // Display the ellipse and image
//   if (ellipseSize > 0) {
//     infoBox(x, y);
//   }

//   if (fadeAmount > 0) {
//     displayImage(x, y);
//   }
// }

// function infoBox(x, y) {
//   push();
//   ellipseMode(CENTER);
//   fillHsluv(0, 0, 13.2); // Your chosen color
//   ellipse(x, y, ellipseSize); // Use the growing/shrinking ellipse size
//   pop();
// }

// function displayImage(x, y) {
//   push();
//   tint(255, fadeAmount); // Apply transparency based on fadeAmount
//   imageMode(CENTER);
//   image(textIMG, x, y + 5); // Display the image at the center of the bead
//   pop();
// }

function fillHsluv(h, s, l, alpha = 255) {
  const rgb = hsluv.hsluvToRgb([h, s, l]);
  fill(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255, alpha);
}

function strokeHsluv(h, s, l) {
  const rgb = hsluv.hsluvToRgb([h, s, l]);
  stroke(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
}

function articleLink() {
  endMessage.style.opacity = "1";
  moveInfoCardX();
  moveInfoCardY();
}

// position info card in the middle of the canvas even if user resizes
function moveInfoCardX() {
  // Get the current position of the canvas in the viewport
  let canvasRect = p5jsCanvas.getBoundingClientRect();
  // let infoCard = document.querySelector("#infoCardDiv");
  // card with is 240px (220+ 40 padding)
  let endMessageWidth = 200 / 2;
  endMessage.style.left =
    canvasRect.left + canvasDimensions.x / 2 - endMessageWidth + "px"; // Center by subtracting 125 (half of 250px)
}

function moveInfoCardY() {
  let canvasRect = p5jsCanvas.getBoundingClientRect();
  // card height is 280px + 40 padd
  let endMessageHeight = 135 / 2;
  endMessage.style.top =
    canvasRect.top + canvasDimensions.y / 2 - endMessageHeight + "px"; // Center by subtracting 125 (half of 250px)
}
