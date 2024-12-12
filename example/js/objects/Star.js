import { FindableObject } from '../../../src/js/main';

export default new FindableObject(
  'star',
  'Star',
  'https://picsum.photos/143/143',
  () => {
    const path = new Path2D();
    path.moveTo(668.7, 523.3);
    path.lineTo(682.4, 551.0);
    path.lineTo(713.0, 555.5);
    path.lineTo(690.9, 577.0);
    path.lineTo(696.1, 607.5);
    path.lineTo(668.7, 593.1);
    path.lineTo(641.4, 607.5);
    path.lineTo(646.6, 577.0);
    path.lineTo(624.5, 555.5);
    path.lineTo(655.1, 551.0);
    path.lineTo(668.7, 523.3);
    path.closePath();
    path.name = 'star'; // for mocking mockImplementation
    return path;
  },
  { x: 460, y: 319 },
  'fun',
  200
);
