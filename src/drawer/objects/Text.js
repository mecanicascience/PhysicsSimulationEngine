class Text {
    constructor(text, pos, textSize = 18, color = "#FFFFFF", showHitbox = false) {
        this.text     = text;
        this.textSize = textSize;
        this.color    = color;

        this.pos     = pos;
        this.xOffset = 0;
        this.yOffset = 0;

        this.showHitbox = showHitbox;

        this.calculateValues();
    }


    draw() {
        let drawer = _pSimulationInstance.plotter.drawer;
        let pos    = drawer.plotter.computeForXY(this.pos.x, this.pos.y);

        push();
            textSize(this.textSize);
            drawer
                .noStroke()
                .fill(this.color);

            translate(-this.cWidth / 2 + this.xOffset, (-this.desc + this.asc) / 2 + this.yOffset);
            text(this.text, pos.x, pos.y);

            if(this.showHitbox) {
                drawer
                    .stroke(this.color)
                    .strokeWeight(1)
                    .noFill();
                line(pos.x              , pos.y - this.asc , pos.x + this.cWidth, pos.y - this.asc);
                line(pos.x              , pos.y + this.desc, pos.x + this.cWidth, pos.y + this.desc);
                line(pos.x              , pos.y + this.desc, pos.x              , pos.y - this.asc);
                line(pos.x + this.cWidth, pos.y + this.desc, pos.x + this.cWidth, pos.y - this.asc);
            }
        pop();
    }



    calculateValues() {
        let scalar = 0.8; // Different for each font

        textSize(this.textSize);

        this.asc    = textAscent () * scalar;
        this.desc   = textDescent() * scalar;
        this.cWidth = textWidth(this.text);
    }

    setText(text) {
        this.text = text;
        this.calculateValues();
        return this;
    }

    setPosition(x, y) {
        this.pos.x = x;
        this.pos.y = y;
        return this;
    }

    setOffset(x, y) {
        this.xOffset = x;
        this.yOffset = y;
        return this;
    }

    setColor(color) {
        this.color = color;
        return this;
    }
}

export default Text;
