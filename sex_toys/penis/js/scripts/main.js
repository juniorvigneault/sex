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
let continueButton;
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
let pg, pgBlur;
let pgBlurH, pgBlurV, pgFinal;
let blurShader, outputShader;
let blurShaderH, blurShaderV, outputShaderFinal;
let keyedImage;
let rows, cols;
let size = 30;
let grid = [];
let buttonClickable = true;
let infoCardDivOutline;
let isDraggingBead = false;

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
  let blurShader, outputShader;
  let fbo1, fbo2, fbo3; // Frame buffer objects
  let blurWeights = [];
  let blurRadius = 15;

  s.preload = function () {
    // GTAmericaFont = s.loadFont("/penis/css/GT-America-Regular.otf");
    blurShader = s.loadShader(
      "js/scripts/shaders/blur.vert",
      "js/scripts/shaders/blur.frag"
    );
    outputShader = s.loadShader(
      "js/scripts/shaders/output.vert",
      "js/scripts/shaders/output.frag"
    );
  };

  s.setup = function () {
    canvasS = s.createCanvas(canvasSize.x, canvasSize.y, s.WEBGL);
    canvasS.parent("particles-canvas");

    // Créer les frame buffers
    fbo1 = s.createFramebuffer({ width: canvasSize.x, height: canvasSize.y });
    fbo2 = s.createFramebuffer({ width: canvasSize.x, height: canvasSize.y });
    fbo3 = s.createFramebuffer({ width: canvasSize.x, height: canvasSize.y });

    setupBlurWeights();
  };

  s.draw = function () {
    // Étape 1: Rendre la scène dans fbo1 avec fond transparent
    fbo1.begin();
    s.clear(); // Fond transparent
    s.translate(-canvasSize.x / 2, -canvasSize.y / 2);
    s.scale(1, -1); // Inverser l'axe Y pour corriger l'orientation
    s.translate(0, -canvasSize.y); // Ajuster la position après l'inversion

    // Dessiner les particules blanches
    for (let i = 0; i < particles.length; i++) {
      s.push();
      s.fill(255, 255, 255, 255);
      s.noStroke();
      s.ellipseMode(s.CENTER);
      s.ellipse(
        particles[i].position.x,
        particles[i].position.y,
        particles[i].circleRadius * 2
      );
      s.pop();

      // Nettoyage des particules hors écran
      if (particles[i].position.y > 800) {
        World.remove(world, particles[i]);
        particles.splice(i, 1);
        i--;
      }
    }
    fbo1.end();

    // Étape 2: Appliquer le blur gaussien
    applyGaussianBlur();

    // Étape 3: Appliquer le contraste et rendre le résultat final
    applyContrastAndRender();
  };

  function setupBlurWeights() {
    const weight = [];
    let t = 0.0;

    for (let i = blurRadius - 1; i >= 0; i--) {
      let r = 1.0 + 2.0 * i;
      let w = Math.exp((-0.5 * (r * r)) / (blurRadius * blurRadius));
      weight.push(w);
      if (i > 0) {
        w *= 2.0;
      }
      t += w;
    }

    for (let i = 0; i < weight.length; i++) {
      weight[i] /= t;
    }

    blurWeights = weight;
  }

  function applyGaussianBlur() {
    // Blur vertical (fbo1 -> fbo2)
    fbo2.begin();
    s.clear();
    s.shader(blurShader);

    // Uniformes pour le blur vertical
    blurShader.setUniform("uDiffuse", fbo1.color);
    blurShader.setUniform("uStep", [1.0 / canvasSize.x, 1.0 / canvasSize.y]);
    blurShader.setUniform("uStepSize", [0.0, 1.0]); // Vertical
    blurShader.setUniform("uWeight", blurWeights);

    s.push();
    s.translate(-canvasSize.x / 2, -canvasSize.y / 2);
    s.noStroke();
    s.rect(0, 0, canvasSize.x, canvasSize.y);
    s.pop();
    fbo2.end();

    // Blur horizontal (fbo2 -> fbo3)
    fbo3.begin();
    s.clear();
    s.shader(blurShader);

    // Uniformes pour le blur horizontal
    blurShader.setUniform("uDiffuse", fbo2.color);
    blurShader.setUniform("uStep", [1.0 / canvasSize.x, 1.0 / canvasSize.y]);
    blurShader.setUniform("uStepSize", [1.0, 0.0]); // Horizontal
    blurShader.setUniform("uWeight", blurWeights);

    s.push();
    s.translate(-canvasSize.x / 2, -canvasSize.y / 2);
    s.noStroke();
    s.rect(0, 0, canvasSize.x, canvasSize.y);
    s.pop();
    fbo3.end();
  }

  function applyContrastAndRender() {
    // Rendre le résultat final avec fond transparent
    s.clear(); // Fond transparent au lieu de la couleur lilas

    s.shader(outputShader);
    outputShader.setUniform("uDiffuse", fbo3.color);

    s.push();
    s.translate(-canvasSize.x / 2, -canvasSize.y / 2);
    s.noStroke();
    s.rect(0, 0, canvasSize.x, canvasSize.y);
    s.pop();

    s.resetShader();
  }
}

