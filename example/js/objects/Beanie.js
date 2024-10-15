import { FindableObject } from '../../../src/js/main';

import thumbnail from '../../images/beanie.png';

const create = () => {
  const path = new Path2D();

  path.moveTo(450.4, 980.6);
  path.bezierCurveTo(449.0, 964.8, 451.4, 961.4, 451.4, 961.4);
  path.bezierCurveTo(446.9, 960.0, 446.3, 953.6, 446.3, 953.6);
  path.bezierCurveTo(441.1, 952.0, 434.0, 941.9, 435.3, 937.6);
  path.bezierCurveTo(436.6, 933.2, 442.4, 921.8, 460.0, 918.4);
  path.lineTo(463.0, 918.4);
  path.bezierCurveTo(462.8, 917.2, 464.1, 916.9, 464.1, 916.9);
  path.lineTo(464.1, 914.8);
  path.bezierCurveTo(462.9, 914.6, 462.3, 913.7, 462.3, 913.0);
  path.bezierCurveTo(462.3, 912.4, 462.4, 909.9, 462.4, 908.7);
  path.bezierCurveTo(462.3, 907.5, 463.7, 907.0, 463.7, 907.0);
  path.bezierCurveTo(464.0, 899.3, 470.1, 896.8, 473.9, 897.1);
  path.bezierCurveTo(477.6, 897.4, 482.6, 899.0, 483.0, 905.9);
  path.bezierCurveTo(483.4, 906.1, 483.2, 906.9, 483.2, 906.9);
  path.bezierCurveTo(483.2, 906.9, 484.5, 912.2, 483.8, 912.7);
  path.bezierCurveTo(483.1, 913.2, 482.8, 913.4, 482.8, 913.4);
  path.bezierCurveTo(482.8, 913.4, 483.8, 913.5, 483.8, 914.6);
  path.bezierCurveTo(483.8, 915.7, 483.8, 916.6, 483.8, 916.6);
  path.bezierCurveTo(485.0, 916.9, 485.1, 920.1, 484.1, 920.6);
  path.bezierCurveTo(491.0, 921.4, 495.7, 929.2, 496.4, 933.4);
  path.bezierCurveTo(499.4, 937.6, 505.3, 943.9, 504.4, 950.7);
  path.bezierCurveTo(504.4, 950.7, 504.7, 957.8, 492.8, 959.2);
  path.bezierCurveTo(493.6, 961.7, 493.2, 961.8, 493.2, 964.7);
  path.lineTo(493.2, 968.9);
  path.bezierCurveTo(494.2, 970.4, 494.9, 973.1, 494.6, 976.2);
  path.bezierCurveTo(494.4, 979.6, 494.2, 979.2, 495.0, 982.7);
  path.lineTo(495.5, 985.9);
  path.bezierCurveTo(491.0, 989.0, 493.4, 995.6, 497.0, 998.4);
  path.bezierCurveTo(495.3, 1001.0, 499.3, 1004.5, 499.3, 1004.5);
  path.lineTo(499.7, 1011.4);
  path.bezierCurveTo(498.5, 1012.6, 499.4, 1014.3, 499.4, 1014.3);
  path.bezierCurveTo(500.3, 1017.1, 502.9, 1017.5, 502.3, 1023.7);
  path.bezierCurveTo(503.2, 1024.3, 502.8, 1028.6, 502.8, 1028.6);
  path.bezierCurveTo(501.1, 1030.0, 498.5, 1030.8, 497.0, 1030.9);
  path.bezierCurveTo(495.8, 1027.4, 492.6, 1025.1, 492.6, 1025.1);
  path.lineTo(492.9, 1016.8);
  path.lineTo(481.2, 1006.3);
  path.bezierCurveTo(481.4, 1004.7, 479.9, 1000.3, 480.1, 997.9);
  path.bezierCurveTo(478.4, 996.8, 477.7, 994.4, 477.8, 992.7);
  path.bezierCurveTo(478.0, 990.9, 478.0, 989.0, 476.8, 987.8);
  path.bezierCurveTo(480.1, 982.8, 478.2, 975.7, 475.0, 973.1);
  path.bezierCurveTo(470.4, 969.3, 465.3, 966.5, 450.4, 980.6);
  path.closePath();

  return path;
}

export default new FindableObject('beanie', 'Man with beanie', thumbnail, create, { x: 371, y: 847 });
