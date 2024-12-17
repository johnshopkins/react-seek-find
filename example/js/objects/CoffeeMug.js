import { FindableObject } from '../../../src/js/main';

import thumbnail from '../../images/coffeemug.png';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(3257.0, 759.2);
  ctx.bezierCurveTo(3257.0, 759.2, 3256.9, 767.2, 3257.1, 774.8);
  ctx.bezierCurveTo(3257.2, 782.2, 3259.5, 782.9, 3266.5, 783.2);
  ctx.bezierCurveTo(3273.6, 783.5, 3278.1, 782.3, 3279.2, 772.2);
  ctx.bezierCurveTo(3280.4, 762.0, 3281.2, 752.7, 3281.2, 752.7);
  ctx.bezierCurveTo(3281.2, 752.7, 3284.2, 752.7, 3286.6, 749.1);
  ctx.bezierCurveTo(3289.1, 745.5, 3288.0, 741.6, 3288.0, 741.6);
  ctx.bezierCurveTo(3291.2, 740.8, 3294.1, 739.6, 3294.8, 736.3);
  ctx.bezierCurveTo(3295.5, 733.0, 3293.6, 730.1, 3292.7, 729.2);
  ctx.bezierCurveTo(3291.8, 728.4, 3290.9, 726.3, 3291.7, 724.1);
  ctx.bezierCurveTo(3292.4, 721.9, 3288.2, 718.1, 3284.9, 715.9);
  ctx.bezierCurveTo(3284.9, 711.4, 3281.6, 707.4, 3277.6, 707.6);
  ctx.bezierCurveTo(3273.6, 707.9, 3267.9, 708.8, 3265.7, 714.8);
  ctx.bezierCurveTo(3265.0, 716.9, 3265.7, 718.4, 3265.7, 718.4);
  ctx.bezierCurveTo(3265.7, 718.4, 3261.9, 718.8, 3260.1, 722.5);
  ctx.bezierCurveTo(3258.3, 726.1, 3260.0, 728.8, 3260.0, 728.8);
  ctx.bezierCurveTo(3260.0, 728.8, 3257.6, 730.3, 3257.1, 733.3);
  ctx.bezierCurveTo(3256.6, 736.4, 3257.7, 737.0, 3257.6, 739.4);
  ctx.bezierCurveTo(3257.4, 741.8, 3257.6, 744.6, 3259.5, 746.5);
  ctx.bezierCurveTo(3259.7, 749.4, 3259.6, 750.6, 3259.6, 750.6);
  ctx.bezierCurveTo(3256.4, 751.5, 3257.0, 759.2, 3257.0, 759.2);
  ctx.closePath();
  return ctx;
}

export default new FindableObject('coffeemug', 'Coffee mug', thumbnail, create, { x: 3000, y: 284 }, 'fun');
