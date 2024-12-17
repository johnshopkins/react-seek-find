import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(605.2, 1706.4);
  ctx.bezierCurveTo(607.0, 1705.0, 609.0, 1703.8, 610.6, 1702.3);
  ctx.bezierCurveTo(608.9, 1696.2, 600.2, 1692.8, 594.3, 1694.7);
  ctx.bezierCurveTo(586.4, 1700.3, 581.4, 1709.4, 574.9, 1716.4);
  ctx.bezierCurveTo(563.2, 1726.3, 570.9, 1729.0, 582.2, 1729.8);
  ctx.bezierCurveTo(582.3, 1729.6, 582.5, 1734.3, 582.4, 1736.7);
  ctx.bezierCurveTo(583.6, 1736.6, 584.7, 1736.7, 585.8, 1736.6);
  ctx.bezierCurveTo(585.7, 1734.4, 585.7, 1732.2, 585.9, 1730.0);
  ctx.bezierCurveTo(587.2, 1730.1, 588.6, 1730.1, 589.9, 1730.1);
  ctx.bezierCurveTo(589.9, 1732.2, 589.9, 1734.4, 589.9, 1736.5);
  ctx.bezierCurveTo(591.0, 1736.4, 592.1, 1736.4, 593.3, 1736.4);
  ctx.bezierCurveTo(593.4, 1734.1, 593.5, 1731.8, 593.6, 1729.5);
  ctx.bezierCurveTo(604.3, 1728.1, 608.2, 1715.6, 605.2, 1706.4);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird8', 'Bird 8', null, create, { x: 0, y: 1363 }, 'fun');
