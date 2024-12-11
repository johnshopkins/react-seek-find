import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(322.0, 975.6);
  ctx.bezierCurveTo(317.6, 975.6, 309.5, 979.4, 308.5, 986.6);
  ctx.bezierCurveTo(308.5, 986.6, 279.7, 1021.4, 278.1, 1026.3);
  ctx.bezierCurveTo(279.9, 1033.4, 293.8, 1034.7, 301.4, 1034.1);
  ctx.lineTo(301.4, 1041.1);
  ctx.bezierCurveTo(301.4, 1041.1, 300.4, 1041.1, 298.1, 1041.1);
  ctx.bezierCurveTo(295.9, 1041.1, 294.6, 1049.2, 298.7, 1049.2);
  ctx.lineTo(328.0, 1049.2);
  ctx.bezierCurveTo(330.5, 1049.0, 329.6, 1040.9, 327.2, 1040.9);
  ctx.lineTo(316.4, 1040.9);
  ctx.lineTo(316.4, 1030.7);
  ctx.bezierCurveTo(332.3, 1023.7, 335.4, 1003.6, 330.9, 993.3);
  ctx.bezierCurveTo(330.9, 993.3, 337.8, 990.8, 337.8, 986.8);
  ctx.bezierCurveTo(338.3, 981.7, 327.8, 975.7, 322.0, 975.6);
  ctx.closePath();

  ctx.moveTo(311.8, 1040.8);
  ctx.lineTo(306.2, 1040.8);
  ctx.bezierCurveTo(306.2, 1040.8, 306.2, 1033.2, 306.2, 1033.4);
  ctx.bezierCurveTo(307.5, 1033.0, 311.8, 1031.8, 311.8, 1031.8);
  ctx.lineTo(311.8, 1040.8);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird1', 'Bird 1', null, create, { x: 135, y: 600 });
