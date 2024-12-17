import { FindableObject } from '../../../src/js/main';

import thumbnail from '../../images/glove.png';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(2576.8, 1529.2);
  ctx.bezierCurveTo(2585.2, 1529.3, 2577.2, 1544.3, 2575.5, 1548.4);
  ctx.bezierCurveTo(2570.3, 1549.6, 2562.4, 1552.2, 2558.5, 1547.3);
  ctx.bezierCurveTo(2556.3, 1542.1, 2545.1, 1524.1, 2558.4, 1527.0);
  ctx.bezierCurveTo(2556.9, 1524.1, 2561.2, 1522.2, 2563.3, 1524.2);
  ctx.bezierCurveTo(2565.5, 1519.1, 2571.8, 1524.0, 2572.4, 1527.8);
  ctx.bezierCurveTo(2572.6, 1529.2, 2572.5, 1530.0, 2572.9, 1530.8);
  ctx.bezierCurveTo(2573.6, 1530.3, 2575.1, 1529.8, 2576.8, 1529.2);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('glove', 'Glove', thumbnail, create, { x: 2320, y: 1120 }, 'fun');
