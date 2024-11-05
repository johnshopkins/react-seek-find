import { FindableObject } from '../../../src/js/main';

export default new FindableObject(
  'circle',
  'circle',
  'https://picsum.photos/143/143',
  () => {
    const path = new Path2D();
    path.moveTo(610.0, 289.5);
    path.bezierCurveTo(610.0, 349.4, 561.4, 398.0, 501.5, 398.0);
    path.bezierCurveTo(441.6, 398.0, 393.0, 349.4, 393.0, 289.5);
    path.bezierCurveTo(393.0, 229.6, 441.6, 181.0, 501.5, 181.0);
    path.bezierCurveTo(561.4, 181.0, 610.0, 229.6, 610.0, 289.5);
    path.closePath();
    path.name = 'circle'; // for mocking mockImplementation
    return path;
  },
  { x: 10, y: 10 },
  100
);
