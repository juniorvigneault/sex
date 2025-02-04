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
let analBeads = [];
let particleImage;
let spermImage;
let bum;
let allBodies;
let beads = [];
let numBeads = 6;
let cloth;
let isCumming = false;
let canvasP;
let canvasS;
let penis;
let peeSound;
let gameX = 200;
let gameY = 100;
let ellipseRadius = 200;
const CATEGORY_PENIS = 0x0001;
const CATEGORY_SPERM = 0x0003;
const CATEGORY_CIRCLE_PARTICLE = 0x0002;
const CATEGORY_RECTANGLE = 0x0004;
const CATEGORY_MOUSE = 0x0008;
let penisBeadsSize = 55;
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
let boxes = [];

let particlesCanvas;

let borderThreshold = 10;

let rows, cols;
let size = 30;
let grid = [];

function sperm(s) {
  s.setup = function () {
    canvasS = s.createCanvas(400, 700);
    // Move the canvas within the HTML into the appropriate section
    canvasS.parent("particles-canvas");
    // s.pixelDensity(0.1);
    // s.frameRate(10); // Cap to 30 FPS
    cols = s.width / size + 1;
    rows = s.height / size + 1;

    for (let i = 0; i < cols; i++) {
      grid[i] = [];
      for (let j = 0; j < rows; j++) {
        grid[i][j] = 0;
      }
    }
  };

  s.draw = function () {
    // s.background(0, 0, 0);
    // push();
    // s.fill(255, 255, 255, 100);
    // s.rect(0, 0, s.width, s.height);
    // pop();
    // Clear the particles canvas
    // s.clear();
    for (let i = 0; i < particles.length; i++) {
      s.push();
      s.fill(255);
      s.noStroke();
      s.ellipseMode(s.CENTER);

      s.ellipse(
        particles[i].position.x,
        particles[i].position.y,
        particles[i].circleRadius * 2
      );
      s.pop();
    }
    // gooeyEffect();
  };

  function gooeyEffect() {
    s.loadPixels();
    for (let i = 0; i < s.width; i++) {
      for (let j = 0; j < s.height; j++) {
        let index = (i + j * s.width) * 4; // Get pixel index
        let r = index;
        let g = index + 1;
        let b = index + 2;
        if (s.pixels[r] < 100) {
          // Blob (smoother core)
          s.pixels[r] = 135;
          s.pixels[g] = 199;
          s.pixels[b] = 191;
        } else if (s.pixels[r] < borderThreshold) {
          // Border (gooey edges)
          s.pixels[r] = 22;
          s.pixels[g] = 147;
          s.pixels[b] = 165;
        } else {
          // Background
          s.pixels[r] = 98;
          s.pixels[g] = 182;
          s.pixels[b] = 182;
        }
      }
    }
    s.updatePixels(); // Apply the pixel changes
  }
}

