import pSInterpolation  from './animations/pSInterpolation';
import pSEaseInOutCubic from './animations/pSEaseInOutCubic';

class Animation {
    static new(animationName, timeLength = 1, datas = {}) {
        if(!animationName)
            animationName = 'linear';

        switch (animationName) {
            // case 'linear':
            //     this.f = (t) => t;
            //     break;
            //
            case 'easeInOutCubic':
                return new pSEaseInOutCubic(timeLength, datas);
                break;

            case 'interpolation':
                return new pSInterpolation(timeLength, datas);
        }
    }
}

export default Animation;
