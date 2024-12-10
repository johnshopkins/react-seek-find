global.logger = console;

const { createRoot } = ReactDOM;
import { FindableObject, Game } from '../../src/js/main';

import image from '../images/art.png';
import Seal from './objects/Seal';
import Birds from './objects/Birds';

import Box from './objects/Box';
import Circle from './objects/Circle';

import moreObjects from './objects/MoreObjects';

const elem = document.getElementById('root');
const root = createRoot(elem);

root.render(
  <Game
    container={elem} // image should always be wider than this element
    image={image}
    imageHeight={2672}
    imageWidth={4750}
    // test={true}
    objects={[
      Seal,
      Birds,
      // ...moreObjects
    ]}
    // bonusObjects={[Birds]}
    onGameComplete={() => console.log('hooray!')}
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
