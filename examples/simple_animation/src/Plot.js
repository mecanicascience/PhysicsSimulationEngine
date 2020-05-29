class Plot {
    constructor() {
        //this.pointsCarre = [new pSPoint(-1, 1), new pSPoint(1, 1), new pSPoint(1, -1), new pSPoint(-1, -1)];
        // this.anim = pSAnimation.new('interpolation', 5, this.points);

        this.anim = pSAnimation.new('easeInOutCubic', 5, {min : -5,  max : 5});
        this.anim.start();

        this.point = new pSPoint(0, 0)
    }

    update(dt) {
        this.point.pos.y = this.anim.updateKey();
    }

    draw() {
        // this.anim.drawKey();

        this.point.draw();
        // for (let i = 0; i < this.points.length; i++) {
        //     this.points[i].draw();
        // }
    }
}
