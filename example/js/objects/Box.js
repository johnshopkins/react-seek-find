import { FindableObject } from '../../../src/js/main';

export default new FindableObject(
  'box',
  'box',
  'https://picsum.photos/143/143',
  () => {
    const path = new Path2D();
    path.moveTo(400.0, 400.0);
    path.lineTo(300.0, 400.0);
    path.lineTo(300.0, 300.0);
    path.lineTo(400.0, 300.0);
    path.lineTo(400.0, 400.0);
    path.closePath()
    path.name = 'box'; // for mocking mockImplementation
    return path;
  },
  { x: 250, y: 250 },
  200
);
