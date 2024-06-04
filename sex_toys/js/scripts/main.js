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
let analBeads;
let bum;
let beads = [];
let numBeads = 6;

let gameX = 0;
let gameY = -50;

const CATEGORY_BRIDGE = 0x0001;
const CATEGORY_CIRCLE_PARTICLE = 0x0002;
const CATEGORY_RECTANGLE = 0x0004;

function setup() {
  // let canvas = createCanvas(1000, 1000);

  let canvas = createCanvas(550, 800);
  // Move the canvas within the HTML into the appropriate section
  canvas.parent("p5js-canvas");
  engine = Engine.create();
  world = engine.world;
  Runner.run(engine);
  engine.world.gravity.scale = 0.001;

  let mouse = Mouse.create(document.querySelector("#p5js-canvas")),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.08,
      },
    });

  World.add(world, mouseConstraint);

  //bum = new Bum(width / 2, 300, 400);

  addEnclosures();
  addBridge(); // Add the bridge here
  //addBeads();
  analBeads = new AnalBeads(gameX + 400, gameY - 400, 120);
}

function draw() {
  background(0);

  // if the beads go low enough, change the collision filter so
  // they don't collide with the the tunnel enclosure
  // this is in place to make the beads stay
  for (let bead of analBeads.beads) {
    console.log(bead);
    if (bead.body.position.y >= 600) {
      bead.body.collisionFilter.mask =
        CATEGORY_BRIDGE | CATEGORY_CIRCLE_PARTICLE;
    }
  }

  analBeads.display();
  //bum.display();
  for (let enclosure of enclosures) {
    enclosure.display({ r: 200, g: 200, b: 200, a: 20 });
  }
  // push();
  // ellipseMode(CENTER);
  // ellipse();
  // pop();

  for (let body of bridge.bodies) {
    push();
    noStroke();
    ellipseMode(CENTER);
    fill(100);
    ellipse(body.position.x, body.position.y, 400);
    pop();
  }
}

function mousePressed() {}

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

function addBridge() {
  let group = Body.nextGroup(true);

  bridge = Composites.stack(0, 0, 2, 1, 200, 0, function (x, y) {
    return Bodies.circle(x, y, 200, {
      collisionFilter: {
        group: group,
        category: CATEGORY_BRIDGE,
        mask: CATEGORY_CIRCLE_PARTICLE, // Collide only with circle particle
      },
      chamfer: 0,
      density: 1,
      frictionAir: 0,
      torque: 0,
      resititution: 0,
      friction: 0,
    });
  });

  Composites.chain(bridge, 0.1, 0, 0, 0, {
    stiffness: 0.038,
    length: 0.001,
  });

  Composite.add(world, [
    bridge,
    Constraint.create({
      pointA: { x: gameX + 25, y: gameY + 100 },
      bodyB: bridge.bodies[0],
      pointB: { x: -80, y: 0 },
      length: 1,
      stiffness: 1,
    }),
    Constraint.create({
      pointA: { x: gameX + 525, y: gameY + 100 },
      bodyB: bridge.bodies[bridge.bodies.length - 1],
      pointB: { x: 80, y: 0 },
      length: 1,
      stiffness: 1,
    }),
  ]);
}
