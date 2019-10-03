import Vector2 from "./Vector2";

export abstract class Drawable {
    position: Vector2;

    protected constructor(position: Vector2) {
        this.position = position;
    }

    public abstract draw(ctx: CanvasRenderingContext2D): void;
}
