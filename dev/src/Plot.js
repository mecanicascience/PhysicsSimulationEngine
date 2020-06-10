class Plot {
    constructor() {
        this.tr = new pSTriangle(new Vector(-2, -2), new Vector(2, -2), new Vector(0, 2), 'white');
    }

    update(dt) {
        this.tr.rotate(0.01);
    }

    draw(drawer) {
        this.tr.draw();
    }
}
