import { FindableObject } from '../../../src/js/main';

import thumbnail from '../../images/dart.png';

const create = () => {
  const x = 300;
  const y = 300

  const path = new Path2D();
  path.moveTo(x, y);
  path.lineTo(x, y + 100);
  path.lineTo(x + 100, y + 100);
  path.lineTo(x + 100, y);
  path.closePath();
  return path;
}

export default new FindableObject('dart', 'Dart', thumbnail, create, { x: 250, y: 250 }, 'jhu');
