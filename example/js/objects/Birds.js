import { OneToManyFindableObject } from '../../../src/js/main';

import thumbnail from '../../images/bird.png';

import Bird1 from './birds/Bird1';
import Bird2 from './birds/Bird2';

export default new OneToManyFindableObject('birds', 'Birds', thumbnail, [
  Bird1,
  Bird2
]);
