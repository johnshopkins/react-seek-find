import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(368.1, 352.1);
  ctx.bezierCurveTo(363.7, 352.0, 357.9, 357.2, 354.6, 361.3);
  ctx.bezierCurveTo(354.6, 361.3, 325.5, 393.9, 323.9, 400.6);
  ctx.bezierCurveTo(325.7, 407.7, 333.5, 409.1, 341.1, 408.5);
  ctx.lineTo(341.0, 421.3);
  ctx.lineTo(345.4, 419.4);
  ctx.lineTo(345.4, 408.2);
  ctx.bezierCurveTo(345.4, 408.2, 350.2, 407.5, 351.0, 406.9);
  ctx.lineTo(351.0, 417.0);
  ctx.lineTo(355.1, 415.3);
  ctx.lineTo(355.1, 405.1);
  ctx.bezierCurveTo(370.8, 400.1, 377.2, 393.9, 374.9, 371.4);
  ctx.bezierCurveTo(374.9, 371.4, 381.8, 367.7, 381.9, 361.2);
  ctx.bezierCurveTo(380.4, 357.2, 373.9, 352.2, 368.1, 352.1);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird2', 'Bird 2', null, create, { x: 0, y: 0 }, 'fun');
