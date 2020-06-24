class Plot {
    constructor() {
        // this.vec = new Vector(-2, -2, -2);
        //camera(0, -30, 100, 0, 0, 0, 0, 1, 0);
        // normalMaterial();
        //debugMode(100, 10, 0, 0, 0, 20, 0, -40, 0);

    }

    update(dt) {
        // this.vec.add(0.01, 0.01, 0.01);
    }

    draw(drawer) {
        // this.vec.draw();
        //orbitControl(5, 5);
        //fill(255, 0, 0);
        //this.line(0, 0, 0, 100, 100, 100);

        // fill(255);
        // noStroke();
        // translate(0, 0, 0);
        // rotateX(this.angle);
        // rectMode(CENTER);
        // rect(0, 0, 150, 150);

        //stroke(255);
        //strokeWeight(0.8);
        drawer.stroke(255).ellipse(3, 3, 3, 3);
    }

    line(x0, y0, z0, x1, y1, z1) {
        beginShape();
        vertex(x0, -y0, z0);
        vertex(x1, -y1, z1);
        endShape();
    }
}
