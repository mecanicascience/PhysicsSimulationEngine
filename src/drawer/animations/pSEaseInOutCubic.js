import pSAnimationHandler from './pSAnimationHandler';

class pSInterpolation extends pSAnimationHandler {
    constructor(timeLength, datas) {
        super(timeLength, datas);

        // datas = { min : 0, max : 1 }
        if(this.datas.min == undefined)
            this.datas.min = 0;
        if(this.datas.max == undefined)
            this.datas.max = 1;
    }

    update(dt, th) {
        let t = dt / th.timeLength;
        if(t < 0.5)
            return (2 * t * t) * (th.datas.max - th.datas.min) + th.datas.min;
        return (-1 + (4 - 2 * t) * t) * (th.datas.max - th.datas.min) + th.datas.min;
    }

    draw(dt, t) { }

    finalDraw(th) {
        return th.datas.max;
    }
}

export default pSInterpolation;
