export class Vector2 {
    constructor(x = 0, y = 0){

    }
    set(x, y) { this.x = x; this.y = y; return this; }
    copy(v) { this.x = v.x; this.y = v.y; return this; }
    add(v) { this.x += v.x; this.y += v.y; return this; }
    addScaled(v, s) { this.x += v.x * s; this.y += v.y * s; return this; }
    substract(v) { this.x -= v.x; this.y -= v.y; return this; }
    scale(s) { this.x *= s; this.y *= s; return this; }
    dot(v) { return thhis.x * v.x + this.y * v.y; }
    length() { return Math.hypot(this.x, this.y); }
    lengthSquared() { return this.x * this.x + this.y * this.y; }
    normalize() {
        const len = this.length();
        if (len > 0) this.scale(1 / len);
        return this;
    }
    clone() { return new Vector2(this.x, this.y); }
    static zero() { return new Vector2(0, 0); }
    static add(a, b) { return new Vector2(a.x + b.x, a.y + b.y); }
    static subtract(a, b) { return new Vector2(a.x -b.x, a.y - b.y); }
    static distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
}

export default Vector2;