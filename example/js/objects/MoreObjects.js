import { FindableObject } from '../../../src/js/main';
import thumbnail from '../../images/thumbnail-placeholder.png';

const moreObjects = [];

let i = 0;
for (let y = 100; y < 800; y += 200) {
  for (let x = 100; x <= 1400; x += 200) {
    moreObjects.push(new FindableObject(
      `box${i}`,
      `box${i}`,
      thumbnail,
      () => {
        const path = new Path2D();
        path.moveTo(x, y);
        path.lineTo(x, y + 100);
        path.lineTo(x + 100, y + 100);
        path.lineTo(x + 100, y);
        path.closePath();
        return path;
      },
      { x: x - 50, y: y - 50 },
      'fun',
      200
    ));
    i++;
  }
}

export default moreObjects;
