class pSAnimationHandler {
    /**
    * Creates a new abstract animation
    * @param timeLength Length of the animation in seconds
    * @param datas Custom animation datas
    */
    constructor(timeLength, datas) {
        this.scaleTime   = 1;
        this.isAnimating = false;
        this.initialT    = 0;
        this.datas       = datas;
        this.timeLength  = timeLength;
        this.lastKey     = this.getKey(this.update) / this.scaleTime;
    }

    /** Start (or restart) the current animation */
    start() {
        this.isAnimating = true;
        this.initialT    = (new Date()).getTime() / 1000;
    }

    /** Stop the current animation */
    stop() {
        this.isAnimating = false;
        this.initialT    = 0;
    }

    /**
    * @param f Current drawing animation function
    * @return f(dt)
    */
    getKey(f) {
        let dt = (new Date()).getTime() / 1000 - this.initialT;

        if(dt > this.timeLength)
            return this.finalDraw(this);

        this.lastKey = f(dt, this) / this.scaleTime;

        return this.lastKey;
    }

    /** @return the current update key */
    updateKey() { return this.getKey(this.update); }
    /** @return the current draw key */
    drawKey  () { return this.getKey(this.draw  ); }

    /** Update loop for overwriting */
    update() {}
    /** Draw loop for overwriting */
    draw  () {}
}

export default pSAnimationHandler;
