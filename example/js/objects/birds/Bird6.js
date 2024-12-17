import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(1315.9, 1099.4);
  ctx.bezierCurveTo(1312.5, 1098.8, 1307.8, 1099.6, 1304.3, 1099.5);
  ctx.bezierCurveTo(1304.3, 1097.9, 1304.3, 1097.1, 1304.3, 1095.8);
  ctx.bezierCurveTo(1306.8, 1095.1, 1308.6, 1094.7, 1310.9, 1093.1);
  ctx.bezierCurveTo(1315.7, 1091.8, 1318.5, 1087.6, 1316.2, 1082.9);
  ctx.bezierCurveTo(1314.6, 1079.6, 1312.1, 1076.8, 1310.2, 1073.7);
  ctx.bezierCurveTo(1308.6, 1070.5, 1306.5, 1067.7, 1304.5, 1064.8);
  ctx.bezierCurveTo(1300.9, 1059.8, 1297.1, 1051.6, 1290.4, 1050.8);
  ctx.bezierCurveTo(1286.4, 1050.4, 1283.0, 1052.2, 1279.4, 1053.6);
  ctx.bezierCurveTo(1273.9, 1055.2, 1272.6, 1059.2, 1277.4, 1062.8);
  ctx.bezierCurveTo(1281.0, 1065.6, 1279.0, 1068.8, 1278.6, 1072.4);
  ctx.bezierCurveTo(1279.3, 1082.2, 1283.0, 1093.2, 1293.9, 1095.0);
  ctx.bezierCurveTo(1293.9, 1096.5, 1293.8, 1098.1, 1293.8, 1099.7);
  ctx.bezierCurveTo(1291.0, 1099.3, 1289.7, 1103.2, 1292.3, 1104.6);
  ctx.bezierCurveTo(1296.1, 1105.7, 1300.4, 1104.7, 1304.4, 1105.0);
  ctx.bezierCurveTo(1307.0, 1105.0, 1309.6, 1104.7, 1312.1, 1105.0);
  ctx.bezierCurveTo(1313.8, 1105.2, 1315.7, 1105.9, 1317.2, 1104.9);
  ctx.bezierCurveTo(1319.0, 1103.4, 1318.0, 1100.1, 1315.9, 1099.4);
  ctx.closePath();

  // bird6/object/Compound Path/Path
  ctx.moveTo(1300.6, 1099.6);
  ctx.lineTo(1297.2, 1099.6);
  ctx.lineTo(1297.2, 1095.6);
  ctx.lineTo(1300.6, 1095.6);
  ctx.lineTo(1300.6, 1099.6);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird6', 'Bird 6', null, create, { x: 1120, y: 550 }, 'fun');
