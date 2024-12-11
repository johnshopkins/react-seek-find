import { FindableObject } from '../../../src/js/main';

import thumbnail from '../../images/seal.png';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(811.0, 1494.3);
  ctx.bezierCurveTo(805.0, 1531.0, 850.6, 1551.9, 881.6, 1537.9);
  ctx.bezierCurveTo(886.0, 1514.3, 855.0, 1480.6, 811.0, 1494.3);
  ctx.closePath();
  
  return ctx;
}

export default new FindableObject('seal', 'Seal', thumbnail, create, { x: 376, y: 1036 }, 'jhu');
