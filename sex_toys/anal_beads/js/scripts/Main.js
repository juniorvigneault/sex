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
let canvas;
let endGame = false;
let continueButton;
let mouseConstraint;
let hasRestarted = false;
let restartScheduled = false;
let infoCard, infoCardText;
let particles = [];
let enclosures = [];
let analBeads;
let lastSwayTime = 0;
let swayInterval = 5000; // apply sway every 1.5 seconds
let swayAngle = 0; // phase of the swing
let swaySpeed = 0.02; // how fast it swings (lower = slower)
let swayForceAmplitude = 1; // how strong the sideways force is
let waitingForClick = true;
let bum;
let mouse;
let cardNumber = 1;
let beads = [];
let numBeads = 6;
let showInfoBox = false;
let textIMG;
let mouseIsPressed = false;
let toyIsGone = false;
let p5jsCanvas;
let showCard = false;

let messageItem = 7;
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
let hasShownInfoCard = false;
let allowInfoCardReveal = true;
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
let canvasSize = {
  x: 550,
  y: 800,
};

const CATEGORY_BRIDGE = 0x0001;
const CATEGORY_CIRCLE_PARTICLE = 0x0002;
const CATEGORY_RECTANGLE = 0x0004;
const CATEGORY_MOUSE = 0x0008;
let endMessage;

function setup() {
  // let canvas = createCanvas(1000, 1000);
  // DESKTOP CANVAS
  canvas = createCanvas(canvasSize.x, canvasSize.y);
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
  endMessage = document.querySelector("#end-message");
  infoCard = document.querySelector("#infoCardDiv");
  infoCardText = document.querySelector("#infoCard");
  continueButton = document.querySelector("#continueButton");
  infoCardText.innerHTML = messages[messageItem];

  continueButton.onclick = () => {
    swapCard();
  };

  nextGameContainer = document.querySelector("#nextGameContainer");
  (mouse = Mouse.create(document.querySelector("#p5js-canvas"))),
    (mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      collisionFilter: { category: CATEGORY_MOUSE },
      constraint: {
        stiffness: 0.08,
      },
    }));

  World.add(world, mouseConstraint);
  lastMousePressedTime = millis(); // Initialize it when game starts
  centerEndMessage();
  positionNextGameContainer();
  // getAudioContext().resume(); // Resume the audio context

  //bum = new Bum(width / 2, 300, 400);
  moveInfoCardX();
  moveInfoCardY();
  addEnclosures();
  addBridge(); // Add the bridge here
  //addBeads();
  analBeads = new AnalBeads(gameX + canvasSize.x / 2, gameY - 2150, 115);
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

  nextGameContainer.addEventListener("click", () => {
    window.location.href = "/penis/index.html"; // <-- replace with your file
  });
  // createInfoCard();

  // console.log(mouseConstraint);
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

  if (endGame) {
    restartGame();
    endgame = false;
  }

  analBeads.beads[10].inTunnel = false;
  analBeads.beads[10].body.collisionFilter.mask =
    CATEGORY_BRIDGE | CATEGORY_CIRCLE_PARTICLE | CATEGORY_MOUSE;

  for (let bead of analBeads.beads) {
    let gravity = engine.world.gravity;

    if (bead.body.position.y <= 249) {
      // 🧠 Cancel gravity manually by applying an opposite force
      let antiGravityForce = {
        x: 0,
        y: -(bead.body.mass * gravity.y * gravity.scale),
      };
      Body.applyForce(bead.body, bead.body.position, antiGravityForce);
    }

    if (bead.body.position.y >= 500) {
      bead.inTunnel = false;
      bead.body.collisionFilter.mask =
        CATEGORY_BRIDGE | CATEGORY_CIRCLE_PARTICLE | CATEGORY_MOUSE;
    }

    if (bead.body.position.y >= 250) {
      if (!bead.popped) {
        soundMobile.playSound("pop");
        bead.popped = true;
        // bead.showCard = true;

        // open cards when bead is popped except the very last one
        if (messageItem !== -1) {
          infoCard.classList.add("visible");
          setTimeout(() => {
            infoCardText.classList.add("opacity"); // Add the opacity transition class
          }, 200); // Delay in milliseconds
          infoCardDiv.style.display = "flex";

          hasShownInfoCard = true;
        }
      }
    }
  }

  analBeads.display();

  for (let enclosure of enclosures) {
    enclosure.display({ r: 200, g: 200, b: 200, a: 0 });
  }

  let rightCheek = bridge.bodies[0];
  let leftCheek = bridge.bodies[1];

  let buttCheekSize = rightCheek.circleRadius * 2;

  ellipseMode(CENTER);
  // fill(255, 115, 191);

  fillHsluv(339.1, 100, 67.5);
  // fill(255, 255, 255);
  ellipse(leftCheek.position.x, leftCheek.position.y, buttCheekSize);
  noStroke();
  ellipseMode(CENTER);
  // fillHsluv(16.4, 98.4, 42.5);
  ellipse(rightCheek.position.x, rightCheek.position.y, buttCheekSize);

  if (analBeads.beads[0].body.position.y > height + 200) {
    toyIsGone = true;
  }

  // restart game if toy is gone at the end
  if (toyIsGone && !restartScheduled && !hasShownInfoCard) {
    restartScheduled = true;
    setTimeout(() => {
      restartGame();
    }, 1500);
  }

  // restart game if no clicks for 30 seconds and no card is open
  if (millis() - lastMousePressedTime > 30000 && !hasShownInfoCard) {
    restartGame();
  }

  swayHandle();
}

