// matter.js components
let Engine = Matter.Engine;
let Events = Matter.Events;
let Runner = Matter.Runner;
let Bodies = Matter.Bodies;
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
  let canvas = createCanvas(800, 800);
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

  analBeads = new AnalBeads(width / 2, -500);

  bum = new Bum(width / 2, 100);
}

function draw() {
  background(0);

  for (let particle of particles) {
    particle.display();
  }

  analBeads.display();
  bum.display();

  // push();
  // ellipseMode(CENTER);
  // ellipse();
  // pop();
}

function mousePressed() {}

function addEnclosures() {}
