class pSAnimationHandler {
    constructor(timeLength, datas) {
        this.scaleTime   = 1;
        this.isAnimating = false;
        this.initialT    = 0;
        this.datas       = datas;
        this.timeLength  = timeLength;
        this.lastKey     = this.getKey(this.update) / this.scaleTime;
    }

    start() {
        this.isAnimating = true;
        this.initialT    = (new Date()).getTime() / 1000;
    }

    stop() {
        this.isAnimating = false;
        this.initialT    = 0;
    }

    getKey(f) {
        let dt = (new Date()).getTime() / 1000 - this.initialT;

        if(dt > this.timeLength)
            return this.finalDraw(this);

        this.lastKey = f(dt, this) / this.scaleTime;

        return this.lastKey;
    }

    updateKey() { return this.getKey(this.update); }
    drawKey  () { return this.getKey(this.draw  ); }


    update() {}
    draw  () {}
}

export default pSAnimationHandler;
