import { FindableObject } from '../../../src/js/main';

import thumbnail from '../../images/jay.png';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(2968.4, 1527.7);
  ctx.bezierCurveTo(2967.2, 1520.5, 2967.8, 1517.3, 2973.0, 1517.0);
  ctx.bezierCurveTo(2978.2, 1516.7, 2992.4, 1515.3, 2992.4, 1515.3);
  ctx.bezierCurveTo(2992.4, 1515.3, 3002.4, 1514.6, 3005.1, 1513.9);
  ctx.bezierCurveTo(3007.7, 1513.2, 3011.3, 1513.3, 3012.4, 1518.1);
  ctx.bezierCurveTo(3013.5, 1522.9, 3016.5, 1537.3, 3018.1, 1542.0);
  ctx.bezierCurveTo(3019.6, 1546.7, 3020.0, 1551.2, 3012.7, 1551.2);
  ctx.bezierCurveTo(3012.1, 1555.5, 3004.8, 1560.5, 3001.1, 1561.3);
  ctx.bezierCurveTo(2997.4, 1562.2, 2985.3, 1561.9, 2983.7, 1559.6);
  ctx.bezierCurveTo(2982.2, 1557.4, 2980.8, 1555.1, 2980.8, 1555.1);
  ctx.bezierCurveTo(2976.4, 1555.4, 2975.0, 1556.8, 2972.7, 1547.1);
  ctx.bezierCurveTo(2970.5, 1537.3, 2968.4, 1527.7, 2968.4, 1527.7);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('mortarboard', '150th mortar board', thumbnail, create, { x: 2725, y: 1340 }, 'jhu');
