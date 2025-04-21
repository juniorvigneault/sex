// matter.js components
let Engine = Matter.Engine;
let Events = Matter.Events;
let Runner = Matter.Runner;
let Bodies = Matter.Bodies;
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
let analBeads = [];
let nipples = [];
let nippleWidth = 40;
let nippleHeight = 40;
let bum;
let beads = [];
let numBeads = 6;
let cardNumberDiv;
let cloth;
let gameX = 200;
let gameY = 100;
let infoCard;
let infoCardDiv;
let cardNumber = 1;
let messageItem = 0;
let continueButton;
let ellipseRadius = 100;
let boobSize = 130;
let rightBoob;
let leftBoob;
let chain;
let flashing = false;
let wasFlashing = false;
let parts;
let blobs = [];
let isDraggingTassle0 = false;
let isDraggingTassle1 = false;
let isTassle0Stuck = false;
let isTassle1Stuck = false;
let tassle0StuckBlob = null; // ⬅️ Will be a centerNode
let tassle1StuckBlob = null;
let stickyConstraints = [];
let isDraggingTassle = false;
let flashOffCounter = 0;
let allowTassleSticking = true;
let tassleCooldownEndTime = 0;
let electrocutedNodes = [];
let electrocutionStartTime = null;
let canvas;
let electrocution = false;
let isDraggingChain = false;
let textInfoCard;
let tassleSize = 20;
let lastFlash = 0; // timestamp of when the last flash began
let flashDuration = 100; // how long each flash lasts (ms)
let flashInterval = 500; // time from one flash-start to the next (ms)
// const CATEGORY_CIRCLE_PARTICLE = 0x0002;
const CATEGORY_RECTANGLE = 0x0001;
const CATEGORY_MOUSE = 0x0002;
const CATEGORY_NIPPLE = 0x0004;
const CATEGORY_CLAMP = 0x0008; // Tassles
const CATEGORY_BLOB = 0x0010;
const CATEGORY_CHAIN = 0x0020;
let areola = {
  leftX: undefined,
  leftY: undefined,
  rightY: undefined,
  leftY: undefined,
};

const messages = [
  "Nipple clamps can cause injuries if precautions aren't taken. It’s recommended to take breaks and maintain clear communication during a BDSM scene to keep pain enjoyable.",
  "Nipple clamps are often used in BDSM dynamics to control, limit, or intensify sensations. Under strong pressure, they can trigger an endorphin release, leading to a powerful rush of pleasure.",
  "Some nipple clamps are electric and equipped with electrodes that deliver light electrical pulses, stimulating nerve endings and creating a tingling or throbbing sensation that can vary in intensity.",
  "When nipple clamps are applied, they restrict blood flow, increasing sensitivity. The nipple becomes more responsive to touch, which can heighten sensations and intensify the pleasure experienced during stimulation.",
  "Nipple clamps create sensations through applied pressure. Intensity varies depending on the type, with some being adjustable. Clamps can be made from silicone, plastic, or metal to vary the feeling and grip strength.",
];