function swapCard() {
  // World.add(world, mouseConstraint);
  messageItem--;
  // ejaculationLevel = 0;
  infoCard.classList.remove("visible");
  infoCardText.classList.remove("opacity"); // Add the opacity transition class
  cardNumber++;
  let cardNumberDiv = document.querySelector("#cardNumberText");
  cardNumberDiv.innerHTML = cardNumber;
  hasShownInfoCard = false;
  allowInfoCardReveal = false; // prevent immediate re-show
  // enclosures.forEach((enclosure) => removeFromWorld(enclosure.body));
  // mouseConstraint.constraint.stiffness = 0.004;
  setTimeout(() => {
    infoCardText.innerHTML = messages[messageItem];
    //   addEnclosures();
    // buttonClickable = true;
    //   // ✅ Re-enable reveal *after* fade is done and particles can build back up
    allowInfoCardReveal = true;
  }, 1000); // Match the CSS transition duration
}

function swayHandle() {
  if (analBeads.beads[10]) {
    let bead = analBeads.beads[10];

    swayAngle += swaySpeed; // Update the swing over time

    let swayForce = {
      x: Math.sin(swayAngle) * swayForceAmplitude,
      y: 0,
    };

    Body.applyForce(bead.body, bead.body.position, swayForce);
  }
}

function restartGame() {
  console.log("Restarting game...");

  // 🧹 Reset everything
  if (analBeads) {
    for (let bead of analBeads.beads) {
      World.remove(world, bead.body);
    }
  }

  analBeads = new AnalBeads(gameX + canvasSize.x / 2, gameY - 2150, 115);
  let lastBead = analBeads.beads.length - 1;
  analBeads.beads[lastBead].popped = true;

  World.remove(world, mouseConstraint);
  let mouse = Mouse.create(document.querySelector("#p5js-canvas"));
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: { stiffness: 0.08 },
    collisionFilter: { category: CATEGORY_MOUSE },
  });
  World.add(world, mouseConstraint);

  // Reset states
  toyIsGone = false; // 🔥 RESET
  restartScheduled = false; // 🔥 RESET

  endMessage.style.opacity = 1;
  lastMousePressedTime = millis();

  console.log("Restarting game...");

  messageItem = 7;
  infoCardText.innerHTML = messages[messageItem];

  cardNumber = 1;
  hasShownInfoCard = false;
  allowInfoCardReveal = true;

  // Make sure the "Touch to start" is visible again
  endMessage.style.opacity = 1;

  // Restart waiting for click
  waitingForClick = true;
  startGame = false;
  endGame = false;

  let cardNumberDiv = document.querySelector("#cardNumberText");
  cardNumberDiv.innerHTML = "1";
}

function positionNextGameContainer() {
  nextGameContainer.style.left = window.innerWidth / 2 + 97 + "px";
  nextGameContainer.style.top = window.innerHeight / 2 - 390 + "px";
}

function mousePressed() {
  if (waitingForClick) {
    waitingForClick = false;
    startGame = true;
    endMessage.style.opacity = 0; // ⬅️ FADE OUT MANUALLY LIKE CLAMPS
  }
  lastMousePressedTime = millis();
}

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
    4000,
    true,
    world
  );
  let tunnelEnclosureRight = new RectangleParticle(
    gameX + 580,
    gameY + 300,
    500,
    4000,
    true,
    world
  );

  enclosures.push(tunnelEnclosureRight);
  enclosures.push(tunnelEnclosureLeft);
}

function displayBackground() {
  push();
  noStroke();
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

function centerEndMessage() {
  let endMessageWidth = endMessage.offsetWidth / 2;
  let endMessageHeight = endMessage.offsetHeight / 2;

  endMessage.style.left = window.innerWidth / 2 - endMessageWidth + "px";
  endMessage.style.top = window.innerHeight / 2 - endMessageHeight + 265 + "px";
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

// position info card in the middle of the canvas even if user resizes
function moveInfoCardX() {
  // Get the current position of the canvas in the viewport
  let canvasRect = canvas.elt.getBoundingClientRect();
  // let infoCard = document.querySelector("#infoCardDiv");
  // card with is 220px (220+ 40 padding)
  let infoCardWidth = 260 / 2;
  let left = canvasRect.left + canvasSize.x / 2 - infoCardWidth + "px"; // Center by subtracting 125 (half of 250px)
  // console.log(infoCardDivOutline.style);
  // infoCardDivOutline.style.left = left;
  infoCard.style.left = left;
}

function moveInfoCardY() {
  let canvasRect = canvas.elt.getBoundingClientRect();
  // card height is 220px + 40 padd
  infoCardHalfHeight = 320 / 2;
  let top = canvasRect.top + canvasSize.y / 2 - infoCardHalfHeight; // Center by subtracting 125 (half of 250px)

  infoCard.style.top = top - 1 + "px";
  // infoCardDivOutline.style.top = top - 20 + "px";
}

function fillHsluv(h, s, l, alpha = 255) {
  const rgb = hsluv.hsluvToRgb([h, s, l]);
  fill(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255, alpha);
}

function strokeHsluv(h, s, l) {
  const rgb = hsluv.hsluvToRgb([h, s, l]);
  stroke(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
}

window.addEventListener("resize", () => {
  centerEndMessage();
  positionNextGameContainer();
  moveInfoCardX();
  moveInfoCardY();
});
// position info card in the middle of the canvas even if user resizes
