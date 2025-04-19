class Blob {
  constructor({ x, y, radius = 120, steps = 20, nodeSize }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.steps = steps;
    this.nodes = [];
    this.nodeSize = nodeSize;

    this.velocity = createVector(random(-1, 1), random(-1, 1)).mult(0.0005); // very light
    this.moveTimer = random(60, 180); // frames until next change (1–3 seconds at 60fps)
    this.isMoving = true;
    this.nipples = [];
    this.group = Body.nextGroup(true); // negative group = no collision between group members
    this.strobeSpeed = 80;
    this.strobeColor;
  }

  init(world) {
    const totalCircumference = Math.PI * 2 * this.radius;
    const segmentLength = (totalCircumference / this.steps) * 0.95;

    // Create nodes
    for (let i = 0; i < this.steps; i++) {
      let angle = (i / this.steps) * Math.PI * 2;
      let px = this.x + Math.cos(angle) * this.radius;
      let py = this.y + Math.sin(angle) * this.radius;

      // ✅ Example: make nodes 5 through 8 static
      // let isStatic = i >= 17 && i <= 18;
      let isStatic;
      let node;
      if (i === 10) {
        // or any index you want
        node = new BlobNode(px, py, this.nodeSize, this.group, "rectangle");
      } else {
        node = new BlobNode(px, py, this.nodeSize, this.group, "circle", this);
      }
      node.init(world, isStatic); // ← pass that static flag into the init method
      this.nodes.push(node);

      if (i > 0) {
        node.link(this.nodes[i - 1], world, segmentLength);
      }
    }

    // Close the loop
    this.nodes[0].link(this.nodes[this.steps - 1], world, segmentLength);

    // Cross-link for squishiness
    const spacing = 10;
    for (let i = 0; i < this.steps; i++) {
      for (let j = i + spacing; j < this.steps; j += spacing) {
        this.nodes[i].join(this.nodes[j % this.steps], world);
      }
    }
  }

  neutralizeGravity() {
    const gravity = engine.world.gravity; // world gravity info
    const gravityForce =
      this.nodes[0].body.mass * gravity.y * engine.world.gravity.scale;

    for (let node of this.nodes) {
      if (node.body && !node.body.isStatic) {
        // Apply a force upwards equal to gravity
        Body.applyForce(node.body, node.body.position, {
          x: 0,
          y: -gravityForce,
        });
      }
    }
  }

  move() {
    // Countdown timer
    this.moveTimer--;

    if (this.isMoving) {
      // Apply a constant small force to every non-static node
      for (let node of this.nodes) {
        if (node.body && !node.body.isStatic) {
          Body.applyForce(node.body, node.body.position, {
            x: this.velocity.x,
            y: this.velocity.y,
          });
        }
      }
    }

    // When timer hits 0, change behavior
    if (this.moveTimer <= 0) {
      if (this.isMoving) {
        // Stop moving for a bit
        this.isMoving = false;
        this.moveTimer = int(random(30, 90)); // Stop for 0.5–1.5 seconds
      } else {
        // Pick a new random velocity and move again
        let angle = random(TWO_PI);
        let magnitude = random(0.0005, 0.0015); // much bigger magnitude
        this.velocity = createVector(Math.cos(angle), Math.sin(angle)).mult(
          magnitude
        );

        this.isMoving = true;
        this.moveTimer = int(random(60, 180)); // Move for 1–3 seconds
      }
    }
  }

  toPath() {
    let path = new BezierPath();

    // 🔍 Dynamically compute current center of blob
    let cx = 0;
    let cy = 0;
    for (let node of this.nodes) {
      cx += node.pos.x;
      cy += node.pos.y;
    }
    cx /= this.nodes.length;
    cy /= this.nodes.length;

    for (let node of this.nodes) {
      let pos = node.pos;
      let dx = pos.x - cx;
      let dy = pos.y - cy;
      let dist = Math.hypot(dx, dy) || 1; // prevent divide-by-zero

      let offsetX = (dx / dist) * node.radius;
      let offsetY = (dy / dist) * node.radius;

      path.add(pos.x + offsetX, pos.y + offsetY);
    }

    path.close();
    return path;
  }

  getCenter() {
    let cx = 0;
    let cy = 0;
    for (let node of this.nodes) {
      cx += node.pos.x;
      cy += node.pos.y;
    }
    cx /= this.nodes.length;
    cy /= this.nodes.length;
    return { x: cx, y: cy };
  }

  draw(showNodes = true) {
    // Determine if THIS blob is being electrocuted
    let isElectrocuted = electrocutedNodes.some((node) => {
      return this.nodes.includes(node);
    });

    // Color setup
    const normalBlobColor = color(255, 115, 191); // Pink for blob path
    const normalEllipseColor = color(255, 51, 0); // Orange for ellipse
    const normalRectColor = color(255, 51, 0); // Orange for rectangle
    const nodeNormalColor = color(0, 200, 255, 50); // Light blue nodes

    // Calculate strobe flashing
    let flashing = false;
    if (isElectrocuted && electrocution) {
      let cycle = millis() % (this.strobeSpeed * 2); // full cycle duration (normal + black)
      flashing = cycle >= this.strobeSpeed; // flashing is ON during second half
    }

    // Draw nodes if requested
    if (showNodes) {
      noStroke();
      for (let node of this.nodes) {
        if (!node.body) continue;
        let r = node.radius;

        if (node.shape === "circle") {
          fill(flashing ? color(255) : nodeNormalColor);
          circle(node.pos.x, node.pos.y, r * 2);
        } else if (node.shape === "rectangle") {
          push();
          fill(flashing ? color(255) : normalRectColor);
          translate(node.pos.x, node.pos.y);
          rotate(node.body.angle);
          rectMode(CENTER);
          rect(0, 0, r * 4, r * 2 + 12, r / 1.5);
          pop();
        }
      }
    }

    // Draw the blob path
    noStroke();
    fill(flashing ? color(255) : normalBlobColor);
    this.toPath().draw();

    // Clip inside blob and draw the center ellipse
    push();
    this.toPath().clip();

    fill(flashing ? color(255) : normalEllipseColor);
    ellipseMode(CENTER);
    ellipse(
      this.nodes[10].body.position.x,
      this.nodes[10].body.position.y,
      this.nodes[0].radius * 5
    );
    pop();
  }
}
