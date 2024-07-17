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
let beads = [];
let numBeads = 6;

let sounds = {
  slap: undefined,
  pull: undefined,
  pop: undefined,
};

let gameX = 0;
let gameY = -50;

const CATEGORY_BRIDGE = 0x0001;
const CATEGORY_CIRCLE_PARTICLE = 0x0002;
const CATEGORY_RECTANGLE = 0x0004;
const CATEGORY_MOUSE = 0x0008;

function preload() {
  sounds.pop = loadSound("assets/sounds/pop2.wav");
  sounds.slap = loadSound("assets/sounds/slap.mp3");
  sounds.pull = loadSound("assets/sounds/pull.wav");
}

function setup() {
  // let canvas = createCanvas(1000, 1000);

  let canvas = createCanvas(550, 800);
  // Move the canvas within the HTML into the appropriate section
  canvas.parent("p5js-canvas");
  engine = Engine.create();
  world = engine.world;
  Runner.run(engine);
  engine.world.gravity.scale = 0.005;

  let mouse = Mouse.create(document.querySelector("#p5js-canvas")),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      collisionFilter: { category: CATEGORY_MOUSE },
      constraint: {
        stiffness: 0.08,
      },
    });

  World.add(world, mouseConstraint);

  sounds.pop.setVolume(1);
  sounds.slap.setVolume(0.5);

  //bum = new Bum(width / 2, 300, 400);

  addEnclosures();
  addBridge(); // Add the bridge here
  //addBeads();
  analBeads = new AnalBeads(gameX + 400, gameY - 700, 120);
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
        x: -30000,
        y: -60000,
      });
      sounds.slap.play();
    }
  });
}

function draw() {
  // background(0);
  displayBackground();
  // console.log("Velocity:", bridge.bodies[0].velocity);
  // if the beads go low enough, change the collision filter so
  // they don't collide with the the tunnel enclosure
  // this is in place to make the beads stay
  push();
  stroke(255);
  pop();
  for (let bead of analBeads.beads) {
    if (bead.body.position.y >= 600) {
      bead.body.collisionFilter.mask =
        CATEGORY_BRIDGE | CATEGORY_CIRCLE_PARTICLE | CATEGORY_MOUSE;
    }
    // console.log(bead.popped);
    if (bead.body.position.y >= 250) {
      if (!bead.popped) {
        sounds.pop.play();
        bead.popped = true;
      }
    }
  }

  analBeads.display();
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

  push();
  // strokeWeight(1);
  // strokeHsluv(0, 0, 13.2);
  noStroke();
  ellipseMode(CENTER);
  fillHsluv(126.6, 62.2, 66.8);
  ellipse(rightCheek.position.x, rightCheek.position.y, 400);
  // beginClip();
  // // strokeWeight(0.4);
  // // strokeHsluv(0, 0, 13.2);
  // ellipseMode(CENTER);
  // fillHsluv(126.6, 62.2, 66.8);
  // ellipse(leftCheek.position.x, leftCheek.position.y, 400);
  // endClip();

  pop();
  // strokeWeight(0.4);
  // strokeHsluv(0, 0, 13.2);
  ellipseMode(CENTER);
  fillHsluv(126.6, 62.2, 66.8);
  ellipse(leftCheek.position.x, leftCheek.position.y, 400);
  noStroke();
  ellipseMode(CENTER);
  fillHsluv(126.6, 62.2, 66.8);
  ellipse(rightCheek.position.x, rightCheek.position.y, 400);
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
    gameX - 35,
    gameY + 300,
    500,
    1000,
    true,
    world
  );
  let tunnelEnclosureRight = new RectangleParticle(
    gameX + 585,
    gameY + 300,
    500,
    1000,
    true,
    world
  );

  enclosures.push(tunnelEnclosureRight);
  enclosures.push(tunnelEnclosureLeft);
}

function mousePressed() {}
function addBeads() {
  // Create a composite to hold the beads and constraints
  let beadComposite = Composite.create();
  let x = 0;
  let beadSize = 50;
  let spaceBetweenBeads = 40;
  // Create beads
  for (let i = 0; i < numBeads; i++) {
    let bead = new CircleParticle(
      x + i * beadSize + spaceBetweenBeads,
      100,
      beadSize,
      false,
      beadComposite
    );
    beads.push(bead);
  }

  // Add constraints (links) between the beads
  for (let i = 0; i < beads.length - 1; i++) {
    let options = {
      bodyA: beads[i].body,
      bodyB: beads[i + 1].body,
      length: 60, // Distance between centers of beads
      stiffness: 0.038,
    };
    let constraint = Constraint.create(options);
    Composite.add(beadComposite, constraint);
  }

  // Add the bead composite to the world
  Composite.add(world, beadComposite);
}

function displayBackground() {
  push();
  rectMode(CORNER);
  noStroke();
  fillHsluv(230, 72.9, 78.2);
  rect(0, 0, width, height);
  pop();
}

function addBridge() {
  let group = Body.nextGroup(true);

  bridge = Composites.stack(0, 0, 2, 1, 200, 0, function (x, y) {
    return Bodies.circle(x, y, 200, {
      collisionFilter: {
        group: group,
        category: CATEGORY_BRIDGE,
        mask: CATEGORY_CIRCLE_PARTICLE,
      }, // Collide only with circle particle

      chamfer: 0,
      density: 0.7,
      // frictionAir: 0.1,
      torque: 1,
      resititution: 1,
      friction: 0,
    });
  });

  Composites.chain(bridge, 0.1, 0, 0, 0, {
    stiffness: 0.05,
    length: 10,
  });

  Composite.add(world, [
    bridge,
    Constraint.create({
      pointA: { x: gameX + 25, y: gameY + 100 },
      bodyB: bridge.bodies[0],
      pointB: { x: -80, y: 0 },
      length: 0,
      stiffness: 0,
    }),
    Constraint.create({
      pointA: { x: gameX + 525, y: gameY + 100 },
      bodyB: bridge.bodies[bridge.bodies.length - 1],
      pointB: { x: 80, y: 0 },
      length: 0,
      stiffness: 0,
    }),
  ]);
}

function fillHsluv(h, s, l) {
  const rgb = hsluv.hsluvToRgb([h, s, l]);
  fill(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
}

function strokeHsluv(h, s, l) {
  const rgb = hsluv.hsluvToRgb([h, s, l]);
  stroke(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
}
