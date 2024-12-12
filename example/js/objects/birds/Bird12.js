import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(1460.2, 89.9);
  ctx.bezierCurveTo(1459.0, 89.9, 1457.8, 89.8, 1456.6, 89.6);
  ctx.bezierCurveTo(1456.3, 89.6, 1456.0, 89.5, 1455.8, 89.4);
  ctx.bezierCurveTo(1455.2, 89.1, 1455.1, 88.3, 1455.1, 87.6);
  ctx.bezierCurveTo(1455.2, 86.7, 1455.5, 85.8, 1455.9, 85.0);
  ctx.bezierCurveTo(1457.1, 82.8, 1459.1, 81.0, 1461.5, 80.2);
  ctx.bezierCurveTo(1464.0, 79.4, 1466.7, 79.6, 1468.9, 80.8);
  ctx.bezierCurveTo(1472.6, 82.6, 1474.7, 86.5, 1477.5, 89.4);
  ctx.bezierCurveTo(1479.9, 91.9, 1482.4, 94.2, 1485.0, 96.3);
  ctx.bezierCurveTo(1485.5, 96.8, 1486.0, 97.2, 1486.6, 97.6);
  ctx.bezierCurveTo(1487.1, 98.0, 1487.6, 98.5, 1488.1, 98.9);
  ctx.bezierCurveTo(1488.6, 99.3, 1489.1, 99.8, 1489.5, 100.2);
  ctx.bezierCurveTo(1490.1, 100.7, 1490.3, 101.4, 1490.3, 102.2);
  ctx.bezierCurveTo(1490.4, 103.0, 1490.2, 103.9, 1490.0, 104.6);
  ctx.bezierCurveTo(1489.7, 104.5, 1489.4, 104.5, 1489.1, 104.4);
  ctx.bezierCurveTo(1489.1, 105.1, 1488.9, 105.7, 1488.5, 106.2);
  ctx.bezierCurveTo(1488.1, 106.7, 1487.6, 107.2, 1487.0, 107.6);
  ctx.bezierCurveTo(1486.6, 107.9, 1486.1, 108.2, 1485.6, 108.5);
  ctx.bezierCurveTo(1485.1, 108.7, 1484.6, 109.0, 1484.1, 109.2);
  ctx.bezierCurveTo(1482.1, 110.1, 1480.0, 110.6, 1477.7, 110.6);
  ctx.lineTo(1477.7, 115.7);
  ctx.lineTo(1474.6, 115.6);
  ctx.lineTo(1474.6, 110.6);
  ctx.bezierCurveTo(1473.3, 110.5, 1471.4, 109.8, 1471.4, 109.8);
  ctx.lineTo(1471.5, 115.7);
  ctx.lineTo(1468.3, 116.0);
  ctx.bezierCurveTo(1468.3, 116.0, 1467.9, 112.2, 1468.0, 108.1);
  ctx.bezierCurveTo(1465.3, 106.9, 1463.3, 104.6, 1462.1, 101.9);
  ctx.bezierCurveTo(1461.9, 101.4, 1461.6, 100.8, 1461.5, 100.2);
  ctx.bezierCurveTo(1461.3, 99.7, 1461.1, 99.1, 1460.9, 98.6);
  ctx.bezierCurveTo(1460.8, 98.0, 1460.6, 97.5, 1460.5, 96.9);
  ctx.bezierCurveTo(1460.4, 96.3, 1460.3, 95.8, 1460.2, 95.2);
  ctx.bezierCurveTo(1460.2, 94.6, 1460.2, 94.0, 1460.2, 93.4);
  ctx.bezierCurveTo(1460.1, 92.8, 1460.1, 92.2, 1460.2, 91.6);
  ctx.bezierCurveTo(1460.2, 91.0, 1460.2, 90.5, 1460.2, 89.9);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird12', 'Bird 12', null, create, { x: 1448, y: 0 }, 'fun');
