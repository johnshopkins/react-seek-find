global.logger = console;

const { createRoot } = ReactDOM;
import { FindableObject, Game } from '../../src/js/main';

import image from '../images/background.png';
import Beanie from './objects/Beanie';
import Football from './objects/Football';

import Box from './objects/Box';
import Circle from './objects/Circle';

import moreObjects from './objects/MoreObjects';

const elem = document.getElementById('root');
const root = createRoot(elem);

root.render(
  <Game
    container={elem} // image should always be wider than this element
    image={image}
    imageHeight={2448}
    imageWidth={1584}
    // imageWidth={2448}
    // imageHeight={1584}
    // test={true}
    objects={[
      Beanie,
      Football,
      ...moreObjects
    ]}
    // onGameComplete={() => console.log('hooray!')}
    // onResize={(data) => console.log('resize', data)}
  />
  // <Game
  //   container={elem} // image should always be wider than this element
  //   image={'https://picsum.photos/800/700'}
  //   imageHeight={700}
  //   imageWidth={800}
  //   containerHeight={400}
  //   containerWidth={600}
  //   objects={[
  //     Box,
  //     // Circle
  //   ]}
  //   onGameComplete={() => console.log('hooray!')}
  //   initialScale={100}
  //   test={true}
  // />
);
