import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(2470.8, 1236.3);
  ctx.lineTo(2459.4, 1236.3);
  ctx.lineTo(2459.5, 1229.3);
  ctx.bezierCurveTo(2460.8, 1229.6, 2462.1, 1229.3, 2463.3, 1228.8);
  ctx.bezierCurveTo(2464.5, 1228.4, 2465.7, 1227.8, 2467.0, 1227.6);
  ctx.bezierCurveTo(2468.0, 1227.5, 2468.9, 1227.6, 2469.9, 1227.5);
  ctx.bezierCurveTo(2470.8, 1227.4, 2471.8, 1227.1, 2472.3, 1226.3);
  ctx.bezierCurveTo(2473.1, 1225.3, 2472.7, 1223.7, 2472.3, 1222.5);
  ctx.bezierCurveTo(2471.9, 1220.9, 2470.6, 1219.8, 2469.6, 1218.5);
  ctx.bezierCurveTo(2468.1, 1216.6, 2467.3, 1214.2, 2466.0, 1212.1);
  ctx.bezierCurveTo(2465.5, 1211.3, 2464.9, 1210.5, 2464.4, 1209.7);
  ctx.bezierCurveTo(2464.1, 1209.0, 2463.9, 1208.3, 2463.7, 1207.6);
  ctx.bezierCurveTo(2463.3, 1206.6, 2462.6, 1205.7, 2462.0, 1204.8);
  ctx.bezierCurveTo(2461.1, 1203.3, 2459.9, 1201.9, 2459.1, 1200.4);
  ctx.bezierCurveTo(2458.4, 1199.0, 2457.8, 1197.7, 2456.9, 1196.4);
  ctx.bezierCurveTo(2455.5, 1194.4, 2453.7, 1192.6, 2451.4, 1191.6);
  ctx.bezierCurveTo(2449.4, 1190.8, 2447.2, 1190.7, 2445.0, 1191.1);
  ctx.bezierCurveTo(2442.9, 1191.5, 2440.9, 1192.4, 2439.0, 1193.4);
  ctx.bezierCurveTo(2438.1, 1194.0, 2437.2, 1194.7, 2437.0, 1195.7);
  ctx.bezierCurveTo(2436.8, 1196.9, 2437.7, 1197.9, 2438.5, 1198.8);
  ctx.bezierCurveTo(2439.4, 1199.7, 2440.2, 1200.7, 2441.1, 1201.6);
  ctx.bezierCurveTo(2440.7, 1202.5, 2440.1, 1203.3, 2440.0, 1204.0);
  ctx.bezierCurveTo(2438.6, 1210.5, 2438.7, 1211.4, 2440.2, 1219.2);
  ctx.bezierCurveTo(2441.7, 1227.0, 2449.3, 1228.6, 2449.3, 1228.6);
  ctx.lineTo(2449.4, 1231.2);
  ctx.lineTo(2449.6, 1236.3);
  ctx.bezierCurveTo(2449.6, 1236.3, 2447.0, 1236.2, 2447.0, 1238.7);
  ctx.bezierCurveTo(2447.1, 1241.1, 2449.7, 1241.0, 2449.7, 1241.0);
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
