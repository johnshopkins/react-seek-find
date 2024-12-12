import { FindableObject } from '../../../src/js/main';

import thumbnail from '../../images/fish.png';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(1914.7, 1442.0);
  ctx.bezierCurveTo(1907.8, 1444.9, 1905.6, 1461.7, 1907.9, 1481.9);
  ctx.bezierCurveTo(1907.9, 1482.0, 1916.1, 1482.9, 1916.1, 1482.9);
  ctx.bezierCurveTo(1915.4, 1487.6, 1918.7, 1489.8, 1922.0, 1486.0);
  ctx.bezierCurveTo(1923.5, 1488.5, 1925.7, 1486.5, 1925.7, 1486.5);
  ctx.bezierCurveTo(1929.9, 1488.4, 1929.3, 1483.1, 1929.3, 1483.1);
  ctx.bezierCurveTo(1930.7, 1483.0, 1932.6, 1482.5, 1934.3, 1483.1);
  ctx.bezierCurveTo(1936.0, 1450.7, 1918.6, 1443.0, 1914.7, 1442.0);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('fish', 'Fish', thumbnail, create, { x: 1670, y: 1040 }, 'fun');