let canvasDimensions = {
  x: 550,
  y: 800,
};
function setup() {
  // let canvas = createCanvas(1000, 1000);

  canvas = createCanvas(canvasDimensions.x, canvasDimensions.y);
  // Move the canvas within the HTML into the appropriate section
  canvas.parent("p5js-canvas");
  engine = Engine.create();
  world = engine.world;
  Runner.run(engine);
  // engine.world.gravity.scale = 0;
  let mouse = Mouse.create(document.querySelector("#p5js-canvas"));
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      // stiffness: 0.02,
    },
    collisionFilter: { category: CATEGORY_MOUSE },
  });

  World.add(world, mouseConstraint);

  //bum = new Bum(width / 2, 300, 400);

  infoCardDiv = document.querySelector("#infoCardDiv");
  infoCard = document.querySelector("#infoCard");
  cardNumberDiv = document.querySelector("#cardNumberText");

  textInfoCard = document.querySelector("#textInfoCard");
  continueButton = document.querySelector("#continueButton");
  messages.reverse();
  textInfoCard.innerHTML = messages[0];
  continueButton.onclick = () => {
    swapCard();
  };
  addEnclosures();
  let breasts = {
    x: width / 2,
    y: 200,
  };

  let spaceBetweenBoobs = 80;
  // rightBoob = addBridge(breasts.x - boobSize - spaceBetweenBoobs / 2, 220); // Add the bridge here
  // leftBoob = addBridge(breasts.x + boobSize + spaceBetweenBoobs / 2, 220); // Add the bridge here

  //chain = createChain(400, 400);
  //addBeads();
  // analBeads.push(new AnalBeads(width / 2, height / 2 - 180, 200));
  // analBeads.push(new AnalBeads(width / 2, height / 2 - 180, 200));

  // let ballConstraint = Constraint.create({
  //   bodyA: analBeads[0].beads[1].body,
  //   bodyB: analBeads[1].beads[1].body,
  //   length: 130,
  //   stiffness: 0.8,
  // });
  // World.add(world, ballConstraint);

  // Add cloth to the world
  // let halfClothLength = (clothOptions.col - 1 / 2) * clothOptions.colGap;
  // clothOptions.x = width / 2 - halfClothLength;

  //addCloth();
  //addClamps();

  // Create the first body (tassle)
  let leftTassle = Bodies.circle(200, 200, tassleSize, {
    isStatic: false,
    label: "tassle",
    collisionFilter: {
      category: CATEGORY_CLAMP,
      mask: CATEGORY_RECTANGLE | CATEGORY_MOUSE | CATEGORY_CLAMP,
    },
  });

  particles.push(leftTassle);

  // Create chain links
  let numChainLinks = 25;
  let chainLinkSize = 12;
  let startX = width / 2;
  let startY = 0;
  let spacing = chainLinkSize; // space between links

  // 🧠 Set custom position for the static middle link
  let staticMiddleLinkX = width / 2; // your custom X
  let staticMiddleLinkY = height / 2; // your custom Y

  let staticLinkIndex = Math.floor(numChainLinks / 2);

  for (let i = 0; i < numChainLinks; i++) {
    let isStatic = i === staticLinkIndex;

    let x, y;

    if (isStatic) {
      // If it's the middle static link, place it exactly where you want
      x = staticMiddleLinkX;
      y = staticMiddleLinkY;
    } else {
      // Otherwise, space normally along X
      x = startX;
      y = startY + i * spacing;
    }
    // let chainGroup = Body.nextGroup(true);

    let chainLink = Bodies.circle(x, y, chainLinkSize, {
      collisionFilter: {
        // group: chainGroup, // 👈 use the special group!
        category: CATEGORY_CHAIN,
        mask: CATEGORY_RECTANGLE | CATEGORY_MOUSE,
      },
      isStatic: isStatic,
    });

    particles.push(chainLink);
  }

  let rightTassle = Bodies.circle(200, 200, tassleSize, {
    isStatic: false,
    label: "tassle",
    collisionFilter: {
      category: CATEGORY_CLAMP,
      mask: CATEGORY_RECTANGLE | CATEGORY_MOUSE | CATEGORY_CLAMP,
    },
  });

  particles.push(rightTassle);
  // Add all particles to the world
  // World.add(world, particles);
  let chainGroup = Body.nextGroup(true);

  // Create the chain
  let cord = Composites.chain(
    Composite.create({ bodies: particles }),
    0,
    0,
    0,
    0,
    {
      stiffness: 0.5, // Adjust stiffness as needed
      length: 25, // Adjust length as needed
      collisionFilter: {
        group: chainGroup, // 👈 use the special group!
        category: CATEGORY_CHAIN,
        mask: CATEGORY_RECTANGLE | CATEGORY_MOUSE,
      },
    }
  );

  World.add(world, cord);

  createBlobs();

  Events.on(mouseConstraint, "startdrag", function (event) {
    let body = event.body;

    if (body === particles[0]) {
      console.log("dragging tassle 1");
      isDraggingTassle0 = true;
    } else if (body === particles[particles.length - 1]) {
      console.log("dragging tassle 2");
      isDraggingTassle1 = true;
    } else {
      if (particles.includes(body)) {
        console.log("dragging chain link");
        isDraggingChain = true; // 🧠 SET THIS TO TRUE!
      }
    }
  });

  Events.on(mouseConstraint, "enddrag", function (event) {
    let body = event.body;

    if (body === particles[0] && !isTassle0Stuck) {
      console.log("stopped dragging tassle 1");
      isDraggingTassle0 = false;
    } else if (body === particles[particles.length - 1] && !isTassle1Stuck) {
      console.log("stopped dragging tassle 2");
      isDraggingTassle1 = false;
    } else {
      if (particles.includes(body)) {
        console.log("stopped dragging chain link");
        isDraggingChain = false;
      }
    }
  });

  moveInfoCardX();
  moveInfoCardY();
}
function draw() {
  // background(255, 0, 0);

  // if (flashing) {
  //   background(0); // DARK when flashing
  // } else {
  displayBackground();

  // if (electrocution) {
  updateElectrocution(); // update flashing logic
  applyElectrocutionJitter();

  if (!allowTassleSticking && millis() > tassleCooldownEndTime) {
    allowTassleSticking = true;
  }

  drawStrobe((backgroundStrobe = true));
  // }
  // }
  // if (!flashing) {
  //   // Only flash a black rectangle every second time
  //   if (flashOffCounter % 2 === 1) {
  //     push();
  //     fill(0);
  //     blendMode(MULTIPLY);

  //     noStroke();
  //     rect(0, 0, width, height);
  //     pop();
  //   }
  // }
  // if the beads go low enough, change the collision filter so
  // they don't collide with the the tunnel enclosure
  // this is in place to make the beads stay
  // for (let bead of analBeads.beads) {
  //   console.log(bead);
  //   if (bead.body.position.y >= 600) {
  //     bead.body.collisionFilter.mask =
  //       CATEGORY_BRIDGE | CATEGORY_CIRCLE_PARTICLE;
  //   }
  // }
  // push();
  // strokeWeight(30);
  // stroke(100, 100, 200);
  // fill(0, 200, 0);
  // ellipse(width / 2, 210, 200);
  // pop();
  //bum.display();
  for (let enclosure of enclosures) {
    enclosure.display({ r: 200, g: 200, b: 200, a: 100 });
  }
  // push();
  // ellipseMode(CENTER);
  // ellipse();
  // pop();
  // drawBridge(rightBoob, boobSize, true);
  // drawBridge(leftBoob, boobSize, true);
  let anyBlobElectrocuted = electrocutedNodes.length > 0;

  // Then in your loop
  for (let blob of blobs) {
    blob.draw();

    // blob.draw(true, true);
    blob.neutralizeGravity();

    if (!anyBlobElectrocuted) {
      blob.move();
    }
  }
  // chain ellipses
  for (let i = 0; i < particles.length; i++) {
    ellipseMode(CENTER);
    fill(140, 19, 19);
    // stroke(140, 19, 19);

    ellipse(
      particles[i].position.x,
      particles[i].position.y,
      particles[i].circleRadius * 2
    );
    if (i > 0) {
      push();
      stroke(140, 19, 19);
      strokeWeight(13); // Adjust the stroke weight as needed
      line(
        particles[i - 1].position.x,
        particles[i - 1].position.y,
        particles[i].position.x,
        particles[i].position.y
      );
      pop();
    }
  }
  // Handle tassle 0
  if (
    (isDraggingTassle0 ||
      (isDraggingChain &&
        mouseConstraint.body &&
        particles.indexOf(mouseConstraint.body) <
          Math.floor(particles.length / 2))) &&
    allowTassleSticking
  ) {
    tryStickTassle(
      particles[0],
      blobs,
      (value) => (isTassle0Stuck = value),
      (blob) => (tassle0StuckBlob = blob)
    );
  }

  if (isTassle0Stuck) {
    snapTassleToBlob(
      particles[0],
      tassle0StuckBlob,
      (value) => (isTassle0Stuck = value)
    );
  }

  // Handle tassle 1
  if (
    (isDraggingTassle1 ||
      (isDraggingChain &&
        mouseConstraint.body &&
        particles.indexOf(mouseConstraint.body) >
          Math.floor(particles.length / 2))) &&
    allowTassleSticking
  ) {
    tryStickTassle(
      particles[particles.length - 1],
      blobs,
      (value) => (isTassle1Stuck = value),
      (blob) => (tassle1StuckBlob = blob)
    );
  }

  if (isTassle1Stuck) {
    snapTassleToBlob(
      particles[particles.length - 1],
      tassle1StuckBlob,
      (value) => (isTassle1Stuck = value)
    );
  }

  // draw strobe on top
  // if (flashing) {
  //   push();
  //   blendMode(SCREEN);
  //   fill(0);
  //   noStroke();
  //   rect(0, 0, width, height);
  //   pop();
  // }

  // if (isTassle0Stuck && isTassle1Stuck) {
  //   electrocution = true;
  // } else {
  //   electrocution = false;
  // }
  // strobe(100, 500); // flash for 100ms every 600ms

  drawStrobe((backgroundStrobe = false));
}

