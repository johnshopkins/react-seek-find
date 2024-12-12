global.logger = console;

const { createRoot } = ReactDOM;

import { FindableObjectGroup, Game } from '../../src/js/main';
import image from '../images/art.jpg';
import Dart from './objects/Dart';
import Fish from './objects/Fish';
import Glove from './objects/Glove';
import Seal from './objects/Seal';
import Birds from './objects/Birds';
import moreObjects from './objects/MoreObjects';

// import Box from './objects/Box';
// import Circle from './objects/Circle';

const groups = [
  new FindableObjectGroup('jhu', 'JHU', '#68ace5'),
  new FindableObjectGroup('fun', 'Fun'),
]

const elem = document.getElementById('root');
const root = createRoot(elem);

root.render(
  <Game
    container={elem} // image should always be wider than this element
    image={image}
    imageWidth={3750}
    imageHeight={2109}
    // test={true}
    objects={[
      Dart,
      Fish,
      Glove,
      Seal,
      // ...moreObjects,
    ]}
    groups={groups}
    bonusObjects={[Birds]}
    onGameComplete={() => console.log('onGameComplete')}
    onBonusComplete={() => console.log('onBonusComplete')}
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
  //   groups={[
  //     new FindableObjectGroup('jhu', 'JHU', '#68ace5'),
  //   ]}
  //   test={true}
  // />
);
