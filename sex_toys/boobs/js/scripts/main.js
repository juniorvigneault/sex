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
let cloth;
let gameX = 200;
let gameY = 100;
let ellipseRadius = 100;
let boobSize = 180;
let rightBoob;
let leftBoob;
let chain;
let parts;
const CATEGORY_BRIDGE = 0x0001;
const CATEGORY_CIRCLE_PARTICLE = 0x0002;
const CATEGORY_RECTANGLE = 0x0004;
const CATEGORY_MOUSE = 0x0008;
const CATEGORY_NIPPLE = 0x0009;
const CATEGORY_CLAMP = 0x0006;

let areola = {
  leftX: undefined,
  leftY: undefined,
  rightY: undefined,
  leftY: undefined,
};

let clothOptions = {
  x: 0,
  y: 0,
  col: 60,
  row: 25,
  colGap: 5,
  rowGap: 5,
  crossBrace: false,
  particleRad: 5,
};
function setup() {
  // let canvas = createCanvas(1000, 1000);

  let canvas = createCanvas(1000, 800);
  // Move the canvas within the HTML into the appropriate section
  canvas.parent("p5js-canvas");
  engine = Engine.create();
  world = engine.world;
  Runner.run(engine);
  engine.world.gravity.scale = 0.0014;
  let mouse = Mouse.create(document.querySelector("#p5js-canvas")),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.02,
      },
      collisionFilter: { category: CATEGORY_MOUSE },
    });

  World.add(world, mouseConstraint);

  //bum = new Bum(width / 2, 300, 400);

  addEnclosures();
  let breasts = {
    x: width / 2,
    y: 200,
  };

  let spaceBetweenBoobs = 60;
  rightBoob = addBridge(breasts.x - boobSize - spaceBetweenBoobs / 2, 220); // Add the bridge here
  leftBoob = addBridge(breasts.x + boobSize + spaceBetweenBoobs / 2, 220); // Add the bridge here

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
  let leftTassle = Bodies.circle(200, 200, 60, {
    isStatic: false,
    collisionFilter: {
      mask: CATEGORY_RECTANGLE | CATEGORY_MOUSE,
    },
  });
  particles.push(leftTassle);

  // Create chain links
  let numChainLinks = 25;
  let chainLinkSize = 15;
  let x = 200;
  let chainLink;
  for (let i = 0; i < numChainLinks; i++) {
    chainLink = Bodies.circle(x, 600, chainLinkSize, {
      collisionFilter: {
        mask: CATEGORY_RECTANGLE | CATEGORY_MOUSE,
      },
    });
    particles.push(chainLink);
    x += chainLinkSize;
  }

  let rightTassle = Bodies.circle(200, 200, 60, {
    isStatic: false,
    collisionFilter: {
      mask: CATEGORY_RECTANGLE | CATEGORY_MOUSE,
    },
  });
  particles.push(rightTassle);
  // Add all particles to the world
  // World.add(world, particles);

  // Create the chain
  let cord = Composites.chain(
    Composite.create({ bodies: particles }),
    0,
    0,
    0,
    0,
    {
      stiffness: 0.4, // Adjust stiffness as needed
      length: 30, // Adjust length as needed
    }
  );

  World.add(world, cord);
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

  // push();
  // strokeWeight(30);
  // stroke(100, 100, 200);
  // fill(0, 200, 0);
  // ellipse(width / 2, 210, 200);
  // pop();
  //bum.display();
  for (let enclosure of enclosures) {
    enclosure.display({ r: 200, g: 200, b: 200, a: 20 });
  }
  // push();
  // ellipseMode(CENTER);
  // ellipse();
  // pop();
  drawBridge(rightBoob, boobSize, true);
  drawBridge(leftBoob, boobSize, true);

  for (let i = 0; i < particles.length; i++) {
    ellipseMode(CENTER);
    fill(200, 50, 100);
    ellipse(
      particles[i].position.x,
      particles[i].position.y,
      particles[i].circleRadius * 2
    );
    if (i > 0) {
      push();
      stroke(200, 50, 100);
      strokeWeight(18); // Adjust the stroke weight as needed
      line(
        particles[i - 1].position.x,
        particles[i - 1].position.y,
        particles[i].position.x,
        particles[i].position.y
      );
      pop();
    }
  }
  stickToy(particles[0]);
  stickToy(particles[particles.length - 1]);
}

function stickToy(particle) {
  let distanceLeft = dist(
    particle.position.x,
    particle.position.y,
    areola.leftX,
    areola.leftY
  );

  let distanceRight = dist(
    particle.position.x,
    particle.position.y,
    areola.rightX,
    areola.rightY
  );

  if (distanceLeft <= 25) {
    console.log("stuck");
    Body.setPosition(particle, {
      x: areola.leftX,
      y: areola.leftY,
    });
    Matter.Body.setVelocity(particle, { x: 0, y: 0 });
    // Matter.Body.translate(particles[0], { x: areola.leftX, y: areola.leftY });
  }

  if (distanceRight <= 25) {
    console.log("stuck");
    Body.setPosition(particle, {
      x: areola.rightX,
      y: areola.rightY,
    });
    Matter.Body.setVelocity(particle, { x: 0, y: 0 });
    // Matter.Body.translate(particles[0], { x: areola.leftX, y: areola.leftY });
  }
}

