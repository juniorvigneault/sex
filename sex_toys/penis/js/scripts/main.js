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
let nextGameContainer;
let particles = [];
let enclosures = [];
let analBeads = [];
let particleImage;
let spermImage;
let bum;
let allBodies;
let beads = [];
let waitingForClick = true;
let numBeads = 6;
let cloth;
let isCumming = false;
let canvasP;
let canvasS;
let penis;
let peeSound;
let gameX = 200;
let lastMousePressedTime;
const inactivityTimeout = 30000; // 30 seconds in milliseconds

let gameY = 100;
let ejaculationLevel = 0;
let ellipseRadius = 200;
let endGame = false;
let startGame = false;
const CATEGORY_PENIS = 0x0001;
const CATEGORY_SPERM = 0x0003;
const CATEGORY_CIRCLE_PARTICLE = 0x0002;
const CATEGORY_RECTANGLE = 0x0004;
const CATEGORY_MOUSE = 0x0008;
let penisBeadsSize = 57;
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
let GTAmericaFont;
let boxes = [];
let canvasSize = {
  x: 550,
  y: 800,
};
let cardNumber = 1;
let cummingTimeout = null;
let isDraggingPenis = false;
let endMessage;
let particlesCanvas;
let infoCard;
let borderThreshold = 10;
let infoCardText;
let pg;
let keyedImage;
let rows, cols;
let size = 30;
let grid = [];
let buttonClickable = true;
let infoCardDivOutline;
let isDraggingBead = false;

// const messages = [
//   "Le gland contient une concentration de terminaisons nerveuses qui en fait LA zone de stimulation du pénis.",
//   "Cependant, d’autres zones méritent notre attention: le frein (situé à la jonction du gland et de la verge), le périnée (entre les testicules et l’anus) et les testicules peuvent aussi être très sensibles.",
//   "Ces zones peuvent susciter du plaisir si elles sont stimulées doucement, avec attention. Chaque personne peut avoir des sensibilités différentes, et explorer ces zones peut enrichir les expériences sexuelles.",
//   "Le lubrifiant est un allié sous-estimé du pénis. Il favorise la glisse et réduit la friction, rendant la stimulation plus agréable, confortable et parfois plus intense selon les préférences.",
//   "Un pénis peut perdre son érection pendant une relation sexuelle. Ce phénomène est commun et peut survenir pour plusieurs raisons sans remettre en cause l’attirance ou le plaisir.",
//   "Cela peut créer des insécurités, même si cela arrive fréquemment: une stimulation est interrompue ou modifiée, on ressent du stress, de l’anxiété liée à la performance, ou simplement de la fatigue.",
//   "Est-ce qu’un pénis peut être désensibilisé si on le stimule trop? Pas d’inquiétude: les séances de masturbation fréquentes ne posent généralement pas de problème pour la sensibilité du pénis.",
//   "Cependant, une surstimulation intense peut causer une irritation ou une désensibilisation temporaire. La clé est de reconnaître ses limites et d’écouter son corps pendant la stimulation.",
// ];

const messages = [
  "These areas can create pleasure if gently stimulated with care. Every person may have different sensitivities, and exploring these zones can enhance sexual experiences.",
  "However, other zones also deserve attention: the frenulum (at the junction of the glans and shaft), the perineum (between the testicles and anus), and the testicles can also be very sensitive.",
  "The glans contains a concentration of nerve endings, making it THE main stimulation zone of the penis.",
  "Lubricant is an underrated ally of the penis. It enhances glide and reduces friction, making stimulation more pleasant, comfortable, and sometimes even more intense depending on preferences.",
  "It can create insecurities, even though it’s common: stimulation might be interrupted or changed, stress or performance anxiety may occur, or simply fatigue can affect the erection.",
  "A penis can lose its erection during sexual activity. This is common and can happen for many reasons, without it meaning there is a lack of attraction or pleasure.",
  "However, intense overstimulation may cause irritation or temporary desensitization. The key is to recognize your limits and listen to your body during stimulation.",
  "Can a penis become desensitized from too much stimulation?<br>No need to worry— frequent masturbation sessions usually do not cause lasting issues with penile sensitivity.",
];

