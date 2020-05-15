import './../../utilities/Vector';
import './../Animation';
import './Text';


class Point {
    constructor(x, y, color, pointName, pointSize = 6, vectorName, drawOriginVector = true) {
        this.pos = new Vector(x, y, color, vectorName);

        if(pointName != undefined)
            this.pointName = new pSText(pointName, this.pos, 18, color);

        this.drawOriginVector = drawOriginVector;
        this.pointSize        = pointSize;
        this.pointSizeDrawing = pointSize;

        //this.animation = new pSAnimation('easeInOutCubic');

        this.textPadding = 0.4;
    }

    update() { }

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


    handleMouseOver(mX1, mX2, mY1, mY2) {
        // if(this.pos.x > mX1 && mX2 > this.pos.x && this.pos.y > mY1 && mY2 > this.pos.y) {
        //     if(!this.animation.isAnimating)
        //         this.animation.start();
        //
        //     this.pointSizeDrawing = this.pointSize + this.animation.nextKey() * 100;//8;
        // }
        // else {
        //     this.animation.stop();
        //     this.pointSizeDrawing = this.pointSize;
        // }
    }
}

export default Point;
