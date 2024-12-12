import { FindableObject } from '../../../src/js/main';

import thumbnail from '../../images/seal.png';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(811.0, 1494.5);
  ctx.bezierCurveTo(805.0, 1531.1, 850.6, 1552.1, 881.6, 1538.1);
  ctx.bezierCurveTo(886.0, 1514.4, 855.0, 1480.8, 811.0, 1494.5);
  ctx.closePath();
  
  return ctx;
}

export default new FindableObject('seal', 'Seal', thumbnail, create, { x: 376, y: 1036 }, 'jhu');
