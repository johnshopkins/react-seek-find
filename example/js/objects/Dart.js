import { FindableObject } from '../../../src/js/main';

import thumbnail from '../../images/dart.png';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(3010.9, 150.9);
  ctx.lineTo(3006.6, 135.1);
  ctx.lineTo(3005.1, 133.2);
  ctx.lineTo(3002.4, 133.6);
  ctx.lineTo(2962.3, 150.3);
  ctx.lineTo(2953.1, 153.7);
  ctx.lineTo(2950.7, 155.2);
  ctx.lineTo(2949.7, 158.0);
  ctx.lineTo(2952.1, 167.3);
  ctx.lineTo(2945.3, 170.4);
  ctx.lineTo(2943.1, 164.6);
  ctx.lineTo(2942.6, 162.4);
  ctx.lineTo(2938.8, 158.4);
  ctx.lineTo(2936.4, 157.5);
  ctx.lineTo(2934.3, 157.5);
  ctx.lineTo(2931.1, 158.6);
  ctx.lineTo(2914.7, 165.6);
  ctx.lineTo(2908.7, 168.0);
  ctx.lineTo(2908.6, 168.1);
  ctx.lineTo(2902.3, 165.8);
  ctx.lineTo(2895.5, 164.3);
  ctx.lineTo(2893.1, 164.3);
  ctx.lineTo(2896.5, 166.3);
  ctx.lineTo(2902.5, 169.5);
  ctx.lineTo(2900.8, 169.2);
  ctx.lineTo(2883.1, 164.1);
  ctx.lineTo(2878.0, 163.5);
  ctx.lineTo(2880.5, 165.2);
  ctx.lineTo(2907.1, 174.8);
  ctx.lineTo(2907.4, 176.3);
  ctx.lineTo(2909.0, 181.3);
  ctx.lineTo(2901.0, 184.7);
  ctx.lineTo(2899.1, 178.6);
  ctx.lineTo(2897.2, 175.7);
  ctx.lineTo(2894.0, 175.7);
  ctx.lineTo(2844.1, 195.7);
  ctx.lineTo(2844.5, 199.6);
  ctx.lineTo(2850.0, 218.5);
  ctx.lineTo(2853.2, 220.4);
  ctx.lineTo(2854.9, 220.4);
  ctx.lineTo(2903.6, 200.0);
  ctx.lineTo(2904.9, 198.0);
  ctx.lineTo(2902.2, 188.9);
  ctx.lineTo(2910.1, 184.9);
  ctx.lineTo(2913.0, 194.0);
  ctx.lineTo(2915.1, 196.3);
  ctx.lineTo(2920.2, 199.3);
  ctx.lineTo(2923.9, 198.9);
  ctx.lineTo(2929.6, 197.4);
  ctx.lineTo(2941.6, 193.4);
  ctx.lineTo(2949.0, 191.0);
  ctx.lineTo(2950.1, 187.6);
  ctx.lineTo(2949.5, 183.6);
  ctx.lineTo(2946.6, 174.2);
  ctx.lineTo(2953.2, 171.3);
  ctx.lineTo(2954.6, 176.7);
  ctx.lineTo(2955.4, 178.9);
  ctx.lineTo(2957.8, 181.2);
  ctx.lineTo(2965.2, 178.2);
  ctx.lineTo(2986.6, 169.9);
  ctx.lineTo(3002.2, 162.8);
  ctx.lineTo(3011.1, 159.2);
  ctx.lineTo(3011.7, 157.3);
  ctx.lineTo(3010.9, 150.9);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('dart', 'Dart Probe', thumbnail, create, { x: 2280, y: 0 }, 'jhu');
