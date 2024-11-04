const { createRoot } = ReactDOM;
import { Game } from '../../src/js/main';

import image from '../images/background.png';
import Beanie from './objects/Beanie';
import Football from './objects/Football';

const elem = document.getElementById('root');
const root = createRoot(elem);

root.render(
  <Game
    buffer={true}
    container={elem} // image should always be wider than this element
    image={image}
    imageHeight={2448}
    imageWidth={1584}
    objects={[Beanie, Football]}
    onGameComplete={() => console.log('hooray!')}
  />
  // <Game
  //   buffer={true}
  //   container={elem} // image should always be wider than this element
  //   image={'https://picsum.photos/800/700'}
  //   imageHeight={700}
  //   imageWidth={800}
  //   onGameComplete={() => console.log('hooray!')}
  //   initialScale={100}
  // />
);
