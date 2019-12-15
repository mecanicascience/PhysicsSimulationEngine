class pSDrawer {
    constructor(plotter) {
        this.plotter = null; // set when loaded in the Plotter class
    }

    point(x, y) {
        let v = this.plotter.computeForXY(x, y);
        point(v.x, v.y);
        return this;
    }

    ellipse(x, y, rx, ry) {
        let v = this.plotter.computeForXY(x, y);
        ellipse(v.x, v.y, rx, ry);
        return this;
    }




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


    noStroke() {
        noStroke();
        return this;
    }

    noFill() {
        noFill();
        return this;
    }
}
