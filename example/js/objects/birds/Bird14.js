import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(3423.1, 818.7);
  ctx.bezierCurveTo(3422.7, 816.6, 3421.4, 815.2, 3420.3, 813.5);
  ctx.bezierCurveTo(3419.2, 811.7, 3418.4, 809.5, 3417.4, 807.6);
  ctx.bezierCurveTo(3415.4, 803.6, 3413.4, 799.5, 3411.4, 795.5);
  ctx.bezierCurveTo(3410.5, 793.6, 3409.6, 791.8, 3408.1, 790.4);
  ctx.bezierCurveTo(3405.7, 788.4, 3402.1, 788.0, 3399.0, 788.7);
  ctx.bezierCurveTo(3396.0, 789.4, 3393.2, 791.0, 3390.4, 792.7);
  ctx.bezierCurveTo(3389.4, 793.3, 3388.7, 794.5, 3389.0, 795.7);
  ctx.bezierCurveTo(3389.5, 797.3, 3391.6, 798.1, 3392.0, 799.8);
  ctx.bezierCurveTo(3392.1, 800.1, 3392.1, 800.4, 3392.1, 800.7);
  ctx.bezierCurveTo(3392.1, 800.8, 3392.1, 800.9, 3392.1, 800.9);
  ctx.bezierCurveTo(3392.1, 801.1, 3392.1, 801.3, 3392.1, 801.5);
  ctx.bezierCurveTo(3392.2, 802.7, 3392.1, 803.8, 3392.0, 805.1);
  ctx.bezierCurveTo(3392.0, 806.8, 3392.0, 808.5, 3392.3, 810.2);
  ctx.bezierCurveTo(3392.4, 810.9, 3392.5, 811.6, 3392.7, 812.3);
  ctx.bezierCurveTo(3393.0, 813.6, 3393.5, 814.8, 3394.1, 815.9);
  ctx.bezierCurveTo(3394.5, 816.8, 3394.8, 817.6, 3395.4, 818.4);
  ctx.bezierCurveTo(3395.8, 819.0, 3396.2, 819.6, 3396.7, 820.2);
  ctx.bezierCurveTo(3398.4, 821.9, 3400.5, 823.3, 3402.7, 824.2);
  ctx.bezierCurveTo(3402.8, 825.4, 3402.7, 827.0, 3402.8, 828.2);
  ctx.bezierCurveTo(3402.5, 829.0, 3402.0, 829.5, 3402.3, 830.3);
  ctx.bezierCurveTo(3402.6, 830.9, 3402.9, 831.3, 3403.6, 831.4);
  ctx.bezierCurveTo(3404.2, 831.5, 3405.0, 831.7, 3405.7, 831.7);
  ctx.bezierCurveTo(3406.9, 831.6, 3408.1, 831.6, 3409.3, 831.8);
  ctx.bezierCurveTo(3410.1, 831.9, 3410.9, 831.9, 3411.6, 831.9);
  ctx.bezierCurveTo(3412.3, 831.9, 3413.0, 831.7, 3413.7, 831.7);
  ctx.bezierCurveTo(3415.0, 831.6, 3416.3, 832.2, 3417.6, 831.9);
  ctx.bezierCurveTo(3418.3, 831.8, 3419.2, 831.5, 3419.6, 831.0);
  ctx.bezierCurveTo(3420.0, 830.5, 3420.1, 829.8, 3420.0, 829.2);
  ctx.bezierCurveTo(3419.8, 828.2, 3418.6, 827.7, 3417.6, 827.7);
  ctx.lineTo(3411.7, 827.7);
  ctx.lineTo(3411.7, 825.7);
  ctx.bezierCurveTo(3416.0, 825.8, 3417.0, 825.2, 3419.8, 824.4);
  ctx.bezierCurveTo(3420.2, 824.2, 3420.7, 824.1, 3421.1, 823.9);
  ctx.bezierCurveTo(3422.9, 822.9, 3423.5, 820.6, 3423.1, 818.7);
  ctx.closePath();

  // bird14/object/Compound Path/Path
  ctx.moveTo(3409.0, 827.8);
  ctx.lineTo(3406.2, 827.8);
  ctx.lineTo(3406.2, 825.4);
  ctx.lineTo(3409.0, 825.4);
  ctx.lineTo(3409.0, 827.8);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird14', 'Bird 14', null, create, { x: 2740, y: 370 }, 'fun');
