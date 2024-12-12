import { FindableObject } from '../../../src/js/main';

import thumbnail from '../../images/jay.png';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(2521.5, 248.5);
  ctx.bezierCurveTo(2521.4, 249.9, 2521.2, 251.3, 2520.9, 252.6);
  ctx.bezierCurveTo(2520.6, 254.0, 2520.2, 255.2, 2519.7, 256.5);
  ctx.bezierCurveTo(2519.2, 257.7, 2518.6, 258.9, 2517.9, 260.0);
  ctx.bezierCurveTo(2517.3, 261.1, 2516.5, 262.1, 2515.6, 263.0);
  ctx.bezierCurveTo(2514.8, 263.9, 2513.8, 264.6, 2512.8, 265.3);
  ctx.bezierCurveTo(2511.7, 265.9, 2510.6, 266.4, 2509.3, 266.7);
  ctx.bezierCurveTo(2508.1, 267.1, 2506.8, 267.3, 2505.5, 267.4);
  ctx.bezierCurveTo(2504.2, 267.5, 2502.8, 267.5, 2501.4, 267.4);
  ctx.bezierCurveTo(2500.0, 267.3, 2498.6, 267.2, 2497.2, 267.0);
  ctx.bezierCurveTo(2495.9, 266.7, 2494.7, 266.4, 2493.5, 266.1);
  ctx.bezierCurveTo(2492.3, 265.7, 2491.2, 265.2, 2490.1, 264.7);
  ctx.bezierCurveTo(2489.1, 264.1, 2488.2, 263.4, 2487.3, 262.7);
  ctx.bezierCurveTo(2486.5, 261.9, 2485.7, 261.0, 2485.1, 260.0);
  ctx.bezierCurveTo(2484.4, 258.9, 2483.9, 257.8, 2483.4, 256.6);
  ctx.bezierCurveTo(2483.0, 255.3, 2482.6, 254.0, 2482.4, 252.7);
  ctx.bezierCurveTo(2482.1, 251.3, 2482.0, 249.9, 2481.9, 248.5);
  ctx.bezierCurveTo(2481.9, 247.2, 2482.0, 245.8, 2482.2, 244.5);
  ctx.bezierCurveTo(2482.4, 243.2, 2482.7, 241.9, 2483.2, 240.7);
  ctx.bezierCurveTo(2483.6, 239.5, 2484.2, 238.3, 2484.9, 237.2);
  ctx.bezierCurveTo(2485.6, 236.2, 2486.4, 235.2, 2487.4, 234.3);
  ctx.bezierCurveTo(2488.4, 233.5, 2489.6, 232.7, 2490.9, 232.1);
  ctx.bezierCurveTo(2492.1, 231.5, 2493.5, 231.0, 2494.9, 230.6);
  ctx.bezierCurveTo(2496.4, 230.2, 2497.8, 229.9, 2499.3, 229.7);
  ctx.bezierCurveTo(2500.8, 229.5, 2502.3, 229.3, 2503.7, 229.3);
  ctx.bezierCurveTo(2505.2, 229.2, 2506.5, 229.2, 2507.7, 229.4);
  ctx.bezierCurveTo(2509.0, 229.5, 2510.2, 229.8, 2511.2, 230.1);
  ctx.bezierCurveTo(2512.3, 230.5, 2513.4, 231.0, 2514.3, 231.6);
  ctx.bezierCurveTo(2515.3, 232.2, 2516.2, 233.0, 2517.0, 233.9);
  ctx.bezierCurveTo(2517.8, 234.7, 2518.5, 235.7, 2519.1, 236.8);
  ctx.bezierCurveTo(2519.7, 237.9, 2520.2, 239.1, 2520.6, 240.3);
  ctx.bezierCurveTo(2521.0, 241.6, 2521.3, 242.9, 2521.5, 244.3);
  ctx.bezierCurveTo(2521.6, 245.6, 2521.6, 247.0, 2521.5, 248.5);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('clock', 'Clock', thumbnail, create, { x: 1900, y: 0 }, 'fun');
