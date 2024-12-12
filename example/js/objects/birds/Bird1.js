import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(322.0, 975.8);
  ctx.bezierCurveTo(317.6, 975.7, 309.5, 979.6, 308.5, 986.8);
  ctx.bezierCurveTo(308.5, 986.8, 279.7, 1021.6, 278.1, 1026.5);
  ctx.bezierCurveTo(279.9, 1033.6, 293.8, 1034.9, 301.4, 1034.3);
  ctx.lineTo(301.4, 1041.3);
  ctx.bezierCurveTo(301.4, 1041.3, 300.4, 1041.3, 298.1, 1041.3);
  ctx.bezierCurveTo(295.9, 1041.3, 294.6, 1049.3, 298.7, 1049.3);
  ctx.lineTo(328.0, 1049.3);
  ctx.bezierCurveTo(330.5, 1049.1, 329.6, 1041.1, 327.2, 1041.1);
  ctx.lineTo(316.4, 1041.1);
  ctx.lineTo(316.4, 1030.9);
  ctx.bezierCurveTo(332.3, 1023.9, 335.4, 1003.8, 330.9, 993.5);
  ctx.bezierCurveTo(330.9, 993.5, 337.8, 991.0, 337.8, 987.0);
  ctx.bezierCurveTo(338.3, 981.9, 327.8, 975.9, 322.0, 975.8);
  ctx.closePath();

  // bird1/object/Path
  ctx.moveTo(311.8, 1041.0);
  ctx.lineTo(306.2, 1041.0);
  ctx.bezierCurveTo(306.2, 1041.0, 306.2, 1033.4, 306.2, 1033.6);
  ctx.bezierCurveTo(307.5, 1033.2, 311.8, 1032.0, 311.8, 1032.0);
  ctx.lineTo(311.8, 1041.0);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird1', 'Bird 1', null, create, { x: 135, y: 600 }, 'fun');
