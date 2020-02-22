class Point {
    constructor(x, y, color, pointName, pointSize = 5, vectorName, drawOriginVector = true) {
        this.pos = new Vector(x, y, color, vectorName);

        if(pointName != undefined)
            this.pointName = new Text(pointName, this.pos, 18, color);

        this.drawOriginVector = drawOriginVector;
        this.pointSize        = pointSize;

        this.textPadding = 0.4;
    }

    update() {}

    draw() {
        let drawer = _pSimulationInstance.plotter.drawer;

        // POINT LOCATION
        drawer
            .fill(this.pos.color)
            .noStroke()
            .ellipse(this.pos.x, this.pos.y, this.pointSize, this.pointSize);

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
