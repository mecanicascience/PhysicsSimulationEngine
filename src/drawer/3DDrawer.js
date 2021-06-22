import pSDrawer from './Drawer';

class pS3DDrawer {
    /** Construct the main pS3DEngine drawer */
    constructor(plotter) {
        this.plotter  = null; // set when loaded in the Plotter class
        this.drawer2D = new pSDrawer(plotter);

        this.stroke       = this.drawer2D.stroke;
        this.strokeWeight = this.drawer2D.strokeWeight;
        this.fill         = this.drawer2D.fill;
        this.noStroke     = this.drawer2D.noStroke;
        this.noFill       = this.drawer2D.noFill;
    }




    translate(x, y, z) {
        let v = this.plotter.computeForXYZ(x, y, z);
        translate(v.x, v.y, v.z);
        return this;
    }

    beginShape(TYPE) {
        beginShape(TYPE);
        return this;
    }

    endShape() {
        endShape();
        return this;
    }

    vertex(x, y, z) {
        let v = this.plotter.computeForXYZ(x, y, z);
        vertex(v.x, v.y, v.z);
        return this;
    }


    clearStack() {
        return this;
    }


    line(x0, y0, z0, x1, y1, z1) {
        let v0 = this.plotter.computeForXYZ(x0, y0, z0);
        let v1 = this.plotter.computeForXYZ(x1, y1, z1);

        beginShape();
            vertex(v0.x, v0.y, v0.z);
            vertex(v1.x, v1.y, v1.z);
        endShape();

        return this;
    }

    sphere(x, y, z, r) {
        push();
            this.translate(x, y, z);
            sphere(r);
        pop();

        return this;
    }

    cone(x, y, z, r, h) {
        let v = this.plotter.computeForXYZ(r, h, 0);

        push();
            this.translate(x, y, z);
            cone(v.x, v.y);
        pop();

        return this;
    }

    box(x, y, z, w, h) {
        let v = this.plotter.computeForXYZ(w, h, 0);

        push();
            this.translate(x, y, z);
            box(v.x, v.y);
        pop();

        return this;
    }

    cylinder(x, y, z, r, h) {
        let v = this.plotter.computeForXYZ(r, h, 0);

        push();
            this.translate(x, y, z);
            cylinder(v.x, v.y);
        pop();

        return this;
    }

    plane(x, y, z, w, h) {
        let v = this.plotter.computeForXYZ(w, h, 0);

        push();
            this.translate(x, y, z);
            plane(v.x, v.y);
        pop();

        return this;
    }




    scale(s) {
        scale(s);
        return this;
    }

    model(modelRef, normalMat) {
        push();
            scale(-1);
            if (normalMat)
                normalMaterial();
            model(modelRef);
        pop();
        return this;
    }

    transform(x, y, z) {
        transform(x, y, z);
        return this;
    }
}

export default pS3DDrawer;
