import { FindableObject } from '../../../src/js/main';

import thumbnail from '../../images/jay.png';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(3679.9, 1743.3);
  ctx.bezierCurveTo(3679.9, 1756.8, 3669.1, 1767.7, 3655.8, 1767.7);
  ctx.bezierCurveTo(3642.5, 1767.7, 3631.7, 1756.8, 3631.7, 1743.3);
  ctx.bezierCurveTo(3631.7, 1729.8, 3642.5, 1718.8, 3655.8, 1718.8);
  ctx.bezierCurveTo(3669.1, 1718.8, 3679.9, 1729.8, 3679.9, 1743.3);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('basketball', 'Basketball', thumbnail, create, { x: 3000, y: 1220 }, 'fun');
