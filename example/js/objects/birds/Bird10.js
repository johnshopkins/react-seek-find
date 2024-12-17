import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(1334.1, 1360.4);
  ctx.bezierCurveTo(1325.7, 1353.7, 1318.2, 1356.0, 1314.7, 1360.2);
  ctx.bezierCurveTo(1309.1, 1366.9, 1305.7, 1376.0, 1301.9, 1382.8);
  ctx.bezierCurveTo(1299.0, 1385.7, 1295.5, 1393.6, 1302.7, 1392.7);
  ctx.bezierCurveTo(1305.8, 1392.9, 1308.5, 1395.1, 1311.8, 1394.7);
  ctx.bezierCurveTo(1311.7, 1397.0, 1311.7, 1399.3, 1311.6, 1401.6);
  ctx.bezierCurveTo(1308.3, 1400.3, 1306.2, 1405.6, 1309.9, 1406.3);
  ctx.bezierCurveTo(1314.4, 1405.6, 1326.8, 1408.2, 1329.0, 1404.3);
  ctx.bezierCurveTo(1329.4, 1400.1, 1324.0, 1401.9, 1321.5, 1401.5);
  ctx.bezierCurveTo(1321.4, 1398.9, 1321.9, 1395.7, 1321.8, 1394.1);
  ctx.bezierCurveTo(1323.9, 1392.9, 1326.9, 1393.3, 1329.8, 1387.4);
  ctx.bezierCurveTo(1333.0, 1381.1, 1332.6, 1373.3, 1330.0, 1367.1);
  ctx.bezierCurveTo(1330.8, 1365.1, 1334.6, 1363.5, 1334.1, 1360.4);
  ctx.closePath();

  // bird10/object/Compound Path/Path
  ctx.moveTo(1318.5, 1401.6);
  ctx.lineTo(1315.5, 1401.6);
  ctx.lineTo(1315.3, 1394.7);
  ctx.lineTo(1318.7, 1394.5);
  ctx.lineTo(1318.5, 1401.6);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird10', 'Bird 10', null, create, { x: 1205, y: 1280 }, 'fun');
