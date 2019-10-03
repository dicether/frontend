export default class Vector2 {
    public x: number;
    public y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public multiply(t: number): Vector2 {
        return new Vector2(this.x * t, this.y * t);
    }

    public add(v: Vector2): Vector2 {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    public subtract(v: Vector2): Vector2 {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    public sqrMagnitude(): number {
        return this.x * this.x + this.y * this.y;
    }

    public magnitude(): number {
        return Math.sqrt(this.sqrMagnitude());
    }

    public negate(): Vector2 {
        return new Vector2(-this.x, -this.y);
    }

    public dot(v: Vector2): number {
        return this.x * v.x + this.y * v.y;
    }

    public normalize(): Vector2 {
        const magnitude = this.magnitude();
        return new Vector2(this.x / magnitude, this.y / magnitude);
    }
}