window.addEventListener("resize", () => {
  moveInfoCardX();
  moveInfoCardY();
});
function swapCard() {
  World.add(world, mouseConstraint);

  messageItem++;
  // ejaculationLevel = 0;
  infoCardDiv.classList.remove("visible");
  infoCard.classList.remove("opacity"); // Add the opacity transition class
  cardNumber++;
  cardNumberDiv.innerHTML = cardNumber;
  hasShownInfoCard = false;
  allowInfoCardReveal = false; // prevent immediate re-show

  // enclosures.forEach((enclosure) => removeFromWorld(enclosure.body));
  mouseConstraint.constraint.stiffness = 0.004;

  setTimeout(() => {
    textInfoCard.innerHTML = messages[messageItem];
    // addEnclosures();
    buttonClickable = true;

    // ✅ Re-enable reveal *after* fade is done and particles can build back up
    allowInfoCardReveal = true;
  }, 1000); // Match the CSS transition duration
}

function updateElectrocution() {
  if (isTassle0Stuck && isTassle1Stuck) {
    if (!electrocution) {
      electrocution = true;
      flashing = true;
      electrocutionStartTime = millis();
      electrocutedNodes = [tassle0StuckBlob, tassle1StuckBlob];

      // 🧠 NEW: Save the original position for each electrocuted node
      electrocutedNodes.forEach((node) => {
        if (node && node.body) {
          node.originalPosition = {
            x: node.body.position.x,
            y: node.body.position.y,
          };
        }
      });
    }
  } else {
    electrocution = false;
    flashing = false;
    wasFlashing = false;
    electrocutionStartTime = null;
    electrocutedNodes = [];
    return;
  }

  let now = millis();
  let cycle = 75 + 350;
  let positionInCycle = now % cycle;

  // flashing = positionInCycle < 100;

  if (!flashing && wasFlashing) {
    flashOffCounter++;
  }

  wasFlashing = flashing;

  // 👇 After 3 seconds of electrocution
  if (
    electrocution &&
    electrocutionStartTime &&
    now - electrocutionStartTime > 2000
  ) {
    destroyElectrocutedBlobs();
    electrocution = false;
    flashing = false;
    wasFlashing = false;
    electrocutionStartTime = null;
  }
}

