import './../../utilities/Vector';
import './../Animation';
import './Text';

class pSTriangle {
    /**
    * Creates a new Triangle
    * @param p0 Vector to the first point of the triangle
    * @param p1 Vector to the second point of the triangle
    * @param p2 Vector to the third point of the triangle
    * @param color The triangle color
    */
    constructor(p0, p1, p2, color) {
        this.p0 = new Vector(p0.x, p0.y);
        this.p1 = new Vector(p1.x, p1.y);
        this.p2 = new Vector(p2.x, p2.y);

      //The barycenter, or center of mass. This is the
      // point around which the triangle will rotate.
        this.pG = Vector.div(Vector.add(Vector.add(this.p0, this.p1), this.p2), 3);

      //The vectors pointing from the barycenter to P0, P1
      // and P2. They are useful when rotating the triangle.
        this.v0 = Vector.sub(this.p0, this.pG);
        this.v1 = Vector.sub(this.p1, this.pG);
        this.v2 = Vector.sub(this.p2, this.pG);

        this.color = color;
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
        _pSimulationInstance.plotter.drawer
            .stroke(...this.color)
            .line(this.p0.x, this.p0.y, this.p1.x, this.p1.y)
            .line(this.p1.x, this.p1.y, this.p2.x, this.p2.y)
            .line(this.p2.x, this.p2.y, this.p0.x, this.p0.y);
    }
}

export default pSTriangle;
