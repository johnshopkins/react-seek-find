import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(3423.9, 300.8);
  ctx.lineTo(3423.7, 308.5);
  ctx.lineTo(3428.2, 308.4);
  ctx.lineTo(3428.3, 302.3);
  ctx.lineTo(3432.8, 302.9);
  ctx.lineTo(3433.0, 308.3);
  ctx.lineTo(3437.8, 308.5);
  ctx.bezierCurveTo(3437.6, 307.1, 3438.1, 304.3, 3437.9, 302.8);
  ctx.bezierCurveTo(3453.7, 301.9, 3456.9, 291.0, 3442.6, 282.9);
  ctx.bezierCurveTo(3436.3, 275.8, 3431.3, 266.1, 3422.1, 262.8);
  ctx.bezierCurveTo(3413.5, 261.9, 3391.3, 275.2, 3410.5, 278.8);
  ctx.bezierCurveTo(3411.7, 287.0, 3415.5, 297.6, 3423.9, 300.8);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird13', 'Bird 13', null, create, { x: 3004, y: 0 }, 'fun');
