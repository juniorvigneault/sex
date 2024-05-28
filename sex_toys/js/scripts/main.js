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

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
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
        stiffness: 0.2,
      },
    });

  World.add(world, mouseConstraint);

  analBeads = new AnalBeads(300, 0, 120);

  //bum = new Bum(width / 2, 300, 400);

  addEnclosures();
  addBridge(); // Add the bridge here
}

function draw() {
  background(255);

  // for (let particle of particles) {
  //   particle.display({ r: 0, g: 200, b: 0 });
  // }

  analBeads.display();
  //bum.display();
  enclosures[0].display({ r: 200, g: 200, b: 200 });
  // push();
  // ellipseMode(CENTER);
  // ellipse();
  // pop();

  for (let body of bridge.bodies) {
    push();
    fill(6, 10, 25);
    noStroke();
    ellipseMode(CENTER);
    fill(0);
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
}

function addBridge() {
  let group = Body.nextGroup(true);

  bridge = Composites.stack(0, 0, 2, 1, 200, 0, function (x, y) {
    return Bodies.circle(x, y, 200, {
      collisionFilter: { group: group },
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
      pointA: { x: 150, y: 300 },
      bodyB: bridge.bodies[0],
      pointB: { x: -80, y: 0 },
      length: 1,
      stiffness: 1,
    }),
    Constraint.create({
      pointA: { x: 650, y: 300 },
      bodyB: bridge.bodies[bridge.bodies.length - 1],
      pointB: { x: 80, y: 0 },
      length: 1,
      stiffness: 1,
    }),
  ]);
}
