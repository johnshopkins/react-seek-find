import { FindableObject } from '../../../src/js/main';

import thumbnail from '../../images/dart.png';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(3010.9, 150.9);
  ctx.bezierCurveTo(3010.3, 149.4, 3006.8, 133.6, 3005.1, 133.2);
  ctx.lineTo(3002.4, 133.6);
  ctx.bezierCurveTo(3002.4, 133.6, 2952.1, 153.8, 2950.7, 155.2);
  ctx.lineTo(2949.7, 158.0);
  ctx.lineTo(2952.1, 167.3);
  ctx.lineTo(2945.3, 170.4);
  ctx.bezierCurveTo(2944.7, 168.8, 2942.8, 164.0, 2942.6, 162.4);
  ctx.bezierCurveTo(2942.6, 162.4, 2938.4, 155.4, 2931.1, 158.6);
  ctx.bezierCurveTo(2926.9, 160.4, 2912.7, 166.4, 2908.7, 168.0);
  ctx.lineTo(2908.6, 168.1);
  ctx.bezierCurveTo(2904.4, 166.5, 2897.7, 164.0, 2893.1, 164.3);
  ctx.bezierCurveTo(2895.1, 165.6, 2900.3, 168.4, 2902.5, 169.5);
  ctx.bezierCurveTo(2897.7, 168.6, 2882.9, 163.4, 2878.0, 163.5);
  ctx.bezierCurveTo(2877.9, 164.8, 2905.8, 174.2, 2907.1, 174.8);
  ctx.bezierCurveTo(2907.2, 175.8, 2908.6, 180.2, 2909.0, 181.3);
  ctx.lineTo(2901.0, 184.7);
  ctx.lineTo(2899.1, 178.6);
  ctx.bezierCurveTo(2899.1, 178.6, 2898.2, 174.1, 2894.0, 175.7);
  ctx.bezierCurveTo(2889.8, 177.3, 2845.2, 194.9, 2845.2, 194.9);
  ctx.bezierCurveTo(2843.4, 198.6, 2849.1, 215.1, 2849.8, 217.8);
  ctx.bezierCurveTo(2849.8, 217.8, 2851.8, 220.2, 2854.2, 220.3);
  ctx.bezierCurveTo(2858.4, 219.5, 2903.6, 200.0, 2903.6, 200.0);
  ctx.lineTo(2904.9, 198.0);
  ctx.lineTo(2902.2, 188.9);
  ctx.lineTo(2910.1, 184.9);
  ctx.bezierCurveTo(2913.0, 193.3, 2911.5, 194.8, 2920.2, 199.3);
  ctx.bezierCurveTo(2929.1, 198.5, 2940.4, 193.5, 2949.0, 191.0);
  ctx.lineTo(2950.1, 187.6);
  ctx.bezierCurveTo(2950.1, 184.9, 2947.4, 176.8, 2946.6, 174.2);
  ctx.lineTo(2953.2, 171.3);
  ctx.bezierCurveTo(2953.6, 172.9, 2954.8, 177.5, 2955.4, 178.9);
  ctx.bezierCurveTo(2955.4, 178.9, 2957.8, 181.2, 2957.8, 181.2);
  ctx.bezierCurveTo(2962.6, 179.1, 2981.4, 171.9, 2986.6, 169.9);
  ctx.bezierCurveTo(2992.1, 167.3, 3005.5, 161.2, 3011.1, 159.2);
  ctx.bezierCurveTo(3012.1, 157.9, 3011.0, 152.4, 3010.9, 150.9);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('dart', 'Dart Probe', thumbnail, create, { x: 2280, y: 0 }, 'jhu');
