import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(139.1, 673.6);
  ctx.bezierCurveTo(133.3, 669.7, 121.4, 665.6, 114.7, 668.9);
  ctx.bezierCurveTo(108.0, 672.1, 99.6, 680.3, 91.7, 690.4);
  ctx.bezierCurveTo(83.9, 700.5, 79.6, 705.1, 76.5, 708.7);
  ctx.bezierCurveTo(73.3, 712.3, 74.1, 717.2, 78.9, 718.4);
  ctx.bezierCurveTo(82.9, 719.4, 88.1, 720.9, 97.6, 721.1);
  ctx.lineTo(97.6, 728.4);
  ctx.lineTo(95.6, 728.4);
  ctx.bezierCurveTo(94.2, 728.4, 93.0, 729.6, 93.0, 731.1);
  ctx.lineTo(93.0, 733.7);
  ctx.bezierCurveTo(93.0, 735.2, 94.2, 736.4, 95.6, 736.4);
  ctx.lineTo(124.3, 736.4);
  ctx.bezierCurveTo(125.8, 736.4, 127.0, 735.2, 127.0, 733.7);
  ctx.lineTo(127.0, 731.1);
  ctx.bezierCurveTo(127.0, 729.6, 125.8, 728.4, 124.3, 728.4);
  ctx.lineTo(113.6, 728.4);
  ctx.lineTo(113.6, 719.4);
  ctx.bezierCurveTo(121.3, 716.9, 126.7, 711.3, 129.3, 702.4);
  ctx.bezierCurveTo(132.7, 690.2, 134.2, 684.5, 138.0, 682.7);
  ctx.bezierCurveTo(141.8, 680.9, 145.0, 677.5, 139.1, 673.6);
  ctx.closePath();

  // bird3/object/Compound Path/Path
  ctx.moveTo(108.1, 728.4);
  ctx.lineTo(103.2, 728.4);
  ctx.lineTo(103.2, 721.0);
  ctx.bezierCurveTo(103.5, 721.0, 103.7, 721.0, 104.1, 721.0);
  ctx.bezierCurveTo(105.4, 721.0, 106.8, 720.8, 108.1, 720.7);
  ctx.lineTo(108.1, 728.4);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird3', 'Bird 3', null, create, { x: 20, y: 340 }, 'fun');
