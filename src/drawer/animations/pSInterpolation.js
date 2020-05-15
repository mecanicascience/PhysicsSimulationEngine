import pSAnimationHandler from './pSAnimationHandler';

class pSInterpolation extends pSAnimationHandler {
    constructor(timeLength, datas) {
        super(timeLength, datas);

        this.i = -1;
        this.currentShape = this.nextShape(datas);

        this.localDt = 0;
    }

    nextShape(points) {
        this.i++;

        let j = this.i + 1;
        if(j > points.length - 1)
            j = 0;

        return [points[this.i], points[j]];
    }

    update(dt, t) { }

    draw(dt, t) {
        let c = t.timeLength / t.datas.length;
        if(!(t.currentShape[0] == undefined || t.currentShape[1] == undefined)) {
            if(dt - t.localDt >= c) {
                t.currentShape = t.nextShape(t.datas);
                t.localDt += c;
            }
        }

        t.drawCurrentShape(
            t.datas,
            (i, lt, ti, c) => {
                let percent = 1;
                if(i == ti)
                    percent = lt / c;
                return percent;
            }, t, t.i + 1, dt - t.localDt, c);
    }

    finalDraw() {
        this.drawCurrentShape(this.datas, () => 1, this, this.datas.length, 0);
    }


    drawCurrentShape(d, percentFunction, t, maxI, lt, c) {
        for (let i = 0; i < maxI; i++) {
            let percent = percentFunction(i, lt, t.i, c);

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