function endGame() {}

function destroyElectrocutedBlobs() {
  electrocutedNodes.forEach((stuckNode) => {
    if (!stuckNode) return;

    let bodyToRemove = stuckNode.body;
    let blobIndex = blobs.findIndex((blob) =>
      blob.nodes.some((node) => node.body === bodyToRemove)
    );

    if (blobIndex !== -1) {
      blobs[blobIndex].nodes.forEach((node) => {
        World.remove(world, node.body);
      });
      blobs.splice(blobIndex, 1);
    }
  });

  electrocutedNodes = [];

  // 🧠 Cooldown: prevent sticking immediately
  allowTassleSticking = false;
  tassleCooldownEndTime = millis() + 1000; // 1 second no-stick

  // 🧠 Also unstick the tassles:
  isTassle0Stuck = false;
  isTassle1Stuck = false;
  tassle0StuckBlob = null;
  tassle1StuckBlob = null;

  // 🧠 Also reset dragging:
  isDraggingTassle0 = false;
  isDraggingTassle1 = false;

  if (mouseConstraint.body) {
    mouseConstraint.body = null;
  }

  cardAppear();
}

// position info card in the middle of the canvas even if user resizes
function moveInfoCardX() {
  // Get the current position of the canvas in the viewport
  let canvasRect = canvas.elt.getBoundingClientRect();
  // let infoCard = document.querySelector("#infoCardDiv");
  // card with is 220px (220+ 40 padding)
  let infoCardWidth = 260 / 2;
  let left = canvasRect.left + canvasDimensions.x / 2 - infoCardWidth + "px"; // Center by subtracting 125 (half of 250px)
  // console.log(infoCardDivOutline.style);
  // infoCardDivOutline.style.left = left;
  infoCardDiv.style.left = left;
}

