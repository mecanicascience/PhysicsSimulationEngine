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
    * Compute the x and y position based on the drawing parameters
    * @param xRel X relative position
    * @param yRel Y relative position
    * @return {x, y} object
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
}

export default pSPlotter;
