class Plot {
    constructor() {
        this.vec = new Vector(2, 2, 0, 'red', 'test');

        this.theta = 0;
    }

    update(dt) {
        this.vec.x = Math.cos(this.theta)
        this.vec.y = Math.sin(this.theta);

        this.theta += 0.01;
    }

    draw(drawer) {
        drawer
            .stroke(255, 0, 0)
            .strokeWeight(3)
            .rect(0, 0, 1, 2);

        this.vec.draw();
    }
}
