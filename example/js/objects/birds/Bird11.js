import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(1420.3, 109.8);
  ctx.lineTo(1420.4, 116.0);
  ctx.lineTo(1423.8, 116.0);
  ctx.lineTo(1423.8, 110.1);
  ctx.bezierCurveTo(1425.6, 110.3, 1428.6, 109.6, 1428.6, 109.6);
  ctx.bezierCurveTo(1428.6, 109.6, 1428.4, 114.6, 1429.0, 116.0);
  ctx.bezierCurveTo(1430.3, 116.0, 1432.4, 116.0, 1432.4, 116.0);
  ctx.bezierCurveTo(1432.4, 115.4, 1432.4, 110.1, 1432.4, 108.8);
  ctx.bezierCurveTo(1440.0, 106.9, 1441.8, 97.2, 1440.7, 90.5);
  ctx.bezierCurveTo(1452.0, 87.7, 1437.9, 75.7, 1431.8, 81.0);
  ctx.bezierCurveTo(1423.9, 87.5, 1416.7, 95.2, 1410.9, 103.5);
  ctx.bezierCurveTo(1407.1, 109.4, 1416.5, 109.5, 1420.3, 109.8);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird11', 'Bird 11', null, create, { x: 705, y: 0 }, 'fun');
