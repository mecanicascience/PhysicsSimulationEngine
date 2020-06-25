class pSDrawer {
    /** Construct the main pSEngine drawer */
    constructor(plotter) {
        this.plotter = null; // set when loaded in the Plotter class
    }



    /**
    * Draw a point to the screen
    * @param x X simulation coordinate
    * @param y Y simulation coordinate
    * @return this
    */
    point(x, y) {
        let v = this.plotter.computeForXYZ(x, y);
        point(v.x, v.y);
        return this;
    }

    /**
    * Draw a line from one point to the other to the screen
    * @param x0 X initial simulation coordinate
    * @param y0 Y initial simulation coordinate
    * @param x1 X end simulation coordinate
    * @param y1 Y end simulation coordinate
    * @return this
    */
    line(x0, y0, x1, y1) {
        let v0 = this.plotter.computeForXYZ(x0, y0);
        let v1 = this.plotter.computeForXYZ(x1, y1);
        line(v0.x, v0.y, v1.x, v1.y);
        return this;
    }

    /**
    * Draw an ellipse
    * @param x X center simulation coordinate
    * @param y Y center simulation coordinate
    * @param rx X ellipse radius
    * @param ry Y ellipse radius
    * @param abs Are rx and ry in pixels (default false)
    * @return this
    */
    ellipse(x, y, rx, ry, abs = false) {
        let v0 = this.plotter.computeForXYZ(x, y);

        if(ry == undefined)
            ry = rx;

        if(!abs) {
            let v1 = this.plotter.computeForXYZ(rx, ry, 0, false);

            push();
                this.translate(x, y);
                ellipse(0, 0, v1.x * 2, v1.y * 2);
            pop();
        }
        else
            ellipse(v0.x, v0.y, rx, ry);
        
        return this;
    }

    /**
    * Draw a circle
    * @param x X center simulation coordinate
    * @param y Y center simulation coordinate
    * @param r Circle radius
    * @param abs Is r in pixels (default false)
    * @return this
    */
    circle(x, y, r, abs = false) {
    	return this.ellipse(x, y, r, r, abs);
    }

    /**
    * Draw a rectangle
    * @param x X bottom left simulation coordinate
    * @param y Y bottom left simulation coordinate
    * @param w Rectangle width
    * @param h Rectangle height
    * @param abs Are w and h in pixels (default false)
    * @return this
    */
    rect(x, y, w, h, abs = false) {
        if(!abs)
            return this.beginShape()
                    .vertex(x + w, y)
                    .vertex(x + w, y + h)
                    .vertex(x    , y + h)
                    .vertex(x    , y)
                .endShape(CLOSE);

        let v = this.plotter.computeForXYZ(x, y);
        rect(v.x, v.y, w, h);

        return this;
    }



    /**
    * Set stroke color
    * @param r Red value (0 to 255), or 'rgb(r, g, b)' or 'rgba(r, g, b, a)'
    * @param g Green value (0 to 255)
    * @param b Blue value (0 to 255)
    * @param a Alpha value (0 to 255)
    * @return this
    */
    stroke(r, g, b, a) {
        if(a == undefined) {
            if(b == undefined) {
                if(g == undefined)
                    stroke(r);
                else
                    stroke(r, g);
            }
            else
                stroke(r, g, b);
        }
        else
            stroke(`rgba(${r}, ${g}, ${b}, ${a})`);
        return this;
    }

    /**
    * Set stroke weight
    * @param n Stroke weight (integer)
    */
    strokeWeight(n) {
        strokeWeight(n);
        return this;
    }

    /**
    * Set fill color
    * @param r Red value (0 to 255), or 'rgb(r, g, b)' or 'rgba(r, g, b, a)'
    * @param g Green value (0 to 255)
    * @param b Blue value (0 to 255)
    * @param a Alpha value (0 to 255)
    * @return this
    */
    fill(r, g, b, a) {
        if(a == undefined) {
            if(b == undefined) {
                if(g == undefined)
                    fill(r);
                else
                    fill(r, g);
            }
            else
                fill(r, g, b);
        }
        else
            fill(`rgba(${r}, ${g}, ${b}, ${a})`);
        return this;
    }


    translate(x, y) {
        let v = this.plotter.computeForXYZ(x, y);
        translate(v.x, v.y);
        return this;
    }

    beginShape(TYPE) {
        beginShape(TYPE);
        return this;
    }

    endShape(TYPE) {
        endShape(TYPE);
        return this;
    }

    vertex(x, y) {
        let v = this.plotter.computeForXYZ(x, y);
        vertex(v.x, v.y);
        return this;
    }

    pop() {
        pop();
        return this;
    }

    push() {
        push();
        return this;
    }





    /** Remove stroke of the shape */
    noStroke() {
        noStroke();
        return this;
    }

    /** No fill the shape */
    noFill() {
        noFill();
        return this;
    }
}

export default pSDrawer;
