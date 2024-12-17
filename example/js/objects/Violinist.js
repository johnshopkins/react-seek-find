import { FindableObject } from '../../../src/js/main';

import thumbnail from '../../images/violinist.png';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(625.4, 1613.7);
  ctx.bezierCurveTo(634.2, 1609.5, 639.6, 1614.1, 641.6, 1618.5);
  ctx.bezierCurveTo(644.0, 1617.3, 658.7, 1610.2, 661.0, 1609.6);
  ctx.bezierCurveTo(663.5, 1608.6, 665.5, 1613.2, 662.2, 1614.7);
  ctx.bezierCurveTo(659.6, 1615.8, 648.3, 1620.3, 648.3, 1620.3);
  ctx.bezierCurveTo(651.8, 1619.8, 657.5, 1626.0, 655.8, 1629.6);
  ctx.bezierCurveTo(658.8, 1630.1, 661.8, 1642.4, 661.3, 1645.6);
  ctx.bezierCurveTo(663.3, 1650.0, 664.6, 1663.0, 655.3, 1663.5);
  ctx.bezierCurveTo(649.9, 1665.3, 640.2, 1658.7, 636.9, 1656.3);
  ctx.bezierCurveTo(638.1, 1659.2, 640.4, 1660.7, 640.3, 1664.8);
  ctx.bezierCurveTo(647.7, 1664.6, 652.4, 1668.1, 659.8, 1668.9);
  ctx.bezierCurveTo(664.7, 1669.9, 666.7, 1669.3, 666.4, 1674.3);
  ctx.bezierCurveTo(677.1, 1675.9, 676.1, 1688.7, 676.3, 1696.1);
  ctx.bezierCurveTo(680.3, 1695.9, 680.2, 1705.2, 678.6, 1706.2);
  ctx.bezierCurveTo(678.8, 1706.1, 679.0, 1711.4, 678.7, 1711.4);
  ctx.bezierCurveTo(678.7, 1711.4, 678.9, 1712.1, 678.9, 1712.1);
  ctx.bezierCurveTo(683.1, 1712.4, 684.5, 1725.2, 678.6, 1726.0);
  ctx.bezierCurveTo(675.7, 1727.0, 673.3, 1726.9, 673.3, 1726.9);
  ctx.bezierCurveTo(676.8, 1737.6, 660.8, 1738.8, 654.2, 1734.5);
  ctx.bezierCurveTo(646.3, 1733.8, 647.0, 1722.6, 647.5, 1719.3);
  ctx.lineTo(645.7, 1716.9);
  ctx.bezierCurveTo(645.7, 1716.9, 645.3, 1713.5, 646.2, 1709.9);
  ctx.bezierCurveTo(641.0, 1707.0, 636.7, 1702.2, 634.6, 1701.1);
  ctx.bezierCurveTo(632.6, 1700.0, 613.9, 1695.8, 610.5, 1694.4);
  ctx.bezierCurveTo(601.5, 1691.7, 593.9, 1664.5, 593.4, 1656.7);
  ctx.bezierCurveTo(581.4, 1663.8, 570.4, 1656.3, 575.1, 1644.2);
  ctx.bezierCurveTo(576.1, 1642.1, 581.8, 1634.7, 587.1, 1629.1);
  ctx.bezierCurveTo(585.2, 1625.7, 587.2, 1623.2, 587.2, 1619.5);
  ctx.bezierCurveTo(587.8, 1609.2, 589.4, 1598.8, 599.4, 1591.4);
  ctx.bezierCurveTo(604.4, 1588.2, 609.4, 1589.0, 609.4, 1589.0);
  ctx.bezierCurveTo(612.5, 1589.1, 613.9, 1588.5, 617.2, 1592.1);
  ctx.bezierCurveTo(622.9, 1591.6, 626.3, 1613.0, 625.4, 1613.7);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('violinist', 'Violinist', thumbnail, create, { x: 446, y: 1170 }, 'fun');
