import './../utilities/Vector';

class pSPlotter {
    /**
    * @param simulator Main Engine simulator
    * @param drawer Main Engine drawer instance
    */
    constructor(simulator, drawer) {
        this.simulator = simulator;
        this.drawer    = drawer;
        this.objectsL  = [];

        this.drawer.plotter = this;
    }

    /**
    * Update main loop
    * @param dt Delta time since last update (in seconds)
    */
    update(dt) {
        if(this.simulator.config.engine.plotter.is_3D) {
            lights();
            orbitControl(5, 5);
        }

        for (let i = 0; i < this.objectsL.length; i++)
            this.objectsL[i].update(dt, this.objectsL);
    }

    /* Draw main loop */
    draw() {
        let plConf = this.simulator.config.engine.plotter;
        let bg     = plConf.backgroundColor.color;

        if(plConf.backgroundColor.draw)
            background(bg.r, bg.g, bg.b);

        // Draw every object to the screen
        for (let i = 0; i < this.objectsL.length; i++)
            this.objectsL[i].draw(this.drawer);


        // Draw the grid
        if(this.simulator.config.engine.plotter.displayGrid) {
            if(this.simulator.config.engine.plotter.is_3D) {
                debugMode(100, 10, 0, 0, 0, 20, 0, -40, 0);
            }
            else {
                this.drawer
                    .noFill()
                    .stroke(plConf.gridColor.r, plConf.gridColor.g, plConf.gridColor.b, plConf.gridColor.a)
                    .strokeWeight(0.5);

                let yS = Math.round(height / plConf.scale.y / 2);
                if(!plConf.squareByX)
                    yS = plConf.scale.y;

                for (let i = -plConf.scale.x - 1; i < plConf.scale.x + 1; i++)
                    for (let j = -yS - 1; j < yS + 1; j++)
                        this.drawer.rect(i + plConf.offset.x, j + plConf.offset.y, 1, 1);

                this.drawer
                    .noFill()
                    .stroke(plConf.gridColor.r, plConf.gridColor.g, plConf.gridColor.b, plConf.gridColor.a + 0.3)
                    .strokeWeight(2)
                    .line(-plConf.scale.x + plConf.offset.x - 1, 0, plConf.scale.x + plConf.offset.x + 1, 0);


                if(!plConf.squareByX)
                    this.drawer.line(0, -plConf.scale.y - 1, 0, plConf.scale.y + 1);
                else
                    this.drawer.line(0, -yS - 1, 0, yS + 1);
            }
        }

        this.drawer
            .noFill()
            .stroke(plConf.gridColor.r, plConf.gridColor.g, plConf.gridColor.b, plConf.gridColor.a)
            .strokeWeight(0.5);
    }



    /**
    * Compute the X and Y pixel position based on the drawing parameters
    * @param xRel X relative position
    * @param yRel Y relative position
    * @param zRel Z relative position
    * @param useOffset Calculate with simulation offsets (default : true)
    * @return {X, Y, Z} object
    */
    computeForXYZ(xRel, yRel, zRel, useOffset = true) {
        let c = this.simulator.config.engine.plotter;

        if(!useOffset && !c.is_3D && c.squareByX) {
            let v0 = this.computeForXYZ(0, 0, 0);
            let v1 = this.computeForXYZ(xRel, yRel, zRel);

            return new Vector(
                v1.x - v0.x,
                v1.y - v0.y,
                v1.z - v0.z
            );
        }
        else if (!c.is_3D) {
            let v = new Vector(
                ((xRel - c.offset.x) / c.scale.x + 1) * width / 2,
                0,
                ((xRel + c.offset.z) / c.scale.z + 1) * width / 2
            );

            if(!c.squareByX)
                v.y = ((-yRel + c.offset.y) / c.scale.y + 1) * height / 2;
            else
                v.y = ((-yRel + c.offset.y) / c.scale.x)     * width  / 2 + height / 2;

            return v;
        }
        else {
            // 360 x 360 : grid size
            let fac = 180 * 0.28;
            let v = new Vector(
                (( xRel + c.offset.x) / c.scale.x) * fac,
                ((-yRel + c.offset.y) / c.scale.y) * fac,
                (( zRel + c.offset.z) / c.scale.z) * fac
            );

            return v;
        }
    }


    /**
    * Compute the X and Y plot position based on the pixel position
    * @param xRel X pixel position
    * @param yRel Y pixel position
    * @return {X, Y} object
    */
    computeForXYFromPixel(x, y) {
        let c = _pSimulationInstance.config.engine.plotter;
        let v = new Vector(((x * 2) / width - 1) * c.scale.x + c.offset.x);

        if(c.squareByX)
            v.y = -(((y * 2) / height - 1)           * c.scale.y - c.offset.y);
        else
            v.y = -((((y - 2 * height) * 2) / width) * c.scale.y - c.offset.y);

        return v;
    }
}

export default pSPlotter;
