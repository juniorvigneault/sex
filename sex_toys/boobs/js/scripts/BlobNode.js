class BlobNode {
  constructor(
    x,
    y,
    radius = 1,
    group = 0,
    shape = "circle",
    parentBlob = null
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.body = null;
    this.linked = [];
    this.group = group;
    this.shape = shape;
    this.parentBlob = parentBlob; // 🔥 Reference to parent Blob
    this.isStatic = false;
  }

  init(world) {
    let randomDensity = random(0.0001, 0.005);
    if (this.shape === "circle") {
      this.body = Bodies.circle(this.x, this.y, this.radius, {
        density: 0.006,
        frictionAir: 0.1,
        restitution: 0.8,
        isStatic: this.isStatic,
        collisionFilter: {
          category: CATEGORY_BLOB,
          mask: CATEGORY_RECTANGLE | CATEGORY_MOUSE | CATEGORY_BLOB,
          // CATEGORY_NIPPLE
        },
      });
    } else if (this.shape === "rectangle") {
      this.body = Bodies.rectangle(
        this.x,
        this.y,
        this.radius * 4,
        this.radius + 12,
        {
          density: randomDensity,
          frictionAir: 0.1,
          restitution: 0.8,
          isStatic: this.isStatic,
          collisionFilter: {
            category: CATEGORY_BLOB,
            mask:
              CATEGORY_RECTANGLE |
              CATEGORY_MOUSE |
              CATEGORY_BLOB |
              CATEGORY_NIPPLE,
          },
        }
      );
    }

    World.add(world, this.body);
  }

  get pos() {
    return this.body.position;
  }

  link(other, world, length = undefined) {
    this.linked.push(other);
    other.linked.push(this);

    let constraint = Constraint.create({
      bodyA: this.body,
      bodyB: other.body,
      length: length,
      stiffness: 1,
    });

    World.add(world, constraint);
  }

  join(other, world) {
    let constraint = Constraint.create({
      bodyA: this.body,
      bodyB: other.body,
      stiffness: 0.01,
    });
    World.add(world, constraint);
  }
}
