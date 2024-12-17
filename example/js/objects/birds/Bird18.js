import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(3230.6, 1854.9);
  ctx.bezierCurveTo(3225.1, 1846.8, 3219.0, 1838.2, 3212.6, 1830.5);
  ctx.bezierCurveTo(3208.1, 1824.0, 3203.8, 1816.8, 3196.6, 1813.1);
  ctx.bezierCurveTo(3191.0, 1810.7, 3185.8, 1814.8, 3183.2, 1819.5);
  ctx.bezierCurveTo(3173.1, 1827.9, 3171.1, 1831.5, 3185.9, 1834.2);
  ctx.bezierCurveTo(3184.0, 1844.0, 3188.0, 1854.8, 3196.7, 1860.1);
  ctx.lineTo(3196.4, 1872.2);
  ctx.bezierCurveTo(3193.6, 1872.4, 3193.7, 1876.7, 3196.5, 1876.7);
  ctx.bezierCurveTo(3199.0, 1876.3, 3215.1, 1879.0, 3216.5, 1876.5);
  ctx.bezierCurveTo(3218.5, 1870.3, 3211.7, 1872.2, 3208.2, 1872.0);
  ctx.bezierCurveTo(3208.0, 1870.6, 3208.1, 1865.5, 3208.3, 1864.0);
  ctx.bezierCurveTo(3213.5, 1864.2, 3219.0, 1863.2, 3223.5, 1860.9);
  ctx.bezierCurveTo(3226.2, 1859.3, 3231.4, 1859.5, 3230.6, 1854.9);
  ctx.closePath();

  // bird18/object/Compound Path/Path
  ctx.moveTo(3200.7, 1872.3);
  ctx.lineTo(3200.8, 1861.8);
  ctx.lineTo(3204.4, 1863.1);
  ctx.lineTo(3204.1, 1872.1);
  ctx.lineTo(3200.7, 1872.3);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird18', 'Bird 18', null, create, { x: 2600, y: 1290 }, 'fun');
