import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(3747.0, 1488.6);
  ctx.bezierCurveTo(3742.7, 1480.8, 3738.2, 1473.0, 3734.0, 1465.0);
  ctx.bezierCurveTo(3731.7, 1461.1, 3730.8, 1455.2, 3725.7, 1454.0);
  ctx.bezierCurveTo(3717.1, 1451.7, 3703.3, 1456.7, 3716.2, 1464.6);
  ctx.bezierCurveTo(3710.1, 1474.3, 3713.2, 1486.1, 3722.9, 1492.1);
  ctx.lineTo(3722.4, 1499.6);
  ctx.bezierCurveTo(3720.6, 1499.3, 3719.9, 1502.4, 3721.0, 1503.5);
  ctx.bezierCurveTo(3724.1, 1505.6, 3739.0, 1503.7, 3741.7, 1504.3);
  ctx.bezierCurveTo(3741.7, 1504.3, 3743.5, 1504.4, 3743.4, 1502.0);
  ctx.bezierCurveTo(3744.0, 1498.2, 3737.9, 1499.9, 3734.8, 1499.1);
  ctx.bezierCurveTo(3734.8, 1497.7, 3734.6, 1496.7, 3734.8, 1495.3);
  ctx.bezierCurveTo(3737.5, 1495.3, 3740.8, 1495.3, 3743.2, 1493.7);
  ctx.bezierCurveTo(3744.0, 1492.8, 3745.1, 1492.7, 3746.2, 1492.7);
  ctx.bezierCurveTo(3747.2, 1492.0, 3747.2, 1489.9, 3747.0, 1488.6);
  ctx.closePath();

  // bird17/object/Compound Path/Path
  ctx.moveTo(3727.3, 1499.6);
  ctx.bezierCurveTo(3727.3, 1498.1, 3727.3, 1495.1, 3727.3, 1493.6);
  ctx.bezierCurveTo(3727.4, 1493.6, 3730.3, 1494.6, 3730.3, 1494.6);
  ctx.bezierCurveTo(3730.3, 1494.6, 3730.3, 1499.3, 3730.3, 1499.3);
  ctx.bezierCurveTo(3730.3, 1499.4, 3727.3, 1499.6, 3727.3, 1499.6);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird17', 'Bird 17', null, create, { x: 3004, y: 1050 }, 'fun');