function moveInfoCardY() {
  let canvasRect = canvas.elt.getBoundingClientRect();
  // card height is 220px + 40 padd
  infoCardHalfHeight = 320 / 2;
  let top = canvasRect.top + canvasDimensions.y / 2 - infoCardHalfHeight; // Center by subtracting 125 (half of 250px)

  infoCardDiv.style.top = top - 1 + "px";
  // infoCardDivOutline.style.top = top - 20 + "px";
}

function cardAppear() {
  World.remove(world, mouseConstraint);

  infoCardDiv.classList.add("visible");
  setTimeout(() => {
    infoCard.classList.add("opacity"); // Add the opacity transition class
  }, 200); // Delay in milliseconds
  mouseConstraint.constraint.stiffness = 0;

  hasShownInfoCard = true;
}

function createBlobs() {
  const blobPositions = [
    { x: 120, y: 120 },
    { x: 310, y: 100 },
    { x: 120, y: 300 },
    { x: 450, y: 215 },
    { x: 305, y: 320 },
    { x: 460, y: 410 },
    { x: 100, y: 480 },
    { x: 300, y: 500 },
    { x: 150, y: 660 },
    { x: 430, y: 640 },
  ];

  const commonSettings = {
    radius: 80,
    steps: 20,
    nodeSize: 12,
  };

  for (let pos of blobPositions) {
    let blob = new Blob({
      x: pos.x,
      y: pos.y,
      radius: commonSettings.radius,
      steps: commonSettings.steps,
      nodeSize: commonSettings.nodeSize,
    });

    blob.init(world);
    blobs.push(blob);
  }
}

function drawStrobe(backgroundStrobe) {
  if (flashing) {
    if (backgroundStrobe) {
      const strobeCycleDuration = 200; // total duration of one strobe cycle (ms)
      const strobeOnDuration = 50; // how long the black flash is ON (ms)
      let now = millis();
      let positionInCycle = now % strobeCycleDuration;
      if (positionInCycle < strobeOnDuration) {
        push();
        fill(255);
        noStroke();
        rect(0, 0, width, height);
        pop();
      }
    } else {
      const strobeCycleDuration = 400; // total duration of one strobe cycle (ms)
      const strobeOnDuration = 50; // how long the black flash is ON (ms)
      let now = millis();
      let positionInCycle = now % strobeCycleDuration;
      if (positionInCycle < strobeOnDuration) {
        push();
        fill(0);
        noStroke();
        rect(0, 0, width, height);
        pop();
      }
    }
  }
}

