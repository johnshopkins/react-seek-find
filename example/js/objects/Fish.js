import { FindableObject } from '../../../src/js/main';

import thumbnail from '../../images/fish.png';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(1909.3, 1483.0);
  ctx.bezierCurveTo(1905.2, 1464.2, 1906.9, 1457.4, 1909.8, 1449.7);
  ctx.bezierCurveTo(1912.8, 1441.9, 1913.3, 1442.7, 1914.5, 1442.7);
  ctx.bezierCurveTo(1915.8, 1442.6, 1922.2, 1444.4, 1928.5, 1453.9);
  ctx.bezierCurveTo(1934.8, 1463.4, 1934.7, 1473.5, 1935.1, 1483.2);
  ctx.bezierCurveTo(1931.5, 1483.5, 1929.3, 1483.5, 1929.3, 1483.5);
  ctx.lineTo(1929.2, 1485.9);
  ctx.bezierCurveTo(1929.2, 1485.9, 1929.0, 1486.9, 1927.8, 1486.9);
  ctx.bezierCurveTo(1926.5, 1486.9, 1927.0, 1486.5, 1926.4, 1486.6);
  ctx.bezierCurveTo(1925.8, 1486.7, 1925.8, 1487.7, 1924.6, 1487.7);
  ctx.bezierCurveTo(1923.3, 1487.7, 1922.3, 1486.9, 1921.4, 1487.1);
  ctx.bezierCurveTo(1920.5, 1487.3, 1919.6, 1487.9, 1918.2, 1487.9);
  ctx.bezierCurveTo(1916.9, 1487.9, 1915.7, 1486.7, 1915.7, 1486.4);
  ctx.bezierCurveTo(1915.7, 1486.0, 1916.0, 1486.0, 1916.0, 1485.3);
  ctx.bezierCurveTo(1916.1, 1484.6, 1916.1, 1483.6, 1915.3, 1483.2);
  ctx.bezierCurveTo(1914.2, 1483.1, 1909.3, 1483.0, 1909.3, 1483.0);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('fish', 'Fish', thumbnail, create, { x: 1750, y: 1100 }, 'fun');
