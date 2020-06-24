class Plot {
    constructor() {
        this.puit = loadModel('puit.obj');
    }

    update(dt) { }

    draw(drawer) {
        drawer
            .push()
                .scale(6)
                .noStroke()
                .fill(255)
                .model(this.puit, true)
            .pop();
    }
}
