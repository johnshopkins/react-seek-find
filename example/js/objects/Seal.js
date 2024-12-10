import { FindableObject } from '../../../src/js/main';

import thumbnail from '../../images/seal.png';

const create = () => {
  const path = new Path2D();

  path.moveTo(1027.3, 1893.2);
  path.bezierCurveTo(1019.7, 1939.6, 1077.5, 1966.1, 1116.7, 1948.4);
  path.bezierCurveTo(1122.3, 1918.5, 1083.0, 1875.8, 1027.3, 1893.2);
  path.closePath();

  return path;
}

export default new FindableObject('seal', 'Seal', thumbnail, create, { x: 885, y: 1315 });
