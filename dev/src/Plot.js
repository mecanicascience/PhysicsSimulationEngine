class Plot {
    constructor() {
        this.vec = new Vector(0, 2, 2, 'red', 'test');
    }

    update(dt) {
        this.vec.add(0, 0, -0.01);
    }

    draw(drawer) {
        drawer
            .stroke(255, 0, 0)
            .strokeWeight(3);

        this.vec.draw();
    }
}
