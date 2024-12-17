import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(3721.2, 1007.9);
  ctx.bezierCurveTo(3721.2, 1006.8, 3721.5, 1004.3, 3718.7, 1004.4);
  ctx.lineTo(3702.6, 1004.3);
  ctx.lineTo(3702.6, 1000.3);
  ctx.bezierCurveTo(3730.6, 1000.9, 3719.6, 985.5, 3708.6, 970.8);
  ctx.bezierCurveTo(3703.9, 964.9, 3701.6, 957.0, 3695.8, 952.2);
  ctx.bezierCurveTo(3683.9, 945.1, 3676.6, 947.9, 3668.3, 958.2);
  ctx.bezierCurveTo(3668.8, 961.6, 3672.8, 963.2, 3675.5, 964.8);
  ctx.bezierCurveTo(3673.6, 977.3, 3678.4, 989.7, 3689.3, 996.4);
  ctx.bezierCurveTo(3689.3, 998.1, 3689.3, 1003.5, 3689.2, 1004.5);
  ctx.bezierCurveTo(3687.6, 1006.6, 3687.5, 1009.9, 3691.0, 1010.6);
  ctx.bezierCurveTo(3693.4, 1010.6, 3714.5, 1011.0, 3718.1, 1011.0);
  ctx.bezierCurveTo(3721.7, 1011.0, 3721.2, 1008.9, 3721.2, 1007.9);
  ctx.closePath();

  // bird15/object/Compound Path/Path
  ctx.moveTo(3698.6, 1004.4);
  ctx.lineTo(3693.6, 1004.3);
  ctx.lineTo(3693.5, 998.4);
  ctx.lineTo(3698.7, 999.6);
  ctx.lineTo(3698.6, 1004.4);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird15', 'Bird 15', null, create, { x: 3004, y: 860 }, 'fun');
