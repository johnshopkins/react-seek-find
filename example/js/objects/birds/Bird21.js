import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(2486.9, 914.2);
  ctx.bezierCurveTo(2488.5, 913.4, 2490.5, 912.3, 2491.7, 911.1);
  ctx.bezierCurveTo(2493.0, 909.8, 2493.4, 906.4, 2492.8, 905.6);
  ctx.bezierCurveTo(2490.5, 902.9, 2486.2, 899.5, 2483.0, 897.9);
  ctx.bezierCurveTo(2479.8, 896.3, 2476.3, 895.1, 2472.8, 896.0);
  ctx.bezierCurveTo(2468.5, 897.1, 2465.0, 900.6, 2462.7, 904.4);
  ctx.bezierCurveTo(2460.4, 908.3, 2459.0, 912.7, 2457.5, 916.9);
  ctx.bezierCurveTo(2455.1, 923.4, 2451.0, 929.2, 2448.2, 935.5);
  ctx.bezierCurveTo(2447.0, 938.0, 2445.9, 941.8, 2447.8, 943.8);
  ctx.bezierCurveTo(2449.0, 945.1, 2451.7, 946.3, 2453.4, 946.4);
  ctx.bezierCurveTo(2456.3, 946.5, 2462.7, 946.3, 2465.6, 946.3);
  ctx.bezierCurveTo(2465.8, 948.2, 2466.1, 949.9, 2466.0, 950.9);
  ctx.bezierCurveTo(2464.6, 951.0, 2462.4, 952.4, 2463.2, 954.8);
  ctx.bezierCurveTo(2464.1, 957.2, 2465.4, 957.8, 2467.9, 957.8);
  ctx.bezierCurveTo(2472.5, 957.8, 2479.0, 957.7, 2483.5, 957.7);
  ctx.bezierCurveTo(2485.3, 957.7, 2487.4, 957.5, 2488.3, 956.0);
  ctx.bezierCurveTo(2489.2, 954.6, 2488.7, 950.5, 2484.5, 950.4);
  ctx.bezierCurveTo(2483.0, 950.4, 2481.0, 950.1, 2478.7, 950.4);
  ctx.bezierCurveTo(2478.5, 950.1, 2478.7, 941.2, 2478.6, 939.5);
  ctx.bezierCurveTo(2478.9, 938.6, 2480.1, 937.7, 2480.6, 937.0);
  ctx.bezierCurveTo(2481.8, 935.4, 2481.5, 933.4, 2482.1, 931.6);
  ctx.bezierCurveTo(2483.0, 929.5, 2483.9, 929.7, 2484.3, 927.5);
  ctx.bezierCurveTo(2484.9, 924.5, 2483.3, 916.5, 2483.4, 916.2);
  ctx.bezierCurveTo(2483.6, 915.9, 2486.0, 914.6, 2486.9, 914.2);
  ctx.closePath();

  // bird21/object/Compound Path/Path
  ctx.moveTo(2474.1, 950.8);
  ctx.lineTo(2469.9, 950.7);
  ctx.lineTo(2470.0, 944.6);
  ctx.bezierCurveTo(2470.0, 944.6, 2472.5, 944.4, 2474.3, 942.5);
  ctx.lineTo(2474.1, 950.8);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird21', 'Bird 21', null, create, { x: 1985, y: 840 }, 'fun');
