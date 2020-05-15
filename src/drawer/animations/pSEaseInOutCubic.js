import pSAnimationHandler from './pSAnimationHandler';

class pSInterpolation extends pSAnimationHandler {
    constructor(timeLength, datas) {
        super(timeLength, datas);
    }

    update(dt, t) {
        if ((dt /= 0.5) < 1)
            return 0.5 * dt * dt;
        return -0.5 * ((--dt) * (dt - 2) - 1);
    }

    draw(dt, t) { }

    finalDraw() { }
}

export default pSInterpolation;
