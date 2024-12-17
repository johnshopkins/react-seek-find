import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(3423.1, 818.7);
  ctx.bezierCurveTo(3419.3, 811.0, 3415.1, 803.3, 3411.4, 795.5);
  ctx.bezierCurveTo(3409.6, 790.3, 3404.5, 787.2, 3399.0, 788.7);
  ctx.bezierCurveTo(3395.8, 790.0, 3388.9, 791.4, 3389.0, 795.7);
  ctx.bezierCurveTo(3389.7, 797.6, 3392.4, 798.6, 3392.1, 800.9);
  ctx.bezierCurveTo(3391.3, 809.9, 3393.2, 820.7, 3402.7, 824.2);
  ctx.bezierCurveTo(3403.1, 826.3, 3402.4, 828.4, 3402.3, 830.3);
  ctx.bezierCurveTo(3404.3, 832.8, 3408.7, 831.2, 3411.6, 831.9);
  ctx.bezierCurveTo(3414.2, 831.1, 3417.3, 833.0, 3419.6, 831.0);
  ctx.bezierCurveTo(3422.2, 826.5, 3413.9, 828.0, 3411.7, 827.7);
  ctx.lineTo(3411.7, 825.7);
  ctx.bezierCurveTo(3417.4, 825.4, 3423.9, 825.1, 3423.1, 818.7);
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
