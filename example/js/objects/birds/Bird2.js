import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const path = new Path2D();

  path.moveTo(466.3, 445.9);
  path.bezierCurveTo(460.7, 445.8, 453.4, 452.3, 449.2, 457.5);
  path.bezierCurveTo(449.2, 457.5, 412.3, 498.9, 410.3, 507.3);
  path.bezierCurveTo(412.6, 516.3, 422.4, 518.0, 432.1, 517.3);
  path.lineTo(431.9, 533.5);
  path.lineTo(437.4, 531.1);
  path.lineTo(437.4, 516.9);
  path.bezierCurveTo(437.4, 516.9, 443.6, 516.0, 444.7, 515.2);
  path.lineTo(444.7, 528.1);
  path.lineTo(449.8, 525.9);
  path.lineTo(449.8, 513.0);
  path.bezierCurveTo(469.7, 506.7, 477.8, 498.8, 474.9, 470.3);
  path.bezierCurveTo(474.9, 470.3, 483.7, 465.7, 483.8, 457.4);
  path.bezierCurveTo(481.9, 452.3, 473.6, 446.0, 466.3, 445.9);
  path.closePath();

  return path;
}

export default new FindableObject('bird2', 'Bird 2', null, create, { x: 0, y: 0 });
