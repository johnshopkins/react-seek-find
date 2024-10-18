import { FindableObject } from '../../../src/js/main';

import thumbnail from '../../images/football.png';

const create = () => {

  const path = new Path2D();

  path.moveTo(1382.8, 1832.2);
  path.lineTo(1377.1, 1832.2);
  path.bezierCurveTo(1376.3, 1827.4, 1370.1, 1820.2, 1370.1, 1820.2);
  path.bezierCurveTo(1372.7, 1816.3, 1382.8, 1811.0, 1382.8, 1811.0);
  path.bezierCurveTo(1378.4, 1798.3, 1363.0, 1741.3, 1374.7, 1718.1);
  path.bezierCurveTo(1357.2, 1728.3, 1351.9, 1716.8, 1343.1, 1693.4);
  path.bezierCurveTo(1329.2, 1693.5, 1323.4, 1686.8, 1322.1, 1685.4);
  path.bezierCurveTo(1323.4, 1664.8, 1344.5, 1642.7, 1372.7, 1660.7);
  path.bezierCurveTo(1373.6, 1670.1, 1368.7, 1679.3, 1365.0, 1684.2);
  path.lineTo(1368.9, 1690.2);
  path.bezierCurveTo(1371.7, 1684.2, 1385.4, 1672.2, 1385.4, 1672.2);
  path.lineTo(1383.7, 1671.3);
  path.bezierCurveTo(1380.7, 1672.0, 1378.4, 1668.1, 1378.4, 1668.1);
  path.bezierCurveTo(1376.1, 1668.1, 1375.7, 1665.1, 1375.7, 1665.1);
  path.bezierCurveTo(1383.5, 1662.7, 1368.5, 1610.4, 1414.9, 1610.5);
  path.bezierCurveTo(1414.9, 1610.5, 1444.2, 1608.5, 1429.0, 1655.8);
  path.bezierCurveTo(1452.5, 1678.0, 1479.4, 1678.9, 1442.8, 1722.8);
  path.bezierCurveTo(1443.6, 1731.6, 1439.8, 1739.2, 1437.3, 1741.7);
  path.bezierCurveTo(1439.2, 1744.7, 1440.5, 1755.8, 1440.5, 1755.8);
  path.bezierCurveTo(1439.2, 1761.3, 1432.0, 1767.6, 1430.9, 1772.0);
  path.bezierCurveTo(1429.2, 1779.6, 1425.4, 1785.7, 1425.7, 1788.4);
  path.bezierCurveTo(1422.3, 1787.9, 1416.5, 1789.0, 1416.5, 1789.0);
  path.bezierCurveTo(1414.2, 1778.7, 1404.8, 1750.9, 1395.7, 1754.2);
  path.bezierCurveTo(1386.5, 1757.6, 1384.6, 1792.5, 1393.2, 1806.6);
  path.bezierCurveTo(1387.0, 1810.1, 1381.0, 1823.7, 1382.8, 1832.2);
  path.closePath();

  return path;
}

export default new FindableObject('football', 'Woman with football', thumbnail, create, { x: 815, y: 1182 });
