import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(2470.8, 1236.3);
  ctx.lineTo(2459.4, 1236.3);
  ctx.lineTo(2459.5, 1229.3);
  ctx.bezierCurveTo(2462.1, 1230.0, 2464.5, 1228.0, 2467.0, 1227.6);
  ctx.bezierCurveTo(2470.6, 1227.9, 2474.2, 1226.8, 2472.3, 1222.5);
  ctx.bezierCurveTo(2466.7, 1214.1, 2462.2, 1205.0, 2456.9, 1196.4);
  ctx.bezierCurveTo(2453.2, 1190.0, 2444.8, 1189.6, 2439.0, 1193.4);
  ctx.bezierCurveTo(2434.4, 1195.6, 2439.0, 1199.4, 2441.1, 1201.6);
  ctx.bezierCurveTo(2436.2, 1210.0, 2440.1, 1227.9, 2449.3, 1228.6);
  ctx.bezierCurveTo(2449.4, 1230.2, 2449.6, 1234.6, 2449.6, 1236.3);
  ctx.bezierCurveTo(2446.1, 1236.0, 2446.3, 1241.4, 2449.7, 1241.0);
  ctx.bezierCurveTo(2449.7, 1241.0, 2465.3, 1241.1, 2467.9, 1241.1);
  ctx.bezierCurveTo(2470.6, 1241.4, 2473.1, 1241.7, 2473.0, 1238.9);
  ctx.bezierCurveTo(2472.8, 1236.1, 2470.8, 1236.3, 2470.8, 1236.3);
  ctx.closePath();

  // bird16/object/Compound Path/Path
  ctx.moveTo(2455.6, 1236.3);
  ctx.lineTo(2452.6, 1236.3);
  ctx.lineTo(2452.3, 1229.2);
  ctx.lineTo(2455.6, 1229.7);
  ctx.lineTo(2455.6, 1236.3);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird16', 'Bird 16', null, create, { x: 2360, y: 1055 }, 'fun');
