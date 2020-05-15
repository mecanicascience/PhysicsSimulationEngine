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
        //console.log(dt);
    }

    draw() {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].draw();
        }
    }

    updateHover() {
        if(mouseX != 0 && mouseY != 0) {
            for (let i = 0; i < this.points.length; i++) {
                let v1 = _pSimulationInstance.plotter.computeForXYFromPixel(mouseX - 6, mouseY + 6);
                let v2 = _pSimulationInstance.plotter.computeForXYFromPixel(mouseX + 6, mouseY - 6);
                this.points[i].handleMouseOver(v1.x, v2.x, v1.y, v2.y);
            }
        }
    }
}
