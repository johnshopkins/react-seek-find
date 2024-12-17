import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(1094.6, 1688.3);
  ctx.bezierCurveTo(1091.5, 1683.1, 1082.8, 1679.2, 1077.4, 1683.1);
  ctx.bezierCurveTo(1072.5, 1689.5, 1069.8, 1698.4, 1064.2, 1705.0);
  ctx.bezierCurveTo(1054.7, 1715.4, 1054.1, 1718.5, 1069.6, 1719.4);
  ctx.bezierCurveTo(1069.9, 1721.8, 1069.4, 1724.2, 1069.6, 1726.7);
  ctx.bezierCurveTo(1066.6, 1726.1, 1063.6, 1728.2, 1067.2, 1730.3);
  ctx.bezierCurveTo(1071.3, 1730.8, 1089.7, 1732.5, 1089.7, 1729.8);
  ctx.bezierCurveTo(1091.2, 1725.0, 1083.9, 1726.1, 1081.1, 1726.2);
  ctx.bezierCurveTo(1080.9, 1724.9, 1080.9, 1721.7, 1081.0, 1719.5);
  ctx.bezierCurveTo(1092.9, 1717.4, 1092.9, 1702.5, 1090.1, 1693.9);
  ctx.bezierCurveTo(1091.3, 1693.5, 1092.6, 1692.9, 1092.8, 1691.6);
  ctx.bezierCurveTo(1094.2, 1691.2, 1095.0, 1689.7, 1094.6, 1688.3);
  ctx.closePath();

  // bird9/object/Compound Path/Path
  ctx.moveTo(1072.6, 1726.3);
  ctx.lineTo(1072.6, 1720.0);
  ctx.lineTo(1077.2, 1720.4);
  ctx.lineTo(1077.3, 1726.3);
  ctx.lineTo(1072.6, 1726.3);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird9', 'Bird 9', null, create, { x: 620, y: 1363 }, 'fun');