function drawVertices(bridge) {
  for (let i = 0; i < bridge.bodies.length; i++) {
    let vertices = bridge.bodies[i].vertices;
    push();
    fill(255);
    noStroke();
    beginShape();
    for (let vertexPoints of vertices) {
      vertex(vertexPoints.x, vertexPoints.y);
    }
    endShape(CLOSE);
    pop();
  }
}

function mousePressed() {}

function addEnclosures() {
  let bottomEnclosure = new RectangleParticle(
    width / 2,
    height,
    width,
    100,
    true,
    world
  );
  enclosures.push(bottomEnclosure);
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
  cloth = createCloth(
    clothOptions.x,
    clothOptions.y,
    clothOptions.col,
    clothOptions.row,
    clothOptions.colGap,
    clothOptions.rowGap,
    clothOptions.crossBrace,
    clothOptions.particleRad
  );

  // Make the first row of particles static to anchor the cloth
  for (let i = 0; i < clothOptions.col; i++) {
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
      stiffness: 1.2,
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

function renderCloth(cloth, columns, rows) {
  // Draw each square in the cloth
  push();
  noStroke();
  fill(200, 100, 100); // Choose your fill color here

  for (let y = 0; y < rows - 1; y++) {
    for (let x = 0; x < columns - 1; x++) {
      let index = x + y * columns;
      let nextIndex = index + 1;
      let belowIndex = index + columns;
      let belowNextIndex = belowIndex + 1;

      beginShape();
      vertex(cloth.bodies[index].position.x, cloth.bodies[index].position.y);
      vertex(
        cloth.bodies[nextIndex].position.x,
        cloth.bodies[nextIndex].position.y
      );
      vertex(
        cloth.bodies[belowNextIndex].position.x,
        cloth.bodies[belowNextIndex].position.y
      );
      vertex(
        cloth.bodies[belowIndex].position.x,
        cloth.bodies[belowIndex].position.y
      );
      endShape(CLOSE);
    }
  }
  pop();

  // Optional: Render particles (if you still want to show them)
  for (let body of cloth.bodies) {
    // push();
    // noStroke();
    // fill(200);
    // ellipse(body.position.x, body.position.y, body.circleRadius * 2);
    // pop();
  }

  // Optional: Render constraints (if you still want to show them)
  for (let constraint of cloth.constraints) {
    // push();
    // stroke(255);
    // strokeWeight(2);
    // line(
    //   constraint.bodyA.position.x + constraint.pointA.x,
    //   constraint.bodyA.position.y + constraint.pointA.y,
    //   constraint.bodyB.position.x + constraint.pointB.x,
    //   constraint.bodyB.position.y + constraint.pointB.y
    // );
    // pop();
  }
}

function drawBridge(bridge, boobSize, boob) {
  let lastCircle = leftBoob.bodies.length - 1;
  let circleSize = 150;
  for (let i = 0; i < bridge.bodies.length; i++) {
    if (i > 0) {
      if (boob) {
        push();
        // stroke(0, 200, 0);
        // strokeWeight(boobSize);
        // line(
        //   bridge.bodies[i - 1].position.x,
        //   bridge.bodies[i - 1].position.y,
        //   bridge.bodies[i].position.x,
        //   bridge.bodies[i].position.y
        // );
        noStroke();
        fill(0, 200, 0);
        ellipseMode(CENTER);
        ellipse(
          bridge.bodies[i].position.x,
          bridge.bodies[i].position.y,
          circleSize * 2 + 5
        );
        circleSize += 3;
        pop();
      } else {
        push();
        stroke(200, 0, 0);
        strokeWeight(23);
        line(
          bridge.bodies[i - 1].position.x,
          bridge.bodies[i - 1].position.y,
          bridge.bodies[i].position.x,
          bridge.bodies[i].position.y
        );
        // noStroke();
        // rectMode(CENTER);
        // rect(bridge.bodies[i].position.x, bridge.bodies[i].position.y, 20, 20);
        pop();
      } // boob
    }
  }

  if (bridge === leftBoob) {
    Body.setPosition(nipples[0], {
      x: bridge.bodies[lastCircle].position.x + 115,
      y: bridge.bodies[lastCircle].position.y + 138,
    });

    Body.setAngle(nipples[0], -14.8);
    push();
    let vertices = nipples[0].vertices;
    fill(0, 150, 0);
    noStroke();
    beginShape();
    for (let vertexPoints of vertices) {
      vertex(vertexPoints.x, vertexPoints.y);
    }
    endShape(CLOSE);
    pop();
    push();
    beginClip();
    ellipse(
      bridge.bodies[lastCircle].position.x,
      bridge.bodies[lastCircle].position.y,
      circleSize * 2
    );
    endClip();
    noStroke();
    areola.leftX = bridge.bodies[lastCircle].position.x + 120;
    areola.leftY = bridge.bodies[lastCircle].position.y + 150;
    fill(0, 150, 0);
    ellipse(areola.leftX, areola.leftY, 120);
    pop();
  } else if (bridge === rightBoob) {
    Body.setPosition(nipples[0], {
      x: bridge.bodies[lastCircle].position.x - 115,
      y: bridge.bodies[lastCircle].position.y + 138,
    });
    Body.setAngle(nipples[0], -14.84);
    push();
    let vertices = nipples[0].vertices;
    fill(0, 150, 0);
    noStroke();
    beginShape();
    for (let vertexPoints of vertices) {
      vertex(vertexPoints.x, vertexPoints.y);
    }
    endShape(CLOSE);
    pop();
    push();
    beginClip();
    ellipse(
      bridge.bodies[lastCircle].position.x,
      bridge.bodies[lastCircle].position.y,
      circleSize * 2
    );
    endClip();
    noStroke();
    areola.rightX = bridge.bodies[lastCircle].position.x - 120;
    areola.rightY = bridge.bodies[lastCircle].position.y + 150;
    fill(0, 150, 0);
    ellipse(areola.rightX, areola.rightY, 120);
    pop();
  }
  noStroke();
  // ellipse(
  //   bridge.bodies[lastCircle].position.x,
  //   bridge.bodies[lastCircle].position.y + 150,
  //   120
  // );
  // fill(0, 200, 0);
  // noStroke();
  // rectMode(CENTER);
  // rect(0, 0, nippleWidth, nippleHeight);

  // for (let nipple of nipples) {
  //   push();
  //   fill(0, 200, 0);
  //   noStroke();
  //   rectMode(CENTER);
  //   rect(nipple.position.x, nipple.position.y, nippleWidth, nippleHeight);
  //   pop();
  // }
}

function addClamps() {
  parts = [
    Bodies.rectangle(100, 600, 10, 30),
    Bodies.rectangle(140, 600, 10, 30),
    Bodies.rectangle(120, 625, 50, 10),
  ];

  let clamp = Body.create({
    parts: [parts[0], parts[1], parts[2]],
    // isStatic: true,
    collisionFilter: {
      group: CATEGORY_CLAMP,
      mask: CATEGORY_MOUSE | CATEGORY_RECTANGLE | CATEGORY_NIPPLE, // Collide with mouse
    },
  });

  Composite.add(world, clamp);
}

function addBridge(x, y) {
  let group = Body.nextGroup(true);

  let bridge = Composites.stack(0, 0, 10, 1, 0, 0, function (x, y) {
    return Bodies.circle(100, 100, boobSize, {
      collisionFilter: {
        group: group,
        mask: CATEGORY_MOUSE | 1, // Collide with mouse
      },
      frictionAir: 0.08,
      resititution: 0,
      friction: 0,
      density: 1,
      mass: 100000,
    });
  });

  Composites.chain(bridge, 0, 0, 0, 0, {
    stiffness: 0.9,
    length: 7,
  });

  let nipple = Bodies.rectangle(0, 0, nippleWidth, nippleHeight, {
    isStatic: true,
    collisionFilter: {
      group: CATEGORY_NIPPLE,
      mask: CATEGORY_MOUSE | CATEGORY_CLAMP,
    },
    chamfer: { radius: [12, 12, 12, 12] },
  });

  nipples.push(nipple);

  Composite.add(world, [
    bridge,
    nipple,
    Constraint.create({
      pointA: { x: x, y: y },
      bodyB: bridge.bodies[0],
      pointB: { x: 0, y: 0 },
      length: 1,
      stiffness: 0.97,
    }),
  ]);

  return bridge;
}

function createChain(x, y) {
  let group = Body.nextGroup(true);

  let bridge = Composites.stack(x, y, 40, 1, 0, 0, function (x, y) {
    return Bodies.rectangle(width / 2, height / 2, 20, 20, {
      collisionFilter: {
        group: group,
        mask: CATEGORY_MOUSE | CATEGORY_RECTANGLE, // Collide with mouse
      },
      resititution: 0,
      friction: 1,
    });
  });

  Composites.chain(bridge, 0, 0, 0, 0, {
    stiffness: 1.2,
    length: 20,
  });

  Composite.add(world, [bridge]);

  //bridge.bodies[0].isStatic = true;
  return bridge;
}

function fillHsluv(h, s, l, sketch) {
  const rgb = hsluv.hsluvToRgb([h, s, l]);
  sketch.fill(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
}

function strokeHsluv(h, s, l, sketch) {
  const rgb = hsluv.hsluvToRgb([h, s, l]);
  sketch.stroke(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
}
