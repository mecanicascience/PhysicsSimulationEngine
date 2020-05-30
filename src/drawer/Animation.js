import pSInterpolation  from './animations/pSInterpolation';
import pSEaseInOutCubic from './animations/pSEaseInOutCubic';

class Animation {
    /**
    * Creates a new animation
    * @param animationName Name of the animation ('easeInOutCubic', 'interpolation')
    * @param timeLength Length of the animation in seconds (default : 1)
    * @param datas Optional parameter (see specific animation for animation informations)
    */
    static new(animationName, timeLength = 1, datas = {}) {
        if(!animationName)
            animationName = 'easeInOutCubic';

        switch (animationName) {
            case 'easeInOutCubic':
                return new pSEaseInOutCubic(timeLength, datas);
                break;

            case 'interpolation':
                return new pSInterpolation(timeLength, datas);
        }
    }
}

export default Animation;
