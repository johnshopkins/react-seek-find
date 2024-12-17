import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(726.6, 1275.2);
  ctx.bezierCurveTo(729.1, 1273.4, 727.6, 1269.9, 726.2, 1267.9);
  ctx.bezierCurveTo(723.0, 1262.5, 720.8, 1256.6, 718.9, 1250.7);
  ctx.bezierCurveTo(716.4, 1240.4, 705.6, 1233.7, 696.1, 1240.0);
  ctx.bezierCurveTo(693.5, 1240.5, 690.4, 1242.6, 690.1, 1245.3);
  ctx.bezierCurveTo(692.0, 1247.7, 694.1, 1250.4, 697.2, 1251.4);
  ctx.bezierCurveTo(696.2, 1259.8, 698.5, 1270.3, 707.2, 1273.6);
  ctx.bezierCurveTo(707.4, 1276.1, 707.6, 1278.5, 707.6, 1281.0);
  ctx.bezierCurveTo(706.0, 1281.3, 704.1, 1282.1, 705.1, 1284.0);
  ctx.bezierCurveTo(705.5, 1286.3, 718.9, 1285.7, 725.3, 1285.8);
  ctx.bezierCurveTo(727.3, 1285.4, 727.4, 1282.5, 726.3, 1281.2);
  ctx.bezierCurveTo(725.0, 1279.9, 720.1, 1280.5, 718.4, 1280.4);
  ctx.bezierCurveTo(718.2, 1279.1, 718.3, 1278.8, 718.1, 1275.9);
  ctx.bezierCurveTo(720.9, 1275.6, 723.9, 1275.9, 726.6, 1275.2);
  ctx.closePath();

  // bird7/object/Compound Path/Path
  ctx.moveTo(711.4, 1280.9);
  ctx.bezierCurveTo(711.4, 1280.9, 711.4, 1280.9, 711.4, 1280.9);
  ctx.bezierCurveTo(711.4, 1280.9, 711.4, 1280.9, 711.4, 1280.9);
  ctx.bezierCurveTo(711.4, 1279.0, 711.1, 1276.8, 711.4, 1275.0);
  ctx.bezierCurveTo(712.1, 1275.3, 713.8, 1275.7, 714.5, 1275.9);
  ctx.bezierCurveTo(714.5, 1277.4, 714.4, 1279.0, 714.5, 1280.5);
  ctx.bezierCurveTo(713.5, 1280.7, 712.4, 1280.9, 711.4, 1280.9);
  ctx.bezierCurveTo(711.4, 1281.0, 711.4, 1281.1, 711.4, 1280.9);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird7', 'Bird 7', null, create, { x: 180, y: 920 }, 'fun');
