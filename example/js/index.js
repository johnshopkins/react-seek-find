const { createRoot } = ReactDOM;
import { Game } from '../../src/js/main';

import image from '../images/background.png';
import Beanie from './objects/Beanie';
import Football from './objects/Football';

const elem = document.getElementById('root');
const root = createRoot(elem);

root.render(
  <Game
    image={image}
    height={1224}
    width={792}
    objects={[Beanie, Football]}
  />
);