let messageItem = 7;

let hasShownInfoCard = false;
let allowInfoCardReveal = true;

function sperm(s) {
  s.preload = function () {
    // GTAmericaFont = s.loadFont("/penis/css/GT-America-Regular.otf");
  };

  s.setup = function () {
    canvasS = s.createCanvas(canvasSize.x, canvasSize.y);
    // Move the canvas within the HTML into the appropriate section
    canvasS.parent("particles-canvas");

    // canvasS.style("filter", "blur(20px) contrast(2000%)");
    // s.pixelDensity(0.5);
    // s.frameRate(10); // Cap to 30 FPS
    // cols = s.width / size + 1;
    // rows = s.height / size + 1;

    // for (let i = 0; i < cols; i++) {
    //   grid[i] = [];
    //   for (let j = 0; j < rows; j++) {
    //     grid[i][j] = 0;
    //   }
    // }

    particlesCanvas.addEventListener("mouseleave", () => {
      isCumming = false;
      clearTimeout(cummingTimeout);
      cummingTimeout = null;
      isDraggingPenis = false;
      if (mouseConstraint) {
        World.remove(world, mouseConstraint);
        console.log("Mouse left – interaction disabled");
      }
    });

    particlesCanvas.addEventListener("mouseenter", () => {
      if (!world.constraints.includes(mouseConstraint.constraint)) {
        Mouse.setElement(mouseConstraint.mouse, particlesCanvas);

        World.add(world, mouseConstraint);
        console.log("Mouse re-entered – interaction enabled");
      }
    });
  };

  s.draw = function () {
    // s.background(0); // Black background
    s.clear();
    // s.blendMode(s.SCREEN);

    // Draw white particles
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

      if (particles[i].position.y > 800) {
        World.remove(world, particles[i]);
        particles.splice(i, 1);
        i--;
      }
    }

    // s.push();
    // s.rectMode(s.CENTER);
    // s.textSize(15);
    // s.textFont(GTAmericaFont);
    // // p.rect(275, 610, 180, 155);
    // s.text(
    //   "Est-ce qu’un pénis peut être désensibilisé si on le stimule trop? N’ayez crainte, les séances de masturbation récurrentes ne sont pas problématiques pour la sensibilité du pénis.",
    //   275,
    //   650,
    //   185,
    //   200
    // );
    // s.pop();

    // // Process pixels to key out black
    // s.loadPixels();
    // for (let i = 0; i < s.pixels.length; i += 4) {
    //   let r = s.pixels[i]; // Red
    //   let g = s.pixels[i + 1]; // Green
    //   let b = s.pixels[i + 2]; // Blue

    //   // Check if the pixel is black (or close to black)
    //   if (r === 0 && g === 0 && b === 0) {
    //     s.pixels[i + 3] = 0; // Set alpha to 0 (transparent)
    //   }
    // }
    // s.updatePixels();
  };
}

