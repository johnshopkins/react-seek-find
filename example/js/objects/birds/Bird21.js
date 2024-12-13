import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(2476.9, 895.8);
  ctx.bezierCurveTo(2469.0, 896.1, 2468.0, 897.9, 2464.5, 902.3);
  ctx.bezierCurveTo(2459.6, 908.4, 2457.7, 915.9, 2456.1, 920.2);
  ctx.bezierCurveTo(2454.1, 925.8, 2451.6, 928.7, 2449.5, 932.9);
  ctx.bezierCurveTo(2448.2, 935.5, 2446.1, 939.1, 2446.9, 942.2);
  ctx.bezierCurveTo(2447.5, 945.1, 2454.4, 948.0, 2465.9, 945.9);
  ctx.lineTo(2465.9, 950.8);
  ctx.bezierCurveTo(2461.7, 951.1, 2463.3, 957.8, 2465.0, 957.8);
  ctx.bezierCurveTo(2465.0, 957.8, 2480.6, 958.2, 2485.5, 958.2);
  ctx.bezierCurveTo(2489.7, 958.2, 2489.0, 950.6, 2486.1, 950.6);
  ctx.bezierCurveTo(2481.4, 950.6, 2478.4, 950.6, 2478.4, 950.6);
  ctx.lineTo(2478.4, 939.5);
  ctx.bezierCurveTo(2478.4, 939.5, 2481.6, 938.3, 2482.3, 931.1);
  ctx.bezierCurveTo(2484.6, 928.9, 2485.0, 923.5, 2483.3, 916.1);
  ctx.bezierCurveTo(2483.3, 916.1, 2485.7, 916.2, 2487.6, 913.7);
  ctx.bezierCurveTo(2490.1, 913.2, 2491.0, 912.4, 2491.1, 911.4);
  ctx.bezierCurveTo(2492.5, 910.7, 2493.0, 909.8, 2493.0, 908.0);
  ctx.bezierCurveTo(2493.0, 904.9, 2483.8, 895.8, 2476.9, 895.8);
  ctx.closePath();

  // bird21/object/Path
  ctx.moveTo(2474.5, 950.8);
  ctx.lineTo(2469.9, 950.8);
  ctx.lineTo(2469.9, 945.0);
  ctx.lineTo(2469.4, 944.6);
  ctx.bezierCurveTo(2472.7, 943.8, 2474.5, 942.4, 2474.5, 942.4);
  ctx.lineTo(2474.5, 950.8);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird21', 'Bird 21', null, create, { x: 1985, y: 840 }, 'fun');
