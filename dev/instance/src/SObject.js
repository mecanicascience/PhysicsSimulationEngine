class SObject {
    constructor(x0, y0, positionName, vectorName) {
        this.point = new Point(x0, y0, "red", positionName, undefined, vectorName);
    }

    update(dt, everyObjects) {
        this.point.pos.rotate(0.01);
    }

    draw(drawer) {
        this.point.draw(drawer, false);
    }
}
