import './../../utilities/Vector';
import './../Animation';
import './Text';


class Point {
    /**
    * Creates a new Point
    * @param x X point position
    * @param y Y point position
    * @param color drawing color of the point
    * @param pointName name of the point (in LaTeX)
    * @param pointSize Size of the point (default 6)
    * @param vectorName Name of the vector
    * @param drawOriginVector true : draw the vector from the origin to this point
    */
    constructor(x, y, color, pointName, pointSize = 6, vectorName, drawOriginVector = true) {
        this.pos = new Vector(x, y, color, vectorName);

        if(pointName != undefined)
            this.pointName = new pSText(pointName, this.pos, 18, color);

        this.drawOriginVector = drawOriginVector;
        this.pointSize        = pointSize;
        this.pointSizeDrawing = pointSize;

        this.textPadding = 0.4;
    }

    /**
    * Updates the point
    * @param dt Delta time since last update
    */
    update(dt) { }

    /**
    * Draw the point to the screen
    */
    draw() {
        let drawer = _pSimulationInstance.plotter.drawer;

        // POINT LOCATION
        drawer
            .fill(parseInt(this.pos.color[0] * 0.4), parseInt(this.pos.color[1] * 0.4), parseInt(this.pos.color[2] * 0.4))
            .noStroke()
            .ellipse(this.pos.x, this.pos.y, this.pointSizeDrawing, this.pointSizeDrawing)
            .stroke(this.pos.color)
            .strokeWeight(1.1)
            .noFill()
            .ellipse(this.pos.x, this.pos.y, this.pointSizeDrawing, this.pointSizeDrawing)
        ;

        // ORIGIN VECTOR
        if(this.pos.name != undefined && this.drawOriginVector)
            this.pos.draw();

        // POINT NAME
        if(this.pointName == undefined)
            return;

        this.pointName.pos = (this.pos.copy()).add(0, this.textPadding);
        if(this.pos.name != undefined && this.drawOriginVector && this.pos.y < 0)
            this.pointName.pos = (this.pos.copy()).add(0, -this.textPadding);

        this.pointName.draw(drawer);
    }
}

export default Point;
