import { FindableObject } from '../../../src/js/main';

import thumbnail from '../../images/dart.png';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(2844.6, 194.7);
  ctx.lineTo(2844.6, 199.8);
  ctx.lineTo(2849.9, 217.2);
  ctx.lineTo(2853.4, 220.1);
  ctx.lineTo(2855.9, 219.9);
  ctx.lineTo(2903.4, 200.1);
  ctx.lineTo(2905.2, 197.8);
  ctx.lineTo(2902.1, 188.3);
  ctx.lineTo(2910.3, 184.7);
  ctx.lineTo(2914.1, 194.8);
  ctx.lineTo(2920.2, 199.2);
  ctx.lineTo(2924.3, 199.3);
  ctx.lineTo(2949.2, 190.8);
  ctx.lineTo(2950.1, 188.2);
  ctx.lineTo(2950.1, 184.2);
  ctx.lineTo(2947.0, 174.0);
  ctx.lineTo(2953.1, 171.9);
  ctx.lineTo(2954.6, 177.8);
  ctx.lineTo(2956.7, 180.7);
  ctx.lineTo(2959.1, 180.8);
  ctx.lineTo(3011.5, 159.0);
  ctx.lineTo(3011.5, 152.0);
  ctx.lineTo(3006.3, 134.2);
  ctx.lineTo(3004.7, 132.5);
  ctx.lineTo(2951.2, 154.3);
  ctx.lineTo(2949.4, 157.5);
  ctx.lineTo(2952.2, 166.8);
  ctx.lineTo(2945.6, 169.8);
  ctx.lineTo(2942.4, 161.3);
  ctx.lineTo(2936.0, 157.1);
  ctx.lineTo(2934.0, 157.3);
  ctx.lineTo(2908.4, 167.7);
  ctx.lineTo(2893.6, 163.8);
  ctx.lineTo(2904.4, 169.8);
  ctx.lineTo(2878.6, 163.2);
  ctx.lineTo(2906.9, 174.5);
  ctx.lineTo(2909.5, 181.1);
  ctx.lineTo(2901.1, 184.5);
  ctx.lineTo(2899.3, 178.0);
  ctx.lineTo(2897.4, 175.6);
  ctx.lineTo(2895.2, 175.5);
  ctx.lineTo(2844.6, 194.7);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('dart', 'Dart Probe', thumbnail, create, { x: 2490, y: 0 }, 'jhu');
