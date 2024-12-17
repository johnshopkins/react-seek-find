import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(1460.2, 89.9);
  ctx.bezierCurveTo(1451.0, 91.2, 1456.3, 81.6, 1461.5, 80.2);
  ctx.bezierCurveTo(1468.8, 77.7, 1473.4, 84.6, 1477.5, 89.4);
  ctx.bezierCurveTo(1480.6, 94.3, 1492.1, 98.5, 1490.0, 104.6);
  ctx.bezierCurveTo(1489.7, 104.5, 1489.4, 104.5, 1489.1, 104.4);
  ctx.bezierCurveTo(1488.2, 108.9, 1481.8, 110.4, 1477.7, 110.6);
  ctx.lineTo(1477.7, 115.7);
  ctx.lineTo(1474.6, 115.6);
  ctx.lineTo(1474.6, 110.6);
  ctx.bezierCurveTo(1473.3, 110.5, 1471.4, 109.8, 1471.4, 109.8);
  ctx.lineTo(1471.5, 115.7);
  ctx.lineTo(1468.3, 116.0);
  ctx.bezierCurveTo(1468.3, 116.0, 1467.9, 112.2, 1468.0, 108.1);
  ctx.bezierCurveTo(1461.3, 105.0, 1459.8, 96.5, 1460.2, 89.9);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird12', 'Bird 12', null, create, { x: 1448, y: 0 }, 'fun');
