import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(2421.7, 1874.0);
  ctx.bezierCurveTo(2428.2, 1873.1, 2440.2, 1867.7, 2434.4, 1859.9);
  ctx.bezierCurveTo(2426.8, 1850.3, 2420.5, 1839.4, 2411.6, 1830.9);
  ctx.bezierCurveTo(2405.4, 1825.6, 2396.8, 1830.1, 2390.8, 1833.6);
  ctx.bezierCurveTo(2387.1, 1835.6, 2382.6, 1837.8, 2385.7, 1842.7);
  ctx.bezierCurveTo(2387.3, 1845.7, 2392.3, 1844.4, 2393.7, 1847.4);
  ctx.bezierCurveTo(2394.3, 1852.9, 2396.1, 1859.2, 2399.7, 1863.6);
  ctx.bezierCurveTo(2401.0, 1868.1, 2404.5, 1870.8, 2408.9, 1872.1);
  ctx.bezierCurveTo(2409.1, 1875.1, 2408.1, 1878.9, 2409.6, 1881.6);
  ctx.bezierCurveTo(2414.9, 1885.3, 2413.1, 1876.8, 2413.1, 1873.9);
  ctx.bezierCurveTo(2414.3, 1874.5, 2415.7, 1874.7, 2417.1, 1874.6);
  ctx.bezierCurveTo(2417.4, 1877.1, 2415.3, 1882.3, 2419.2, 1882.7);
  ctx.bezierCurveTo(2423.2, 1882.8, 2421.4, 1876.6, 2421.7, 1874.0);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird19', 'Bird 19', null, create, { x: 2225, y: 1140 }, 'fun');
