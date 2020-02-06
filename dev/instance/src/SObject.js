class SObject {
    constructor(x0, y0, name) {
        this.pos = new Vector(x0, y0, name);
    }

    update(dt, everyObjects) {
        this.pos.rotate(0.01);
    }

    draw(drawer) {
        this.pos.draw();
    }
}