function sketch(p) {
  p.preload = function () {
    // peeSound = p.loadSound("assets/sounds/peeSound.mp3");
  };

  p.setup = function () {
    canvasP = p.createCanvas(canvasSize.x, canvasSize.y);
    // Move the canvas within the HTML into the appropriate section
    canvasP.parent("p5js-canvas");
    lastMousePressedTime = p.millis(); // Initialize it when game starts

    // p.frameRate(30);
    // cols = p.width / size + 1;
    // rows = p.height / size + 1;

    // for (let i = 0; i < cols; i++) {
    //   grid[i] = [];
    //   for (let j = 0; j < rows; j++) {
    //     grid[i][j] = 0;
    //   }
    // }
    // create engine, gravity, mouse constraint...
    // infoCardDivOutline = document.querySelector("#infoCardDivOutline");
    endMessage = document.querySelector("#end-message");
    infoCard = document.querySelector("#infoCardDiv");
    infoCardText = document.querySelector("#infoCard");
    nextGameContainer = document.querySelector("#nextGameContainer");
    infoCardText.innerHTML = messages[messageItem];
    continueButton.onclick = () => {
      swapCard();

      particles.forEach((p) => {
        const forceMagnitude = 0.04 * p.mass; // tweak this for drama or subtlety
        const randomAngle = Math.random() * Math.PI * 2;
        const force = {
          x: Math.cos(randomAngle) * forceMagnitude,
          y: Math.sin(randomAngle) * forceMagnitude,
        };

        Matter.Body.applyForce(p, p.position, force);
      });
    };
    particlesCanvas = document.querySelector("#particles-canvas");

    createEngine();
    addPenis();
    //bum = new Bum(width / 2, 300, 400);
    addEnclosures();
    centerEndMessage();
    positionNextGameContainer();

    // Add the bridge here
    //addBeads();
    analBeads.push(new AnalBeads(p.width / 2, p.height / 2 - 100, 115, 50));
    analBeads.push(new AnalBeads(p.width / 2, p.height / 2 - 100, 115, -50));

    let ballConstraint = Constraint.create({
      bodyA: analBeads[0].beads[1].body,
      bodyB: analBeads[1].beads[1].body,
      length: 100,
      stiffness: 0.9,
    });
    World.add(world, ballConstraint);

    moveInfoCardX();
    moveInfoCardY();

    window.addEventListener("resize", () => {
      moveInfoCardX();
      moveInfoCardY();
      centerEndMessage();
      positionNextGameContainer();
    });

    Events.on(mouseConstraint, "startdrag", function (event) {
      const body = event.body;
      const penisBodies = Composite.allBodies(penis);
      const bead1 = analBeads[0].beads[1].body;
      const bead2 = analBeads[1].beads[1].body;
      if (penisBodies.includes(body)) {
        isDraggingPenis = true;

        // Start timeout, but check again before setting isCumming
        cummingTimeout = setTimeout(() => {
          if (isDraggingPenis) {
            isCumming = true;
          }
        }, 1000);
      }
      isDraggingBead = body === bead1 || body === bead2;
    });

    Events.on(mouseConstraint, "enddrag", function (event) {
      const body = event.body;
      const penisBodies = Composite.allBodies(penis);

      if (penisBodies.includes(body)) {
        clearTimeout(cummingTimeout);
        cummingTimeout = null;
        isDraggingPenis = false;
        isCumming = false;
      }
    });

    // preventing dragging/interacting with bodies when going outside canvas and
    //  mouse up outside canvas and coming back in (also works with bug when card appears under
    // cursor while still dragging penis)
    window.addEventListener("mouseup", () => {
      if (mouseConstraint.body) {
        // Force release
        mouseConstraint.body = null;
        mouseConstraint.constraint.bodyB = null;
        mouseConstraint.constraint.pointB = null;
        mouseConstraint.constraint.angleB = 0;

        console.log("Mouse up outside — forcing release");

        // RESET Matter.Mouse internal state too
        mouseConstraint.mouse.button = -1;

        // Reset flags
        isDraggingPenis = false;
        isDraggingBead = false;
        isCumming = false;

        clearTimeout(cummingTimeout);
        cummingTimeout = null;
      }
    });
  };

  p.draw = function () {
    // p.background(0); // Transparent background to keep the gooey effect
    displayBackground();

    //marchingSquares();
    // console.log(particles.length);

    // if (particles.length >= 350) {
    //   infoCard.style.opacity = 1;
    // }
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
    // console.log(ejaculationLevel);

    // if (
    //   isDraggingBead &&
    //   p.mouseY <= p.height / 2 // "0 to half-height zone"
    // ) {
    //   mouseConstraint.constraint.stiffness = 0;
    // } else {
    //   mouseConstraint.constraint.stiffness = 0.004;
    // }
    // release balls when dragged passed mid height
    if (isDraggingBead && p.mouseY <= p.height / 2) {
      mouseConstraint.constraint.stiffness = 0;
    } else {
      mouseConstraint.constraint.stiffness = 0.004;
    }

    if (messageItem === -1) {
      endGame = true;
    }

    if (endGame) {
      restartGame();
      endgame = false;
    }

    if (
      p.millis() - lastMousePressedTime > inactivityTimeout &&
      !waitingForClick &&
      !hasShownInfoCard
    ) {
      console.log("Restarting game due to inactivity...");
      restartGame();
    }

    if (
      ejaculationLevel >= 270 &&
      !hasShownInfoCard &&
      allowInfoCardReveal &&
      !endGame
    ) {
      // console.log(mouseConstraint);
      World.remove(world, mouseConstraint);

      infoCard.classList.add("visible");
      setTimeout(() => {
        infoCardText.classList.add("opacity"); // Add the opacity transition class
      }, 200); // Delay in milliseconds
      // infoCardDiv.style.display = "flex";
      mouseConstraint.constraint.stiffness = 0;

      hasShownInfoCard = true;
      isCumming = false;
    }

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
          x: 0,
          y: -3000,
        },
        max: {
          x: p.width,
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

    // push();
    // ellipseMode(CENTER);
    // ellipse();
    // pop();
    emptyBalls();

    for (let i = 0; i < penis.bodies.length; i++) {
      if (i > 0 && i <= 30) {
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
        strokeHsluv(284.9, 100, 70.1, p);
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
    // if (particles.length >= 350 && !hasShownInfoCard && allowInfoCardReveal) {
    //   infoCard.classList.add("visible");
    //   hasShownInfoCard = true;
    // }
    // console.log(enclosures);
    for (let enclosure of enclosures) {
      enclosure.display(200, p);
      // console.log("color");
    }

    // console.log({
    //   isDraggingPenis: isDraggingPenis,
    //   mouseConstraintBody: mouseConstraint.body,
    //   constraintBodyB: mouseConstraint.constraint.bodyB,
    //   cumming: isCumming,
    // });

    if (waitingForClick) {
      // Do nothing, wait for click
    } else if (startGame) {
      articleLink();
    }
  };

  p.mousePressed = function () {
    if (waitingForClick) {
      waitingForClick = false;
      startGame = true;
      endMessage.classList.add("hidden");
    }
    lastMousePressedTime = p.millis(); // 🧹 Reset inactivity timer on any click
  };

  function articleLink() {
    // setTimeout(() => {
    endMessage.style.opacity = 0;
    // }, 1000);
  }

  function restartGame() {
    console.log("Restarting game...");

    messageItem = 7;
    cardNumber = 1;
    hasShownInfoCard = false;
    allowInfoCardReveal = true;
    ejaculationLevel = 0;

    // Make sure the "Touch to start" is visible again
    endMessage.style.opacity = 1;

    // Restart waiting for click
    waitingForClick = true;
    startGame = false;
    endGame = false;

    let cardNumberDiv = document.querySelector("#cardNumberText");
    cardNumberDiv.innerHTML = "1";

    //  if (!world.constraints.includes(mouseConstraint.constraint)) {
    //    World.add(world, mouseConstraint);
    //  }
  }

  function centerEndMessage() {
    let endMessage = document.querySelector("#end-message");

    let endMessageWidth = endMessage.offsetWidth / 2;
    let endMessageHeight = endMessage.offsetHeight / 2;

    endMessage.style.left = window.innerWidth / 2 - endMessageWidth + "px";
    endMessage.style.top =
      window.innerHeight / 2 - endMessageHeight + 265 + "px";
  }

  function positionNextGameContainer() {
    let nextGameWidth = nextGameContainer.offsetWidth / 2;
    let nextGameHeight = nextGameContainer.offsetHeight / 2;

    nextGameContainer.style.left = window.innerWidth / 2 + 100 + "px";
    nextGameContainer.style.top = window.innerHeight / 2 - 390 + "px";
  }

  //MASK CLIP FOR EMPTYING BALLS
  function emptyBalls() {
    p.push();
    p.rectMode(p.CENTER);
    p.fill(200, 200, 200, 100);
    // p.rect(275, 400, 300, 370);
    // let staticBodyPos = analBeads[0].beads[0].body.position;
    // let dynamicBodyPos = analBeads[0].beads[1].body.position;

    // let dx = dynamicBodyPos.x - staticBodyPos.x;
    // let dy = dynamicBodyPos.y - staticBodyPos.y;

    // let angle = Math.atan2(dy, dx);
    // p.translate(
    //   analBeads[0].beads[0].body.position.x,
    //   analBeads[0].beads[0].body.position.y
    // );
    // p.blendMode(p.REMOVE);
    p.clip(mask);

    let staticBodyPos = analBeads[0].beads[0].body.position;
    let posLeftBall = analBeads[0].beads[1].body.position;
    let posRightBall = analBeads[1].beads[1].body.position;
    p.strokeWeight(115);
    p.stroke(255);
    p.line(staticBodyPos.x, staticBodyPos.y, posLeftBall.x, posLeftBall.y);
    p.line(staticBodyPos.x, staticBodyPos.y, posRightBall.x, posRightBall.y);
    // p.noStroke();
    // p.blendMode(p.LIGHTEST);
    // p.fill(0);
    // p.rect(p.mouseX, p.mouseY, 200, 200);
    p.pop();
    // console.log(analBeads[0].beads[1].body.position);
  }
  function mask() {
    p.push();
    let staticBodyPos = analBeads[0].beads[0].body.position;
    let dynamicBodyPos = analBeads[0].beads[1].body.position;
    let dx = dynamicBodyPos.x - staticBodyPos.x;
    let dy = dynamicBodyPos.y - staticBodyPos.y;
    let angle = Math.atan2(dy, dx);
    // let posLeftBall = analBeads[0].beads[1].body.position;
    // let posRightBall = analBeads[1].beads[1].body.position;
    // console.log(analBeads[0].beads[0].body.position.x);
    // p.translate(0, 0);
    // p.ellipseMode(p.CENTER);
    // p.ellipse(275, 0, 300);
    // p.ellipse(posRightBall.x - 275, posRightBall.y - 275, 115);
    // p.ellipse(posLeftBall.x - 275, posLeftBall.y - 275, 115);
    // p.strokeWeight(20);
    p.rectMode(p.CENTER);
    p.translate(staticBodyPos.x, staticBodyPos.y);
    p.rotate(angle + 0.223);
    // start sperm in balls at 150px
    let offset = 150;
    // console.log(offset);
    p.rect(ejaculationLevel + offset, 0, 300, 370);
    p.pop();
  }

  function swapCard() {
    World.add(world, mouseConstraint);

    messageItem--;
    ejaculationLevel = 0;
    infoCard.classList.remove("visible");
    infoCardText.classList.remove("opacity"); // Add the opacity transition class
    cardNumber++;
    let cardNumberDiv = document.querySelector("#cardNumberText");
    cardNumberDiv.innerHTML = cardNumber;
    hasShownInfoCard = false;
    allowInfoCardReveal = false; // prevent immediate re-show

    enclosures.forEach((enclosure) => removeFromWorld(enclosure.body));
    mouseConstraint.constraint.stiffness = 0.004;

    setTimeout(() => {
      infoCardText.innerHTML = messages[messageItem];
      addEnclosures();
      buttonClickable = true;

      // ✅ Re-enable reveal *after* fade is done and particles can build back up
      allowInfoCardReveal = true;
    }, 1000); // Match the CSS transition duration
  }

  // remove droplets from the engine
  function removeFromWorld(body) {
    World.remove(world, body);
  }

  function createEngine() {
    engine = Engine.create();
    world = engine.world;
    Runner.run(engine);
    // engine.world.gravity.scale = 0.01;
    engine.world.gravity.scale = 0.002;

    let mouse = Mouse.create(particlesCanvas);
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 1,
      },
      collisionFilter: { category: CATEGORY_MOUSE },
    });

    World.add(world, mouseConstraint);
    // Add event listener for mouse clicks
    // Events.on(mouseConstraint, "mousedown", function (event) {
    //   const mousePosition = event.mouse.position;
    //   const bodies = Composite.allBodies(penis);

    //   const collidedBodies = Matter.Query.point(bodies, mousePosition);

    //   if (collidedBodies.length > 0) {
    //     setTimeout(() => {
    //       isCumming = true;
    //     }, 1000);
    //   } else {
    //     isCumming = false;
    //   }
    // });

    // wrapping plugin

    // Initialize matter-wrap plugin
    if (typeof MatterWrap !== "undefined") {
      Matter.use("matter-wrap");
    }

    // Events.on(mouseConstraint, "enddrag", function (event) {
    //   if (event.body === targetBody) {
    //     console.log("Target body was released.");
    //   }
    // });
  }

  function addPenis() {
    let group = Body.nextGroup(true);

    let x = p.width / 2; // CENTER horizontally
    let yStart = p.height / 2 - 103; // a bit above middle (you can adjust the -200)
    let spacing = 10; // spacing between beads

    penis = Composite.create({ label: "Penis" });

    for (let i = 0; i < 20; i++) {
      let isFirst = i === 0;
      let body = Bodies.circle(x, yStart + i * spacing, penisBeadsSize, {
        collisionFilter: {
          group: group,
          mask: CATEGORY_MOUSE | 1,
        },
        frictionAir: 0.03,
        isStatic: isFirst,
      });
      Composite.add(penis, body);

      if (i > 0) {
        let constraint = Constraint.create({
          bodyA: penis.bodies[i - 1],
          bodyB: penis.bodies[i],
          length: spacing,
          stiffness: 1,
        });
        Composite.add(penis, constraint);
      }
    }

    Composite.add(world, [
      penis,
      Constraint.create({
        pointA: { x: x, y: yStart }, // Attach to very first body's position!
        bodyB: penis.bodies[0],
        pointB: { x: 0, y: 0 },
        length: 0,
      }),
    ]);
  }

  p.mouseReleased = function () {
    isCumming = false;
  };

  // position info card in the middle of the canvas even if user resizes
  function moveInfoCardX() {
    // Get the current position of the canvas in the viewport
    let canvasRect = canvasP.elt.getBoundingClientRect();
    // let infoCard = document.querySelector("#infoCardDiv");
    // card with is 220px (220+ 40 padding)
    let infoCardWidth = 260 / 2;
    let left = canvasRect.left + canvasSize.x / 2 - infoCardWidth + "px"; // Center by subtracting 125 (half of 250px)
    // console.log(infoCardDivOutline.style);
    // infoCardDivOutline.style.left = left;
    infoCard.style.left = left;
  }

  function moveInfoCardY() {
    let canvasRect = canvasP.elt.getBoundingClientRect();
    // card height is 220px + 40 padd
    infoCardHalfHeight = 320 / 2;
    let top = canvasRect.top + canvasSize.y / 2 - infoCardHalfHeight; // Center by subtracting 125 (half of 250px)

    infoCard.style.top = top - 1 + "px";
    // infoCardDivOutline.style.top = top - 20 + "px";
  }

  function makeSperm() {
    let lastCircle = penis.bodies.length - 1;
    let randomSize = p.random(7, 12);
    let randomSmall = p.random(4, 7);

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
      density: 0.0005,
      // mass: 200,
      restitution: 0.7,
      // frictionAir: 0.5,
      collisionFilter: {
        group: CATEGORY_SPERM,
        mask: CATEGORY_MOUSE | CATEGORY_RECTANGLE,
      },
    });
    let smallParticle;
    let randomFrameCount = p.random(10, 60);
    if (p.frameCount % 40 > randomFrameCount) {
      smallParticle = Bodies.circle(x, y + 3, randomSmall, {
        friction: 0,
        density: 0.0001,
        density: 1,
        restitution: 0.7,
        collisionFilter: {
          group: group,
          mask: CATEGORY_MOUSE | CATEGORY_RECTANGLE,
        },
      });
      World.add(world, smallParticle);
      particles.push(smallParticle);
      spermForce(smallParticle, 0.12);
    }

    World.add(world, particle);
    particles.push(particle);

    spermForce(particle, 0.0045);

    // Body.applyForce(particle, particle.position, { x: 0, y: 10 });
    // console.log(particles);
    ejaculationLevel++;
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

  function displayBackground() {
    p.push();
    p.rectMode(p.CORNER);
    p.noStroke();
    fillHsluv(13.4, 100, 43.6, p);
    p.rect(0, 0, p.width, p.height);

    let gradient = p.drawingContext.createLinearGradient(
      0,
      p.height / 2,
      0,
      p.height
    ); // Vertical gradient from middle to bottom

    let rgb = hsluv.hsluvToRgb([99, 100, 94.7]);
    let colorBottom = `rgba(${rgb[0] * 255}, ${rgb[1] * 255}, ${
      rgb[2] * 255
    }, 1)`; // Fully opaque

    let colorTop = `rgba(${rgb[0] * 255}, ${rgb[1] * 255}, ${rgb[2] * 255}, 0)`; // Fully transparent

    gradient.addColorStop(0, colorTop); // Transparent at the midpoint
    gradient.addColorStop(1, colorBottom); // Full color at the bottom

    p.drawingContext.fillStyle = gradient;
    p.rect(0, p.height / 2, p.width, p.height / 2); // Draw the gradient
    p.pop();
  }

  function addEnclosures() {
    let container = {
      x: 0,
      y: 10,
    };

    let bottomEnclosure = new RectangleParticle(
      container.x + p.width / 2,
      container.y + p.height,
      p.width,
      20,
      true,
      world
    );

    // let tunnelEnclosureLeft = new RectangleParticle(
    //   container.x - 10,
    //   container.y + 740,
    //   20,
    //   100,
    //   true,
    //   world
    // );

    // let tunnelEnclosureRight = new RectangleParticle(
    //   container.x + p.width + 10,
    //   container.y + 740,
    //   20,
    //   100,
    //   true,
    //   world
    // );

    // enclosures.push(tunnelEnclosureRight);
    // enclosures.push(tunnelEnclosureLeft);
    enclosures.push(bottomEnclosure);
  }

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