function applyElectrocutionJitter() {
  if (!electrocution) return;

  electrocutedNodes.forEach((stuckNode) => {
    if (stuckNode && stuckNode.originalPosition) {
      let baseX = stuckNode.originalPosition.x;
      let baseY = stuckNode.originalPosition.y;

      let jitterX = random(-10, 10); // Small local jitter
      let jitterY = random(-10, 10);

      Matter.Body.setPosition(stuckNode.body, {
        x: baseX + jitterX,
        y: baseY + jitterY,
      });
    }
  });
}

function createRandomBlobs(n = 10) {
  for (let i = 0; i < n; i++) {
    let radius = random(60, 130); // size of blob
    let steps = floor(random(12, 24)); // number of nodes

    // Padding to prevent them from spawning half off-canvas
    let padding = radius + 20;

    let x = random(padding, canvasDimensions.x - padding);
    let y = random(padding, canvasDimensions.y - padding);

    let blob = new Blob(x, y, radius, steps);
    blob.init(world);
    blobs.push(blob);
  }
}

function setAllBlobsDynamic() {
  blobs.forEach((blob) => {
    blob.nodes.forEach((node) => {
      Matter.Body.setStatic(node.body, false);
    });
  });
}

function tryStickTassle(particle, blobs, isStuckSetter, setBlob) {
  for (let blob of blobs) {
    let centerNode = blob.nodes[blob.randomNippleNode];
    let center = centerNode.body.position;

    let distance = dist(
      particle.position.x,
      particle.position.y,
      center.x,
      center.y
    );

    if (distance <= 25) {
      Body.setPosition(particle, { x: center.x, y: center.y });
      Body.setVelocity(particle, { x: 0, y: 0 });

      isStuckSetter(true); // 🧠 Mark as stuck
      setBlob(centerNode); // 🧠 Store which node it stuck to
      return;
    }
  }
}

function snapTassleToBlob(particle, stuckBlob, isStuckSetter) {
  if (!stuckBlob) return; // no blob assigned

  let center = stuckBlob.body.position;

  let distance = dist(
    particle.position.x,
    particle.position.y,
    center.x,
    center.y
  );

  if (distance <= 50) {
    // Close enough: keep snapping
    Body.setPosition(particle, { x: center.x, y: center.y });
    Body.setVelocity(particle, { x: 0, y: 0 });
  } else {
    // Far enough: unstick
    isStuckSetter(false);
  }
}

function addEnclosures() {
  let bottomEnclosure = new RectangleParticle(
    width / 2,
    height + 25,
    width,
    50,
    true,
    world
  );
  let leftEnclosure = new RectangleParticle(
    -25,
    height / 2,
    50,
    height,
    true,
    world
  );
  let rightEnclosure = new RectangleParticle(
    width + 25,
    height / 2,
    50,
    height,
    true,
    world
  );

  let topEnclosure = new RectangleParticle(
    width / 2,
    -25,
    width,
    50,
    true,
    world
  );
  enclosures.push(bottomEnclosure, topEnclosure, rightEnclosure, leftEnclosure);
}

function displayBackground() {
  push();
  fill(219, 255, 61);
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

function fillHsluv(h, s, l, sketch) {
  const rgb = hsluv.hsluvToRgb([h, s, l]);
  sketch.fill(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
}

function strokeHsluv(h, s, l, sketch) {
  const rgb = hsluv.hsluvToRgb([h, s, l]);
  sketch.stroke(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
}
