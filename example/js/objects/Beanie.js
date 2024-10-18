import { FindableObject } from '../../../src/js/main';

import thumbnail from '../../images/beanie.png';

const create = () => {
  const path = new Path2D();

  path.moveTo(900.7, 1961.1);
  path.bezierCurveTo(898.0, 1929.6, 902.9, 1922.7, 902.9, 1922.7);
  path.bezierCurveTo(893.9, 1920.1, 892.5, 1907.1, 892.5, 1907.1);
  path.bezierCurveTo(882.2, 1904.0, 867.9, 1883.9, 870.6, 1875.1);
  path.bezierCurveTo(873.2, 1866.4, 884.9, 1843.6, 920.1, 1836.8);
  path.lineTo(926.0, 1836.8);
  path.bezierCurveTo(925.6, 1834.4, 928.1, 1833.7, 928.1, 1833.7);
  path.lineTo(928.1, 1829.6);
  path.bezierCurveTo(925.7, 1829.2, 924.7, 1827.4, 924.7, 1826.0);
  path.bezierCurveTo(924.7, 1824.7, 924.9, 1819.8, 924.7, 1817.4);
  path.bezierCurveTo(924.6, 1815.1, 927.3, 1814.0, 927.3, 1814.0);
  path.bezierCurveTo(928.0, 1798.7, 940.2, 1793.5, 947.7, 1794.2);
  path.bezierCurveTo(955.2, 1794.8, 965.3, 1798.0, 966.0, 1811.9);
  path.bezierCurveTo(966.9, 1812.3, 966.5, 1813.9, 966.5, 1813.9);
  path.bezierCurveTo(966.5, 1813.9, 969.0, 1824.3, 967.6, 1825.4);
  path.bezierCurveTo(966.2, 1826.4, 965.6, 1826.7, 965.6, 1826.7);
  path.bezierCurveTo(965.6, 1826.7, 967.7, 1827.0, 967.7, 1829.2);
  path.bezierCurveTo(967.7, 1831.5, 967.7, 1833.2, 967.7, 1833.2);
  path.bezierCurveTo(969.9, 1833.7, 970.2, 1840.2, 968.2, 1841.3);
  path.bezierCurveTo(982.0, 1842.7, 991.4, 1858.5, 992.8, 1866.8);
  path.bezierCurveTo(998.9, 1875.3, 1010.5, 1887.8, 1008.8, 1901.3);
  path.bezierCurveTo(1008.8, 1901.3, 1009.3, 1915.6, 985.7, 1918.4);
  path.bezierCurveTo(987.1, 1923.4, 986.5, 1923.7, 986.5, 1929.5);
  path.lineTo(986.5, 1937.8);
  path.bezierCurveTo(988.3, 1940.7, 989.7, 1946.2, 989.2, 1952.4);
  path.bezierCurveTo(988.7, 1959.3, 988.4, 1958.3, 990.0, 1965.5);
  path.lineTo(991.0, 1971.8);
  path.bezierCurveTo(982.1, 1977.9, 986.9, 1991.1, 994.0, 1996.8);
  path.bezierCurveTo(990.6, 2002.0, 998.6, 2009.0, 998.6, 2009.0);
  path.lineTo(999.4, 2022.9);
  path.bezierCurveTo(996.9, 2025.1, 998.9, 2028.6, 998.9, 2028.6);
  path.bezierCurveTo(1000.6, 2034.1, 1005.8, 2035.1, 1004.6, 2047.5);
  path.bezierCurveTo(1006.3, 2048.7, 1005.6, 2057.1, 1005.6, 2057.1);
  path.bezierCurveTo(1002.2, 2059.9, 997.0, 2061.6, 994.0, 2061.8);
  path.bezierCurveTo(991.6, 2054.8, 985.3, 2050.3, 985.3, 2050.3);
  path.lineTo(985.8, 2033.6);
  path.lineTo(962.4, 2012.6);
  path.bezierCurveTo(962.8, 2009.4, 959.9, 2000.7, 960.1, 1995.9);
  path.bezierCurveTo(956.7, 1993.5, 955.4, 1988.9, 955.6, 1985.3);
  path.bezierCurveTo(955.9, 1981.7, 955.9, 1977.9, 953.5, 1975.5);
  path.bezierCurveTo(960.3, 1965.6, 956.4, 1951.3, 950.1, 1946.2);
  path.bezierCurveTo(940.9, 1938.7, 930.5, 1932.9, 900.7, 1961.1);
  path.closePath();

  return path;
}

export default new FindableObject('beanie', 'Man with beanie', thumbnail, create, { x: 736, y: 1688 });
