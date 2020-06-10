import './../../utilities/Vector';
import './../Animation';
import './Text';

class pSTriangle {
    /**
    * Creates a new Triangle
    * @param p0 Vector to the first point of the triangle
    * @param p1 Vector to the second point of the triangle (default (0, 0))
    * @param p2 Vector to the third point of the triangle (default (0, 0))
    * @param fillColor The triangle fill color (default none)
    * @param strokeColor The triangle stroke color (default none)
    * @param strokeWeight The triangle strokeWeight (default 1)
    */
    constructor(p0, p1 = new Vector(), p2 = new Vector(), fillColor = 'white', strokeColor = 'none', strokeWeight = 1) {
        this.setCoordinates(p0, p1, p2);

        // Colors
        this.fillColor    = fillColor;
        this.strokeColor  = strokeColor;
        this.strokeWeight = strokeWeight;
    }


    /**
    * @param p0 Vector to the first point of the triangle
    * @param p1 Vector to the second point of the triangle (default last point)
    * @param p2 Vector to the third point of the triangle (default last point)
    */
    setCoordinates(p0, p1, p2) {
        this.p0 = p0 || new Vector(p0.x, p0.y);
        this.p1 = p1 == undefined ? this.p1 : new Vector(p1.x, p1.y);
        this.p2 = p2 == undefined ? this.p2 : new Vector(p2.x, p2.y);

        // The barycenter, or center of mass. This is the
        // point around which the triangle will rotate.
        this.pG = Vector.div(Vector.add(Vector.add(this.p0, this.p1), this.p2), 3);

        // The vectors pointing from the barycenter to P0, P1
        // and P2. They are useful when rotating the triangle.
        this.v0 = Vector.sub(this.p0, this.pG);
        this.v1 = Vector.sub(this.p1, this.pG);
        this.v2 = Vector.sub(this.p2, this.pG);
    }


    /**
    * Rotates the triangle by the specified angle, around
    * its center of mass.
    * @param angle Angle of rotation
    */
    rotate(angle) {
        this.v0.rotate(angle);
        this.v1.rotate(angle);
        this.v2.rotate(angle);

        this.p0 = Vector.add(this.v0, this.pG);
        this.p1 = Vector.add(this.v1, this.pG);
        this.p2 = Vector.add(this.v2, this.pG);
    }


    /**
    * Updates the triangle
    * @param dt Delta time since last update
    */
    update(dt) {}


    /**
    * Draws the triangle on the screen.
    */
    draw() {
        let d = _pSimulationInstance.plotter.drawer;

        if(this.fillColor == 'none')
            d.noFill();
        else
            d.fill(this.fillColor);

        if(this.strokeColor == 'none')
            d.noStroke();
        else
            d.stroke(this.strokeColor).strokeWeight(this.strokeWeight);

        d.push()
            .beginShape()
                .vertex(this.p0.x, this.p0.y)
                .vertex(this.p1.x, this.p1.y)
                .vertex(this.p2.x, this.p2.y)
                .vertex(this.p0.x, this.p0.y)
            .endShape()
        .pop();
    }
}

export default pSTriangle;