function sketch(p) {
  p.preload = function () {};

  p.setup = function () {
    canvasP = p.createCanvas(canvasSize.x, canvasSize.y);

    // Move the canvas within the HTML into the appropriate section
    canvasP.parent("p5js-canvas");

    lastMousePressedTime = p.millis(); // Initialize it when game starts
    // particlesCanvas = document.querySelector("#particles-canvas");

    endMessage = document.querySelector("#end-message");
    infoCard = document.querySelector("#infoCardDiv");
    infoCardText = document.querySelector("#infoCard");
    nextGameContainer = document.querySelector("#nextGameContainer");
    continueButton = document.querySelector("#continueButton");
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

    nextGameContainer.addEventListener("click", () => {
      window.location.href = "/boobs/index.html"; // <-- replace with your file
    });

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
  }; // end of setup

  p.draw = function () {
    p.background(200); // Transparent background to keep the gooey effect
    displayBackground();
    // p.translate(-p.width / 2, -p.height / 2);
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

    emptyBalls();

    // draw penis using a thick line
    for (let i = 0; i < penis.bodies.length; i++) {
      if (i > 0 && i <= 30) {
        p.push();
        p.strokeWeight(penisBeadsSize * 2);
        strokeHsluv(284.9, 100, 70.1, p);
        p.line(
          penis.bodies[i].position.x,
          penis.bodies[i].position.y,
          penis.bodies[i - 1].position.x,
          penis.bodies[i - 1].position.y
        );
        p.pop();
      }
    }

    // if user clicks, touch to start and club sexu title dissapears
    if (waitingForClick) {
      // Do nothing, wait for click
    } else if (startGame) {
      articleLink();
    }

    // draw the particles for destktop version using gooey filter
    // p.push();
    // p.translate(-p.width / 2, -p.height / 2);
    // p.noStroke();
    // p.fill(255);

    // for (let i = 0; i < particles.length; i++) {
    //   p.ellipse(
    //     particles[i].position.x,
    //     particles[i].position.y,
    //     p.floor(particles[i].circleRadius * 2)
    //   );

    //   if (particles[i].position.y > 800) {
    //     World.remove(world, particles[i]);
    //     particles.splice(i, 1);
    //     i--;
    //   }
    // }
    // p.pop();
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

    nextGameContainer.style.left = window.innerWidth / 2 + 97 + "px";
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

    p.rectMode(p.CENTER);
    p.translate(staticBodyPos.x, staticBodyPos.y);
    p.rotate(angle + 0.223);
    // start sperm in balls at 150px
    let offset = 150;
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
    console.log(particlesCanvas);

    let mouse = Mouse.create(particlesCanvas);
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 1,
      },
      collisionFilter: { category: CATEGORY_MOUSE },
    });

    World.add(world, mouseConstraint);

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

    enclosures.push(bottomEnclosure);
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
