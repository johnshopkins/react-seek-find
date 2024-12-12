import { FindableObject } from '../../../src/js/main';

import thumbnail from '../../images/glove.png';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(2561.1, 1549.6);
  ctx.lineTo(2571.1, 1549.7);
  ctx.bezierCurveTo(2571.1, 1549.7, 2574.8, 1549.2, 2575.5, 1547.8);
  ctx.bezierCurveTo(2576.3, 1546.4, 2583.1, 1533.6, 2579.3, 1529.6);
  ctx.bezierCurveTo(2576.7, 1526.9, 2572.9, 1530.7, 2572.9, 1530.7);
  ctx.bezierCurveTo(2572.7, 1521.1, 2564.6, 1518.9, 2563.6, 1523.9);
  ctx.bezierCurveTo(2561.6, 1521.4, 2557.3, 1522.2, 2558.1, 1526.4);
  ctx.bezierCurveTo(2553.0, 1523.5, 2546.0, 1530.4, 2561.1, 1549.6);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('glove', 'Glove', thumbnail, create, { x: 2320, y: 1120 }, 'fun');
