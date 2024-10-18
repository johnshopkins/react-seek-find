const { createRoot } = ReactDOM;
import { Game } from '../../src/js/main';

import image from '../images/background.png';
import Beanie from './objects/Beanie';
import Football from './objects/Football';

const elem = document.getElementById('root');
const root = createRoot(elem);

root.render(
  <Game
    container={elem} // image should always be wider than this element
    image={image}
    imageHeight={2448}
    imageWidth={1584}
    objects={[Beanie, Football]}
  />
);
