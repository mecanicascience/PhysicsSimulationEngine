class Animation {
    constructor(animationName, scaleTime = 0.1) {
        if(!animationName)
            animationName = 'linear';

        switch (animationName) {
            case 'linear':
                this.f = (t) => t;
                break;

            case 'easeInOutCubic':
                this.f = (function(t) {
                    if ((t /= 0.5) < 1)
                        return 0.5 * t * t;
                    return -0.5 * ((--t) * (t - 2) - 1);
                });
                break;
        }

        this.scaleTime   = scaleTime;
        this.isAnimating = false;
        this.initialT    = 0;

        this.timeDirection = 1; // 1 or -1
    }

    start() {
        this.isAnimating = true;
        this.initialT    = (new Date()).getTime() / 1000;
    }

    stop() {
        this.isAnimating = false;
        this.initialT    = 0;
    }

    reverse() {
        this.timeDirection *= -1;
    }

    nextKey() {
        let t = (new Date()).getTime();
        let dt = t / 1000 - this.initialT;
        if(this.timeDirection < 0)
            dt = t;

        if((dt > 1 * this.scaleTime && this.timeDirection > 0) || (dt < 1 * this.scaleTime && this.timeDirection < 0))
            return this.lastKey;
        this.lastKey = this.f(dt) / this.scaleTime;

        return this.lastKey;
    }
}
