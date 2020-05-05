class Plot {
    constructor() {
        this.points = [];
        for (let i = 0; i < 100; i++) {
            this.points.push(new Point(
                random(0, 20) - 10,
                random(0, 20) - 10,
                [random(0, 255), random(0, 255), random(0, 255)]
            ));
        }
    }

    update(dt) {
        this.updateHover();
        console.log(dt);
    }

    draw() {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].draw();
        }
    }

    updateHover() {
        if(mouseX != 0 && mouseY != 0) {
            for (let i = 0; i < this.points.length; i++) {
                let v1 = this.calculateAbsoluteForXY(mouseX - 6, mouseY + 6);
                let v2 = this.calculateAbsoluteForXY(mouseX + 6, mouseY - 6);
                this.points[i].handleMouseOver(v1.x, v2.x, v1.y, v2.y);
            }
        }
    }

    calculateAbsoluteForXY(x, y) {
        let c = _pSimulationInstance.config.engine.plotter;
        let v = new Vector(((x * 2) / width - 1) * c.scale.x - c.offset.x);

        if(!c.scale.squareByX)
            v.y =  -(((y * 2) / height - 1) * c.scale.y - c.offset.y);
        else
            v.y = -((((y - 2 * height) * 2) / width) * c.scale.y - c.offset.y);

        return v;
    }
}
