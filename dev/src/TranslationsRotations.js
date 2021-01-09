class TranslationsRotations {
    constructor() {

    }

    update(dt) {

    }

    draw(drawer) {
        drawer
            .stroke(255, 255, 255, 0.7)
            .fill  (255, 255, 255, 0.5)
            .push()
                // .translate(this.pos.x, this.pos.y)
                // .scale(5)
                // .rotate(-this.engine.thrustAngle)
                .translate(2, 1)
                .rect(-1, -1, 2, 2)
                .translate(-2, -1)
                .rotate(Math.PI/4)
                .fill(255, 0, 0, 0.5)
                .rect(-1, -1, 2, 2)
            .pop();
        ;
    }
}
