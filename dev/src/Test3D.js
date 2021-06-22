class Test3D {
    constructor() {
        this.scl = 10;
        this.w = 500;
        this.h = 500;
        this.cols = this.w / this.scl;
        this.rows = this.h / this.scl;

        this.terrain = new Array(this.rows-1).fill(0).map(
            (el, i) => new Array(this.cols-1).fill(0).map((el, j) => noise((i + j) * 10 + random(0, 1))*20)
        );
        console.log(this.terrain);
    }

    update(dt) {
    }

    draw(drawer) {
        drawer.fill(255);

        // drawer.stroke(255);
        drawer.translate(-this.w / 2, -this.h / 2);
        for (let y = 0; y < this.terrain.length; y++) {
            drawer.beginShape(TRIANGLE_STRIP);
            for (let x = 0; x < this.terrain[y].length; x++) {
                let z = this.terrain[x][y];
                drawer.vertex(x * this.scl, y * this.scl, this.terrain[x][y]);
                drawer.vertex(x * this.scl, (y + 1) * this.scl, this.terrain[x][y + 1]);
            }
            drawer.endShape();
        }
    }
}
