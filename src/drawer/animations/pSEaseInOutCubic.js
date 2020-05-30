import pSAnimationHandler from './pSAnimationHandler';

class pSEaseInOutCubic extends pSAnimationHandler {
    /**
    * Ease in and out cubic animation
    * @param timeLength Duration of the animation in seconds
    * @param datas Minimum and maximum values '{ min : 0, max : 1 }'
    */
    constructor(timeLength, datas) {
        super(timeLength, datas);

        if(this.datas.min == undefined)
            this.datas.min = 0;
        if(this.datas.max == undefined)
            this.datas.max = 1;
    }

    /**
    * @param time Current time of the animation
    * @param th current pSEaseInOutCubic instance
    * @return the corresponding key
    */
    update(time, th) {
        let t = time / th.timeLength;
        if(t < 0.5)
            return (2 * t * t) * (th.datas.max - th.datas.min) + th.datas.min;
        return (-1 + (4 - 2 * t) * t) * (th.datas.max - th.datas.min) + th.datas.min;
    }

    /**
    * @param time Current time of the animation
    * @param th current pSEaseInOutCubic instance
    * @return the corresponding draw key
    */
    draw(dt, t) { }

    /**
    * Draw the final animation
    * @param th current pSEaseInOutCubic instance
    */
    finalDraw(th) {
        return th.datas.max;
    }
}

export default pSEaseInOutCubic;
