class SObject {
    constructor(x0, y0, positionName, vectorName) {
        this.pos = new Vector(x0, y0);
    }

    update(dt, everyObjects) {

    }

    draw(drawer) {
        drawer.ellipse(this.pos.x, this.pos.y, 5, 5);

        this.pos.draw();
        this.pos.draw(this.pos);
    }
}
