import { FindableObject } from '../../../src/js/main';

import thumbnail from '../../images/jay.png';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(3498.2, 733.5);
  ctx.bezierCurveTo(3498.2, 733.5, 3520.1, 727.4, 3523.3, 726.6);
  ctx.bezierCurveTo(3526.6, 725.7, 3528.3, 720.8, 3527.1, 716.0);
  ctx.bezierCurveTo(3526.0, 711.2, 3523.3, 697.9, 3522.3, 690.7);
  ctx.bezierCurveTo(3521.3, 683.5, 3518.2, 668.1, 3511.2, 669.8);
  ctx.bezierCurveTo(3504.1, 671.5, 3500.6, 677.6, 3503.1, 690.2);
  ctx.bezierCurveTo(3496.5, 689.3, 3486.2, 693.0, 3487.2, 706.4);
  ctx.bezierCurveTo(3488.2, 719.8, 3490.7, 727.7, 3492.1, 731.1);
  ctx.bezierCurveTo(3493.5, 734.5, 3495.8, 733.9, 3498.2, 733.5);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('foamfinger', 'Foam finger', thumbnail, create, { x: 3000, y: 625 }, 'fun');
