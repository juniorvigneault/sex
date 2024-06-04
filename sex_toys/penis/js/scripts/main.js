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
let bum;
let beads = [];
let numBeads = 6;
let cloth;
let gameX = 200;
let gameY = 100;
let ellipseRadius = 200;
const CATEGORY_BRIDGE = 0x0001;
const CATEGORY_CIRCLE_PARTICLE = 0x0002;
const CATEGORY_RECTANGLE = 0x0004;
const CATEGORY_MOUSE = 0x0008;

function setup() {
  // let canvas = createCanvas(1000, 1000);

  let canvas = createCanvas(1000, 800);
  // Move the canvas within the HTML into the appropriate section
  canvas.parent("p5js-canvas");
  engine = Engine.create();
  world = engine.world;
  Runner.run(engine);
  engine.world.gravity.scale = 0.012;
  let mouse = Mouse.create(document.querySelector("#p5js-canvas")),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.03,
      },
      collisionFilter: { category: CATEGORY_MOUSE },
    });
  console.log(mouse);

  World.add(world, mouseConstraint);

  //bum = new Bum(width / 2, 300, 400);

  // addEnclosures();
  addBridge(); // Add the bridge here
  //addBeads();
  analBeads.push(new AnalBeads(width / 2, height / 2 - 180, 200));
  analBeads.push(new AnalBeads(width / 2, height / 2 - 180, 200));

  let ballConstraint = Constraint.create({
    bodyA: analBeads[0].beads[1].body,
    bodyB: analBeads[1].beads[1].body,
    length: 130,
    stiffness: 0.8,
  });
  World.add(world, ballConstraint);

  // Add cloth to the world
  addCloth();
}

function draw() {
  background(0);

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
  for (let nuts of analBeads) {
    nuts.display();
  }

  push();
  strokeWeight(30);
  stroke(100, 100, 200);
  fill(0, 200, 0);
  ellipse(width / 2, 210, 200);
  pop();
  //bum.display();
  // for (let enclosure of enclosures) {
  //   enclosure.display({ r: 200, g: 200, b: 200, a: 20 });
  // }
  // push();
  // ellipseMode(CENTER);
  // ellipse();
  // pop();

  for (let body of bridge.bodies) {
    push();
    noStroke();
    ellipseMode(CENTER);
    fill(0, 200, 0);
    ellipse(body.position.x, body.position.y, body.circleRadius * 2);
    pop();
  }

  renderCloth(cloth);
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
      stiffness: 0.039,
    };
    let constraint = Constraint.create(options);
    Composite.add(beadComposite, constraint);
  }

  // Add the bead composite to the world
  Composite.add(world, beadComposite);
}

function addCloth() {
  cloth = createCloth(200, 100, 20, 14, 20, 10, false, 10);

  // Make the first row of particles static to anchor the cloth
  for (let i = 0; i < 20; i++) {
    cloth.bodies[i].isStatic = true;
  }

  Composite.add(world, cloth);
}

function createCloth(
  xx,
  yy,
  columns,
  rows,
  columnGap,
  rowGap,
  crossBrace,
  particleRadius,
  particleOptions,
  constraintOptions
) {
  let group = Body.nextGroup(true);
  particleOptions = Matter.Common.extend(
    {
      inertia: Infinity,
      friction: 0.00001,
      restitution: 1,
      collisionFilter: {
        group: group,
        mask: CATEGORY_MOUSE | CATEGORY_BRIDGE, // Collide with bridge and rectangle
      },
      render: { visible: false },
    },
    particleOptions
  );

  constraintOptions = Matter.Common.extend(
    {
      stiffness: 0.7,
      // render: { type: "line", anchors: false },
    },
    constraintOptions
  );

  let cloth = Composites.stack(
    xx,
    yy,
    columns,
    rows,
    columnGap,
    rowGap,
    function (x, y) {
      return Bodies.circle(x, y, particleRadius, particleOptions);
    }
  );

  Composites.mesh(cloth, columns, rows, crossBrace, constraintOptions);
  cloth.label = "Cloth Body";

  return cloth;
}

function renderCloth(cloth) {
  // Render particles
  for (let body of cloth.bodies) {
    push();
    noStroke();
    fill(200);
    ellipse(body.position.x, body.position.y, body.circleRadius * 2);
    pop();
  }

  // Render constraints
  for (let constraint of cloth.constraints) {
    push();
    stroke(255);
    strokeWeight(2);
    line(
      constraint.bodyA.position.x + constraint.pointA.x,
      constraint.bodyA.position.y + constraint.pointA.y,
      constraint.bodyB.position.x + constraint.pointB.x,
      constraint.bodyB.position.y + constraint.pointB.y
    );
    pop();
  }
}

function addBridge() {
  let group = Body.nextGroup(true);

  bridge = Composites.stack(0, 0, 55, 1, 0, 0, function (x, y) {
    return Bodies.circle(width / 2, height / 2, 100, {
      collisionFilter: {
        group: group,
        mask: CATEGORY_MOUSE | 1, // Collide with mouse
      },
      frictionAir: 0.08,
      resititution: 0,
      friction: 0,
      density: 1,
      mass: 10000,
    });
  });
  bridge.bodies[54].circleRadius = 102;
  Composites.chain(bridge, 0, 0, 0, 0, {
    stiffness: 1.3,
  });

  Composite.add(world, [
    bridge,
    Constraint.create({
      pointA: { x: width / 2, y: height / 2 - 200 },
      bodyB: bridge.bodies[0],
      pointB: { x: 0, y: 0 },
      length: 1,
      stiffness: 1,
      damping: 1,
    }),
  ]);
}
