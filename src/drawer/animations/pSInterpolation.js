import pSAnimationHandler from './pSAnimationHandler';

class pSInterpolation extends pSAnimationHandler {
    /**
    * Interpolation animation
    * @param timeLength Duration of the animation in seconds
    * @param datas The datas to be interpolated '[Point1, Point2, ...]'
    */
    constructor(timeLength, datas) {
        super(timeLength, datas);

        this.i = -1;
        this.currentShape = this.nextShape(datas);

        this.localDt = 0;
    }

    /** Set shape based on animation and points */
    nextShape(points) {
        this.i++;

        let j = this.i + 1;
        if(j > points.length - 1)
            j = 0;

        return [points[this.i], points[j]];
    }

    /**
    * @param time Current time of the animation
    * @param th current pSEaseInOutCubic instance
    * @return the corresponding update key
    */
    update(dt, th) { }

    /**
    * @param time Current time of the animation
    * @param th current pSEaseInOutCubic instance
    * @return the corresponding draw key
    */
    draw(dt, th) {
        let c = th.timeLength / th.datas.length;
        if(!(th.currentShape[0] == undefined || th.currentShape[1] == undefined)) {
            if(dt - th.localDt >= c) {
                th.currentShape = th.nextShape(th.datas);
                th.localDt += c;
            }
        }

        th.drawCurrentShape(
            th.datas,
            (i, lt, ti, c) => {
                let percent = 1;
                if(i == ti)
                    percent = lt / c;
                return percent;
            }, th, th.i + 1, dt - th.localDt, c);
    }

    /**
    * Draw the final animation
    * @param th current pSEaseInOutCubic instance
    */
    finalDraw(th) {
        this.drawCurrentShape(this.datas, () => 1, this, this.datas.length, 0);
    }

    /**
    * Draw current shape on screen
    * @param d this.datas
    * @param percentFunction Current animation get percent function
    * @param th current pSEaseInOutCubic instance
    * @param maxI Max points count
    * @param lt Current time value
    * @param c Final time value / max points count
    */
    drawCurrentShape(d, percentFunction, th, maxI, lt, c) {
        for (let i = 0; i < maxI; i++) {
            let percent = percentFunction(i, lt, th.i, c);

            let n = i + 1;
            if(n >= d.length) n = 0;

            _pSimulationInstance.plotter.drawer
                .noFill()
                .strokeWeight(3)
                .stroke(255)
                .line(
                    d[i].pos.x,
                    d[i].pos.y,
                    d[i].pos.x + (d[n].pos.x - d[i].pos.x) * percent,
                    d[i].pos.y + (d[n].pos.y - d[i].pos.y) * percent
                );
        }
    }
}

export default pSInterpolation;
