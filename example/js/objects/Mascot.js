import { FindableObject } from '../../../src/js/main';

import thumbnail from '../../images/mascot.png';

const create = () => {

  const x = 100;
  const y = 100

  const path = new Path2D();
  path.moveTo(x, y);
  path.lineTo(x, y + 100);
  path.lineTo(x + 100, y + 100);
  path.lineTo(x + 100, y);
  path.closePath();
  return path;
}

export default new FindableObject('mascot', 'Mascot', thumbnail, create, { x: 50, y: 50 }, 'jhu', 200);
