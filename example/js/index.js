global.logger = console;

const { createRoot } = ReactDOM;

const testing = false;

import { FindableObjectGroup, Game } from '../../src/js/main';
import Box from './objects/Box';
import Circle from './objects/Circle';
import Star from './objects/Star';
import image from '../images/art.jpg';

import Birds from './objects/Birds';
import Jay from './objects/Jay';
import Violinist from './objects/Violinist';
import GlovelessMan from './objects/GlovelessMan';
import Glove from './objects/Glove';
import FoamFinger from './objects/FoamFinger';
import Fish from './objects/Fish';
import CoffeeMug from './objects/CoffeeMug';
import RonAndBarney from './objects/RonAndBarney';
import Dart from './objects/Dart';
import MortarBoard from './objects/MortarBoard';
import Seal from './objects/Seal';

const groups = [
  new FindableObjectGroup('jhu', 'JHU', '#68ace5'),
  new FindableObjectGroup('fun', 'Fun'),
]

const elem = document.getElementById('root');
const root = createRoot(elem);

let component;

if (testing) {
  component = (
    <Game
      container={elem} // image should always be wider than this element
      image={'https://picsum.photos/800/700'}
      imageHeight={700}
      imageWidth={800}
      containerHeight={400}
      containerWidth={600}
      objects={[
        Box,
        Circle,
        Star,
        // ...moreObjects,
      ]}
      onGameComplete={() => console.log('hooray!')}
      initialScale={100}
      groups={groups}
      // test={true}
    />
  )
} else {
  component = (
    <Game
      container={elem} // image should always be wider than this element
      image={image}
      imageWidth={3750}
      imageHeight={2109}
      objects={[
        RonAndBarney,
        Dart,
        Seal,
        Jay,
        MortarBoard,

        Violinist,
        GlovelessMan,
        Glove,
        FoamFinger,
        Fish,
        CoffeeMug,
      ]}
      bonusObjects={[
        Birds
      ]}
      groups={groups}
      onGameComplete={() => console.log('onGameComplete')}
      onBonusComplete={() => console.log('onBonusComplete')}
      // onResize={(data) => console.log('resize', data)}
    />
  )
}

root.render(component);
