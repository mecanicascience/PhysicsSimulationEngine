class Photon {
    constructor(x, y) {
        this.pos = new Vector(x, y);
        this.vel = new Vector(1, 0);
        this.G = 6.67 * 10**(-11);
        this.c = 3 * 10**8;
        this.vel.setMag(this.c);
        this.trail = [this.pos.copy()];
    }

    update(dt) {
        let dv = new Vector(0, -1).mult(- Math.sin(this.vel.getAngle() - this.pos.getAngle())
                                        * this.G * 10**27 / this.pos.mag());

        if(this.pos.copy().mag() > 10**8) {
            this.vel.add(dv.copy().mult(dt));
            this.pos.add(this.vel.copy().mult(dt));
            this.trail.push(this.pos.copy());
        }
    }

    draw(drawer) {
       for (var i = 0; i < this.trail.length - 1; i++) {
           drawer
                 .strokeWeight(1)
                 .stroke(255, 255, 0)
                 .line(this.trail[i].x, this.trail[i].y, this.trail[i + 1].x, this.trail[i + 1].y);
       }
    }
}
