import './../utilities/Vector';

class pSPlotter {
    constructor(simulator, drawer) {
        this.simulator = simulator;
        this.drawer    = drawer;
        this.objectsL  = [];

        this.drawer.plotter = this;
    }


    update(dt) {
        for (let i = 0; i < this.objectsL.length; i++)
            this.objectsL[i].update(dt, this.objectsL);
    }

    draw() {
        let plConf = this.simulator.config.engine.plotter;
        let bg     = plConf.backgroundColor.color;

        if(plConf.backgroundColor.draw) {
            background(bg.r, bg.g, bg.b);
        }

        // Draw every object to the screen
        for (let i = 0; i < this.objectsL.length; i++)
            this.objectsL[i].draw(this.drawer);


        // Draw the grid
        if(this.simulator.config.engine.plotter.displayGrid) {
            /** @TODO To be implemented */
            let centerPos = this.computeForXY(0, 0);
            this.drawer
                .noStroke()
                .fill(plConf.gridColor.r, plConf.gridColor.g, plConf.gridColor.b, plConf.gridColor.a)
                .ellipse(centerPos.x, centerPos.y, 10, 10);
        }
    }



    /**
    * Compute the X and Y pixel position based on the drawing parameters
    * @param xRel X relative position
    * @param yRel Y relative position
    * @return {X, Y} object
    */
    computeForXY(xRel, yRel) {
        let c = this.simulator.config.engine.plotter;
        let v = new Vector(((xRel + c.offset.x) / c.scale.x + 1)  * width / 2);

        if(!c.scale.squareByX)
            v.y = ((-yRel + c.offset.y) / c.scale.y + 1) * height / 2;
        else
            v.y = ((-yRel + c.offset.y) / c.scale.x)     * width  / 2 + height / 2;

        return v;
    }


    /**
    * Compute the X and Y plot position based on the pixel position
    * @param xRel X pixel position
    * @param yRel Y pixel position
    * @return {X, Y} object
    */
    computeForXYFromPixel(x, y) {
        let c = _pSimulationInstance.config.engine.plotter;
        let v = new Vector(((x * 2) / width - 1) * c.scale.x - c.offset.x);

        if(!c.scale.squareByX)
            v.y = -(((y * 2) / height - 1)           * c.scale.y - c.offset.y);
        else
            v.y = -((((y - 2 * height) * 2) / width) * c.scale.y - c.offset.y);

        return v;
    }
}

export default pSPlotter;