function fillHsluv(h, s, l, sketch, alpha = 255) {
  const rgb = hsluv.hsluvToRgb([h, s, l]);
  sketch.fill(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255, alpha);
}

function strokeHsluv(h, s, l, sketch) {
  const rgb = hsluv.hsluvToRgb([h, s, l]);
  sketch.stroke(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
}

new p5(sketch);
new p5(sperm);

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

// for (let i = 0; i < particles.length; i++) {
//   p.push();
//   p.fill(255);
//   p.noStroke();
//   p.ellipseMode(p.CENTER);

//   p.ellipse(
//     particles[i].position.x,
//     particles[i].position.y,
//     particles[i].circleRadius * 2
//   );
//   p.pop();

//   if (particles[i].position.y > 800) {
//     World.remove(world, particles[i]);
//     particles.splice(i, 1);
//     // prevents the skipping of a box when removed from the array by backing up 1
//     i--;
//   }
// }
// marchingSquares();
// console.log(particles);

// for (let box of boxes) {
//   box.display(p);
//   for (wall of box.walls) {
//     let color = 0;
//     let p5Var = p;
//     wall.display(color, p5Var);
//   }
// }
// function gooeyEffect() {
//   s.loadPixels();
//   for (let i = 0; i < s.width; i++) {
//     for (let j = 0; j < s.height; j++) {
//       let index = (i + j * s.width) * 4; // Get pixel index
//       let r = index;
//       let g = index + 1;
//       let b = index + 2;
//       if (s.pixels[r] < 100) {
//         // Blob (smoother core)
//         s.pixels[r] = 135;
//         s.pixels[g] = 199;
//         s.pixels[b] = 191;
//       } else if (s.pixels[r] < borderThreshold) {
//         // Border (gooey edges)
//         s.pixels[r] = 22;
//         s.pixels[g] = 147;
//         s.pixels[b] = 165;
//       } else {
//         // Background
//         s.pixels[r] = 98;
//         s.pixels[g] = 182;
//         s.pixels[b] = 182;
//       }
//     }
//   }
//   s.updatePixels(); // Apply the pixel changes
// }
