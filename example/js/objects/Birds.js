import { OneToManyFindableObject } from '../../../src/js/main';

import thumbnail from '../../images/bird.png';

import Bird1 from './birds/Bird1';
import Bird2 from './birds/Bird2';
import Bird3 from './birds/Bird3';
import Bird4 from './birds/Bird4';
import Bird5 from './birds/Bird5';
import Bird6 from './birds/Bird6';
import Bird7 from './birds/Bird7';
import Bird8 from './birds/Bird8';
import Bird9 from './birds/Bird9';
import Bird10 from './birds/Bird10';
import Bird11 from './birds/Bird11';
import Bird12 from './birds/Bird12';
import Bird13 from './birds/Bird13';
import Bird14 from './birds/Bird14';
import Bird15 from './birds/Bird15';
import Bird16 from './birds/Bird16';
import Bird17 from './birds/Bird17';
import Bird18 from './birds/Bird18';
import Bird19 from './birds/Bird19';
import Bird20 from './birds/Bird20';

export default new OneToManyFindableObject('birds', 'Birds', thumbnail, [
  Bird1,
  Bird2,
  Bird3,
  Bird4,
  Bird5,
  Bird6,
  Bird7,
  Bird8,
  Bird9,
  Bird10,
  Bird11,
  Bird12,
  Bird13,
  Bird14,
  Bird15,
  Bird16,
  Bird17,
  Bird18,
  Bird19,
  Bird20,
], 'fun');
