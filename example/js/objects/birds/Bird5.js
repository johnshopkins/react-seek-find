import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(1629.7, 675.2);
  ctx.bezierCurveTo(1628.5, 673.7, 1626.8, 672.7, 1625.4, 671.5);
  ctx.bezierCurveTo(1623.8, 670.2, 1622.5, 668.6, 1620.9, 667.2);
  ctx.bezierCurveTo(1619.4, 665.8, 1617.7, 664.7, 1615.6, 664.6);
  ctx.bezierCurveTo(1610.0, 664.2, 1604.2, 666.4, 1600.3, 670.5);
  ctx.bezierCurveTo(1599.2, 671.7, 1598.2, 673.0, 1597.2, 674.4);
  ctx.bezierCurveTo(1590.5, 683.2, 1583.7, 691.8, 1576.6, 700.3);
  ctx.bezierCurveTo(1573.7, 703.8, 1570.7, 707.4, 1568.1, 711.2);
  ctx.bezierCurveTo(1567.0, 713.0, 1565.9, 715.0, 1565.9, 717.2);
  ctx.bezierCurveTo(1566.0, 719.3, 1567.6, 721.5, 1569.7, 721.5);
  ctx.bezierCurveTo(1572.2, 721.5, 1574.4, 721.4, 1576.8, 721.7);
  ctx.bezierCurveTo(1579.5, 722.2, 1582.7, 721.8, 1585.5, 721.8);
  ctx.bezierCurveTo(1587.2, 721.8, 1586.7, 721.8, 1588.0, 721.9);
  ctx.bezierCurveTo(1588.0, 723.3, 1588.0, 728.3, 1588.0, 729.6);
  ctx.bezierCurveTo(1587.0, 729.7, 1587.5, 729.6, 1585.3, 730.0);
  ctx.bezierCurveTo(1584.2, 730.2, 1583.8, 731.5, 1583.8, 732.6);
  ctx.bezierCurveTo(1583.8, 733.7, 1584.2, 736.3, 1587.1, 736.4);
  ctx.bezierCurveTo(1590.8, 736.5, 1594.0, 736.6, 1597.5, 736.6);
  ctx.bezierCurveTo(1601.9, 736.6, 1606.4, 736.4, 1610.8, 736.1);
  ctx.bezierCurveTo(1611.5, 736.0, 1612.4, 735.9, 1612.8, 735.4);
  ctx.bezierCurveTo(1613.1, 735.0, 1613.2, 734.5, 1613.2, 734.0);
  ctx.bezierCurveTo(1613.3, 732.9, 1613.4, 731.8, 1612.8, 730.8);
  ctx.bezierCurveTo(1612.0, 729.4, 1610.2, 728.9, 1608.7, 728.9);
  ctx.bezierCurveTo(1607.4, 728.9, 1606.4, 728.9, 1605.1, 729.0);
  ctx.bezierCurveTo(1603.3, 729.1, 1603.6, 728.3, 1603.5, 726.8);
  ctx.bezierCurveTo(1603.4, 724.2, 1603.4, 721.6, 1603.5, 719.0);
  ctx.bezierCurveTo(1604.8, 718.2, 1606.0, 717.9, 1607.3, 717.1);
  ctx.bezierCurveTo(1609.4, 715.9, 1611.5, 714.8, 1613.3, 713.2);
  ctx.bezierCurveTo(1617.3, 709.8, 1619.7, 704.8, 1620.8, 699.7);
  ctx.bezierCurveTo(1622.0, 694.6, 1622.2, 689.4, 1622.1, 684.1);
  ctx.bezierCurveTo(1624.2, 683.1, 1626.3, 682.1, 1628.4, 681.1);
  ctx.bezierCurveTo(1628.8, 680.9, 1629.2, 680.7, 1629.6, 680.4);
  ctx.bezierCurveTo(1631.0, 679.2, 1630.8, 676.8, 1629.7, 675.2);
  ctx.closePath();

  // bird5/object/Compound Path/Path
  ctx.moveTo(1592.9, 729.1);
  ctx.bezierCurveTo(1592.8, 727.4, 1592.9, 723.6, 1592.8, 721.9);
  ctx.bezierCurveTo(1593.4, 721.0, 1598.8, 720.5, 1598.8, 720.5);
  ctx.bezierCurveTo(1598.9, 723.3, 1598.7, 726.0, 1598.8, 728.9);
  ctx.bezierCurveTo(1596.7, 728.9, 1595.0, 729.1, 1592.9, 729.1);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird5', 'Bird 5', null, create, { x: 1490, y: 50 }, 'fun');
