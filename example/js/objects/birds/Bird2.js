import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(368.1, 351.9);
  ctx.bezierCurveTo(363.7, 351.9, 357.9, 357.0, 354.6, 361.1);
  ctx.bezierCurveTo(354.6, 361.1, 325.5, 393.8, 323.9, 400.4);
  ctx.bezierCurveTo(325.7, 407.6, 333.5, 408.9, 341.1, 408.3);
  ctx.lineTo(341.0, 421.1);
  ctx.lineTo(345.4, 419.2);
  ctx.lineTo(345.4, 408.0);
  ctx.bezierCurveTo(345.4, 408.0, 350.2, 407.3, 351.0, 406.7);
  ctx.lineTo(351.0, 416.8);
  ctx.lineTo(355.1, 415.1);
  ctx.lineTo(355.1, 404.9);
  ctx.bezierCurveTo(370.8, 399.9, 377.2, 393.7, 374.9, 371.2);
  ctx.bezierCurveTo(374.9, 371.2, 381.8, 367.5, 381.9, 361.0);
  ctx.bezierCurveTo(380.4, 357.0, 373.9, 352.0, 368.1, 351.9);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird2', 'Bird 2', null, create, { x: 0, y: 0 });