function sketch(p) {
  p.preload = function () {
    // peeSound = p.loadSound("assets/sounds/peeSound.mp3");
  };

  p.setup = function () {
    canvasP = p.createCanvas(400, 700);
    // Move the canvas within the HTML into the appropriate section
    canvasP.parent("p5js-canvas");
    p.frameRate(30);
    cols = p.width / size + 1;
    rows = p.height / size + 1;

    for (let i = 0; i < cols; i++) {
      grid[i] = [];
      for (let j = 0; j < rows; j++) {
        grid[i][j] = 0;
      }
    }
    // create engine, gravity, mouse constraint...
    createEngine();
    addPenis();
    //bum = new Bum(width / 2, 300, 400);
    // addEnclosures();
    // Add the bridge here
    //addBeads();
    analBeads.push(new AnalBeads(p.width / 2, p.height / 2 - 100, 120));
    analBeads.push(new AnalBeads(p.width / 2, p.height / 2 - 100, 120));

    let ballConstraint = Constraint.create({
      bodyA: analBeads[0].beads[1].body,
      bodyB: analBeads[1].beads[1].body,
      length: 100,
      stiffness: 0.8,
    });
    World.add(world, ballConstraint);
  };

  p.draw = function () {
    // p.background(0); // Transparent background to keep the gooey effect
    displayBackground();
    // Clear the particles canvas
    // p.clear(canvasP);

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
      nuts.display(p);
    }

    if (isCumming) {
      makeSperm();
    }

    // Apply wrapping to all bodies
    allBodies = Composite.allBodies(world);
    for (let i = 0; i < allBodies.length; i++) {
      allBodies[i].plugin.wrap = {
        min: {
          x: -100,
          y: -3000,
        },
        max: {
          x: p.width + 100,
          y: p.height + 2000,
        },
      };
    }

    // console.log(allBodies);
    // push();
    // strokeWeight(30);
    // stroke(100, 100, 200);
    // fill(0, 200, 0);
    // ellipse(width / 2, 210, 200);
    // pop();
    //bum.display();
    // for (let enclosure of enclosures) {
    //   enclosure.display({ r: 200, g: 200, b: 200, a: 20 });
    // }
    // push();
    // ellipseMode(CENTER);
    // ellipse();
    // pop();

    for (let i = 0; i < penis.bodies.length; i++) {
      if (i > 0 && i <= 20) {
        p.push();
        // p.strokeWeight(penisBeadsSize);
        // strokeHsluv(0, 0, 13.2, p);
        // p.line(
        //   penis.bodies[i].position.x,
        //   penis.bodies[i].position.y,
        //   penis.bodies[i - 1].position.x,
        //   penis.bodies[i - 1].position.y
        // );

        p.strokeWeight(penisBeadsSize * 2);
        strokeHsluv(334.9, 78.7, 78, p);
        p.line(
          penis.bodies[i].position.x,
          penis.bodies[i].position.y,
          penis.bodies[i - 1].position.x,
          penis.bodies[i - 1].position.y
        );

        // p.noStroke();
        // fillHsluv(334.9, 78.7, 78, p);
        // p.ellipse(penis.bodies[i].position.x, penis.bodies[i].position.y, 200);

        p.pop();
      }
    }

    // let lastCircle = penis.bodies.length - 1;
    // GLAND;
    // p.push();
    // p.noStroke();
    // p.ellipseMode(p.CENTER);
    // p.fill(0, 100, 0);
    // p.ellipse(
    //   penis.bodies[lastCircle].position.x,
    //   penis.bodies[lastCircle].position.y + 15,
    //   40,
    //   0
    // );
    // p.pop();

    // noStroke();
    // fill(0, 200, 0);
    // ellipse(bridge.bodies[54].position.x, bridge.bodies[54].position.y, 130, 180);
    // push();
    // noStroke();
    // fill(0, 150, 0);
    // ellipse(
    //   bridge.bodies[54].position.x,
    //   bridge.bodies[54].position.y + 90,
    //   80,
    //   12
    // );
    // pop();
    //renderCloth(cloth, clothOptions.col, clothOptions.row);

    for (let i = 0; i < particles.length; i++) {
      // p.push();
      // p.fill(255);
      // p.noStroke();
      // p.ellipseMode(p.CENTER);

      // p.ellipse(
      //   particles[i].position.x,
      //   particles[i].position.y,
      //   particles[i].circleRadius * 2
      // );
      // p.pop();

      if (particles[i].position.y > 800) {
        World.remove(world, particles[i]);
        particles.splice(i, 1);
        // prevents the skipping of a box when removed from the array by backing up 1
        i--;
      }
    }
    marchingSquares();
    // console.log(particles);

    for (let box of boxes) {
      box.display(p);
      for (wall of box.walls) {
        let color = 0;
        let p5Var = p;
        wall.display(color, p5Var);
      }
    }
  };

  function marchingSquares() {
    if (particles.length > 0) {
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          let val = 0;
          for (let k = 0; k < particles.length; k++) {
            val +=
              (particles[k].circleRadius * particles[k].circleRadius) /
              ((i * size - particles[k].position.x) *
                (i * size - particles[k].position.x) +
                (j * size - particles[k].position.y) *
                  (j * size - particles[k].position.y));
          }

          grid[i][j] = val; // Store the computed value in the grid

          // p.noFill();
          // s.stroke(200);
          // s.rect(i * size, j * size, size, size);

          // if (val >= 1) {
          //   s.fill(0, 255, 0);
          // } else {
          //   s.fill(0);
          // }
          // s.text(s.round(val, 2), i * size, j * size);
        }
      }

      for (let i = 0; i < cols - 1; i++) {
        for (let j = 0; j < rows - 1; j++) {
          let a = 0;
          let b = 0;
          let c = 0;
          let d = 0;
          let f_a = grid[i][j];
          let f_b = grid[i + 1][j];
          let f_c = grid[i + 1][j + 1];
          let f_d = grid[i][j + 1];

          if (f_a >= 1) a = 1;
          else a = 0;
          if (f_b >= 1) b = 1;
          else b = 0;
          if (f_c >= 1) c = 1;
          else c = 0;
          if (f_d >= 1) d = 1;
          else d = 0;

          let config = 8 * a + 4 * b + 2 * c + 1 * d;
          // config += grid[i][j] >= 0.5; // Instead of 1

          p.push();
          p.strokeWeight(10);
          p.stroke(255);

          // let pt1 = p.createVector(i * size + size / 2, j * size);
          // let pt2 = p.createVector(i * size + size, j * size + size / 2);
          // let pt3 = p.createVector(i * size + size / 2, j * size + size);
          // let pt4 = p.createVector(i * size, j * size + size / 2);

          let pt1 = p.createVector();
          let amt = (1 - f_a) / (f_b - f_a);
          pt1.x = p.lerp(i * size, i * size + size, amt);
          pt1.y = j * size;

          let pt2 = p.createVector();
          amt = (1 - f_b) / (f_c - f_b);
          pt2.x = i * size + size;
          pt2.y = p.lerp(j * size, j * size + size, amt);

          let pt3 = p.createVector();
          amt = (1 - f_d) / (f_c - f_d);
          pt3.x = p.lerp(i * size, i * size + size, amt);
          pt3.y = j * size + size;

          let pt4 = p.createVector();
          amt = (1 - f_a) / (f_d - f_a);
          pt4.x = i * size;
          pt4.y = p.lerp(j * size, j * size + size, amt);

          switch (config) {
            case 0:
              break;
            case 1:
              p.line(pt3.x, pt3.y, pt4.x, pt4.y);
              break;
            case 2:
              p.line(pt2.x, pt2.y, pt3.x, pt3.y);
              break;
            case 3:
              p.line(pt2.x, pt2.y, pt4.x, pt4.y);
              break;
            case 4:
              p.line(pt1.x, pt1.y, pt2.x, pt2.y);
              break;
            case 5:
              p.line(pt1.x, pt1.y, pt4.x, pt4.y);
              p.line(pt2.x, pt2.y, pt3.x, pt3.y);
              break;
            case 6:
              p.line(pt1.x, pt1.y, pt3.x, pt3.y);
              break;
            case 7:
              p.line(pt1.x, pt1.y, pt4.x, pt4.y);
              break;
            case 8:
              p.line(pt1.x, pt1.y, pt4.x, pt4.y);
              break;
            case 9:
              p.line(pt1.x, pt1.y, pt3.x, pt3.y);
              break;
            case 10:
              p.line(pt1.x, pt1.y, pt2.x, pt2.y);
              p.line(pt3.x, pt3.y, pt4.x, pt4.y);
              break;
            case 11:
              p.line(pt1.x, pt1.y, pt2.x, pt2.y);
              break;
            case 12:
              p.line(pt2.x, pt2.y, pt4.x, pt4.y);
              break;
            case 13:
              p.line(pt2.x, pt2.y, pt3.x, pt3.y);
              break;
            case 14:
              p.line(pt3.x, pt3.y, pt4.x, pt4.y);
              break;
            case 15:
              break;
          }
        }
        p.pop();
      }
    }
  }

  function createEngine() {
    engine = Engine.create();
    world = engine.world;
    Runner.run(engine);
    // engine.world.gravity.scale = 0.01;
    // engine.world.gravity.scale = 0.003;

    let mouse = Mouse.create(document.querySelector("#p5js-canvas")),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.004,
        },
        collisionFilter: { category: CATEGORY_MOUSE },
      });

    World.add(world, mouseConstraint);

    // Add event listener for mouse clicks
    Events.on(mouseConstraint, "mousedown", function (event) {
      const mousePosition = event.mouse.position;
      const bodies = Composite.allBodies(penis);
      const collidedBodies = Matter.Query.point(bodies, mousePosition);

      if (collidedBodies.length > 0) {
        setTimeout(() => {
          isCumming = true;
        }, 1000);
      } else {
        isCumming = false;
      }
    });

    // wrapping plugin

    // Initialize matter-wrap plugin
    // if (typeof MatterWrap !== "undefined") {
    //   Matter.use("matter-wrap");
    // }
  }

  function addPenis() {
    let group = Body.nextGroup(true);

    penis = Composites.stack(0, 10, 17, 1, 0, 0, function (x, y) {
      return Bodies.circle(p.width / 2 - penisBeadsSize, 130, penisBeadsSize, {
        collisionFilter: {
          group: group,
          mask: CATEGORY_MOUSE | 1, // Collide with mouse
        },
        // isStatic: true,
        // frictionAir: 0.05,
      });
    });

    Composites.chain(penis, 0, 0, 0, 0, {
      stiffness: 1,
      length: 13,
    });

    Composite.add(world, [
      penis,
      Constraint.create({
        pointA: { x: p.width / 2, y: p.height / 2 - 105 },
        bodyB: penis.bodies[0],
        pointB: { x: 0, y: 0 },
        length: 1,
        stiffness: 1,
      }),
    ]);
  }

  p.mouseReleased = function () {
    isCumming = false;
  };

  function makeSperm() {
    let lastCircle = penis.bodies.length - 1;
    let randomSize = p.random(8, 12);
    let randomSmall = p.random(4, 6);

    let group = Body.nextGroup(true);

    let y = p.map(
      p.mouseY,
      0,
      p.height,
      penis.bodies[lastCircle].position.y - 35,
      penis.bodies[lastCircle].position.y + 45
    );

    let x = p.map(
      p.mouseX,
      0,
      p.width,
      penis.bodies[lastCircle].position.x - 35,
      penis.bodies[lastCircle].position.x + 35
    );

    let particle = Bodies.circle(x, y, randomSize, {
      friction: 0,
      // density: 1,
      // mass: 200,
      restitution: 0.7,
      collisionFilter: {
        group: CATEGORY_SPERM,
        mask: CATEGORY_MOUSE | CATEGORY_RECTANGLE,
      },
    });
    let smallParticle;
    let randomFrameCount = p.random(10, 60);
    if (p.frameCount % 60 > randomFrameCount) {
      smallParticle = Bodies.circle(x, y + 3, randomSmall, {
        friction: 0,
        density: 1,
        restitution: 0.7,
        collisionFilter: {
          group: group,
          mask: CATEGORY_MOUSE,
        },
      });
      World.add(world, smallParticle);
      particles.push(smallParticle);
      spermForce(smallParticle, 0.01);
    }

    World.add(world, particle);
    particles.push(particle);

    spermForce(particle, 0.01);

    // Body.applyForce(particle, particle.position, { x: 0, y: 10 });
    // console.log(particles);
  }

  function spermForce(particle, f) {
    // from https://stackoverflow.com/questions/35827012/matter-js-calculating-force-needed
    let targetAngle = Vector.angle(particle.position, {
      x: p.mouseX,
      y: p.mouseY,
    });

    let force = f;

    Body.applyForce(particle, particle.position, {
      x: p.cos(targetAngle) * force,
      y: p.sin(targetAngle) * force,
    });
  }

  function displayBackground() {
    p.push();
    p.rectMode(p.CORNER);
    p.noStroke();
    fillHsluv(77.1, 88.7, 90.9, p);
    p.rect(0, 0, p.width, p.height);
    p.pop();
  }

  // function addEnclosures() {
  //   let bottomEnclosure = new RectangleParticle(
  //     width / 2,
  //     height + 50,
  //     width,
  //     100,
  //     true,
  //     world
  //   );
  //   enclosures.push(bottomEnclosure);

  //   let tunnelEnclosureLeft = new RectangleParticle(
  //     gameX - 35,
  //     gameY + 300,
  //     500,
  //     1000,
  //     true,
  //     world
  //   );
  //   let tunnelEnclosureRight = new RectangleParticle(
  //     gameX + 585,
  //     gameY + 300,
  //     500,
  //     1000,
  //     true,
  //     world
  //   );

  //   enclosures.push(tunnelEnclosureRight);
  //   enclosures.push(tunnelEnclosureLeft);
  // }

  // function addBeads() {
  //   // Create a composite to hold the beads and constraints
  //   let beadComposite = Composite.create();
  //   let x = 0;
  //   let beadSize = 50;
  //   let spaceBetweenBeads = 40;
  //   // Create beads
  //   for (let i = 0; i < numBeads; i++) {
  //     let bead = new CircleParticle(
  //       x + i * beadSize + spaceBetweenBeads,
  //       100,
  //       beadSize,
  //       false,
  //       beadComposite
  //     );
  //     beads.push(bead);
  //   }

  //   // Add constraints (links) between the beads
  //   for (let i = 0; i < beads.length - 1; i++) {
  //     let options = {
  //       bodyA: beads[i].body,
  //       bodyB: beads[i + 1].body,
  //       length: 60, // Distance between centers of beads
  //       stiffness: 0.039,
  //     };
  //     let constraint = Constraint.create(options);
  //     Composite.add(beadComposite, constraint);
  //   }

  //   // Add the bead composite to the world
  //   Composite.add(world, beadComposite);
  // }

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
          mask: CATEGORY_MOUSE, // Collide with bridge and rectangle
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

    // // Optional: Render particles (if you still want to show them)
    // for (let body of cloth.bodies) {
    //   // push();
    //   // noStroke();
    //   // fill(200);
    //   // ellipse(body.position.x, body.position.y, body.circleRadius * 2);
    //   // pop();
    // }

    // // Optional: Render constraints (if you still want to show them)
    // for (let constraint of cloth.constraints) {
    //   // push();
    //   // stroke(255);
    //   // strokeWeight(2);
    //   // line(
    //   //   constraint.bodyA.position.x + constraint.pointA.x,
    //   //   constraint.bodyA.position.y + constraint.pointA.y,
    //   //   constraint.bodyB.position.x + constraint.pointB.x,
    //   //   constraint.bodyB.position.y + constraint.pointB.y
    //   // );
    //   // pop();
    // }
  }
}

function fillHsluv(h, s, l, sketch) {
  const rgb = hsluv.hsluvToRgb([h, s, l]);
  sketch.fill(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
}

function strokeHsluv(h, s, l, sketch) {
  const rgb = hsluv.hsluvToRgb([h, s, l]);
  sketch.stroke(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
}

new p5(sketch);
// new p5(sperm);
