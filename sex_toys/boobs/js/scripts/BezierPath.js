class BezierNode {
  constructor(x, y) {
    this.pos = createVector(x, y).copy();
    this.prev = null;
    this.next = null;
  }

  get p0() {
    return this.pos;
  }
  get p1() {
    return this.handleNext;
  }
  get p2() {
    return this.next ? this.next.handlePrev : null;
  }
  get p3() {
    return this.next ? this.next.pos : null;
  }

  linkNext(node) {
    this.next = node;
    node.prev = this;
  }

  get handlePrev() {
    if (!this.prev) return this.pos.copy();
    let p = this.pos;
    let v = this._getHandleVector();
    return p5.Vector.add(p, p5.Vector.mult(v, -1));
  }

  get handleNext() {
    if (!this.next) return this.pos.copy();
    let p = this.pos;
    let v = this._getHandleVector();
    return p5.Vector.add(p, v);
  }

  _getHandleVector(strength = 0.4) {
    let p0 = this.prev?.pos ?? this.pos;
    let p1 = this.pos;
    let p2 = this.next?.pos ?? this.pos;

    let v0 = p5.Vector.sub(p1, p0);
    let v1 = p5.Vector.sub(p2, p1);
    return p5.Vector.mult(p5.Vector.add(v0, v1), strength * 0.5);
  }
}

class BezierPath {
  constructor() {
    this.nodes = [];
    this.closed = false;
  }

  add(x, y) {
    let node = new BezierNode(x, y);
    if (this.nodes.length) this.nodes[this.nodes.length - 1].linkNext(node);
    this.nodes.push(node);
  }

  addPoints(points) {
    points.forEach((p) => this.add(p.x, p.y));
  }

  close() {
    this.closed = true;
    this.nodes[this.nodes.length - 1].linkNext(this.nodes[0]);
  }

  _traceShape() {
    beginShape();
    let first = true;
    for (let node of this.nodes) {
      let { p0, p1, p2, p3 } = node;
      if (first) vertex(p0.x, p0.y);
      bezierVertex(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      first = false;
    }
    endShape(this.closed ? CLOSE : undefined);
  }

  draw() {
    this._traceShape(); // Just draw the visible path
  }

  clip() {
    beginClip(); // ✅ Start clipping BEFORE the shape
    this._traceShape(); // ✅ Shape traced here
    endClip(); // ✅ End clipping AFTER
  }
}
