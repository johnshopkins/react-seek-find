/**
 * @jest-environment jsdom
 */

import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { Game } from '../../src/js/main';
import { FindableObject } from '../../src/js/main';
import getMouseEvent from '../helpers/getMouseEvent';
import getTouchEvent from '../helpers/getTouchEvent';
import { saveGameState } from '../../src/js/lib/persistance';

const boxObject = new FindableObject(
  'box',
  'box',
  'https://picsum.photos/143/143',
  () => {
    const path = new Path2D();
    path.moveTo(400.0, 400.0);
    path.lineTo(300.0, 400.0);
    path.lineTo(300.0, 300.0);
    path.lineTo(400.0, 300.0);
    path.lineTo(400.0, 400.0);
    path.closePath()
    path.name = 'box'; // for mocking mockImplementation
    return path;
  },
  { x: 250, y: 250 },
  425
);

const circleObject = new FindableObject(
  'circle',
  'circle',
  'https://picsum.photos/143/143',
  () => {
    const path = new Path2D();
    path.moveTo(610.0, 289.5);
    path.bezierCurveTo(610.0, 349.4, 561.4, 398.0, 501.5, 398.0);
    path.bezierCurveTo(441.6, 398.0, 393.0, 349.4, 393.0, 289.5);
    path.bezierCurveTo(393.0, 229.6, 441.6, 181.0, 501.5, 181.0);
    path.bezierCurveTo(561.4, 181.0, 610.0, 229.6, 610.0, 289.5);
    path.closePath();
    path.name = 'circle'; // for mocking mockImplementation
    return path;
  },
  { x: 10, y: 10 },
  200
);

const getProps = (override) => {
  return {
    imageWidth: 800,
    imageHeight: 700,
    image: 'https://picsum.photos/800/700',
    objects: [boxObject, circleObject],
    test: true,
    ...override
  }
};

let GameContainer;
let user;

beforeAll(() => {

  GameContainer = null;
  document.body.innerHTML = '';
  document.body.style.fontSize = '16px';

  GameContainer = document.createElement('div');
  GameContainer.setAttribute('max-width', '400px');

  window.screen.orientation = { type: 'portrait-primary' };

  Element.prototype.scroll = jest.fn();

  Object.defineProperty(document.documentElement, 'clientHeight', { value: 400, writable: true });
  Object.defineProperty(document.documentElement, 'clientWidth', { value: 600, writable: true });

  Object.defineProperty(GameContainer, 'clientWidth', { value: 600, writable: true });

  window.resizeTo = function (width, height) {

    const orientation = height >= width ? 'landscape-primary' : 'portrait-primary';
    window.screen.orientation = { type: orientation };

    document.documentElement.clientHeight = height;
    document.documentElement.clientWidth = width;

    GameContainer.clientWidth = width;

    window.dispatchEvent(new Event('jhu:winresize:done'))
  }
});

beforeEach(() => {
  window.dataLayer = [];
  user = userEvent.setup();
})

afterEach(() => {
  jest.clearAllMocks();
});

const renderGame = async (overrideProps = {}, initialize = ['image']) => {

  const props = getProps({ container: GameContainer, ...overrideProps });
  
  const utils = render(<Game {...props} />, {
    container: document.body.appendChild(GameContainer)
  });

  if (initialize.includes('image')) {
    fireEvent.load(utils.getByAltText('Seek and find'));
  }

  return utils;
}

describe('Container', () => {

  describe('Instructions', () => {

    test('Instructions overlay is open on first view', async () => {

      localStorage.clear();

      const { container } = await renderGame();

      // overlay is already visible
      const instructionsOverlay = container.querySelector('.overlay-container');
      expect(instructionsOverlay).toBeVisible();

      // close the overlay
      await user.click(within(instructionsOverlay).getByRole('button', { name: 'Close instructions' }));
      expect(container.querySelector('.overlay-container')).not.toBeInTheDocument();

    });

    test('Instructions overlay is not open on later views', async () => {

      const { container } = await renderGame();

      const instructionsOverlay = container.querySelector('.overlay-container');
      expect(instructionsOverlay).not.toBeInTheDocument();

    });

    test('Reopening instructions is tracked', async () => {

      const { container } = await renderGame();

      // click instructions button
      await user.click(screen.getByRole('button', { name: 'How to play' }));
      expect(container.querySelector('.overlay-container')).toBeVisible();

      // open is tracked
      expect(window.dataLayer).toEqual([{ event: 'tutorial_begin' }]);

      // ready to play button also closes the overlay
      await user.click(screen.getByRole('button', { name: "I'm ready to play!" }));
      expect(container.querySelector('.overlay-container')).not.toBeInTheDocument();
    });

    test('Keyboard navigators can open and close the overlay', async () => {

      const { container } = await renderGame();

      await user.tab();
      await user.tab();
      await user.keyboard('{Enter}');

      expect(container.querySelector('.overlay-container')).toBeVisible();

      const closeButton = screen.getByRole('button', { name: 'Close instructions' });
      const readyButton = screen.getByRole('button', { name: "I'm ready to play!" })

      expect(closeButton).toHaveFocus();

      await user.tab();
      expect(readyButton).toHaveFocus();

      // we don't trap the tab in the overlay
      await user.tab();
      expect(document.body).toHaveFocus()

      await user.tab();
      expect(closeButton).toHaveFocus();

      // close the overlay
      await user.keyboard('{Enter}');
      expect(container.querySelector('.overlay-container')).not.toBeInTheDocument();

      // instructions button regains focus
      expect(screen.getByRole('button', { name: 'How to play' })).toHaveFocus();

    });

  });

  describe('Game', () => {

    beforeEach(() => {
      localStorage.clear();
      saveGameState({ seenInstructions: true }); // do not open overlay automatically
    });

    test('Game is not available until the background loads', async () => {

      const { container } = await renderGame({}, ['closeButton']);

      const image = screen.getByAltText('Seek and find');
      const loading = container.querySelector('.loading');

      expect(image).not.toBeVisible();
      expect(loading).toBeVisible();
      expect(container.querySelector('.game-container .utilities')).not.toBeInTheDocument();
      expect(container.querySelector('.game-container .magnifying-glass')).not.toBeInTheDocument();
      expect(container.querySelector('.game-container .instructions')).not.toBeInTheDocument();
      expect(container.querySelector('.game-container .hint')).not.toBeInTheDocument();
      expect(container.querySelector('.game-container .found')).not.toBeInTheDocument();
      expect(container.querySelector('.game-container .findable')).not.toBeInTheDocument();

      // load image
      fireEvent.load(image);

      expect(image).toBeVisible();
      expect(loading).not.toBeVisible();
      expect(container.querySelector('.game-container .utilities')).toBeVisible();
      expect(container.querySelector('.game-container .magnifying-glass')).not.toBeVisible();
      expect(container.querySelector('.game-container .instructions')).toBeVisible();
      expect(container.querySelector('.game-container .hint')).toBeVisible();
      expect(container.querySelector('.game-container .found')).toBeVisible();
      expect(container.querySelector('.game-container .findable')).toBeVisible();
    });

    test('onGameComplete fires when all objects are found', async () => {

      const dataLayer = []
      const onGameComplete = jest.fn();

      const { container } = await renderGame({ onGameComplete });

      const utilities = container.querySelector('.utilities');

      // hint button it shown
      const hintButton = within(utilities).getByRole('button', { name: 'Give me a hint' });
      expect(hintButton).toBeVisible();

      // replay button is not shown
      let replayButton = container.querySelector('.utilities .replay');
      expect(replayButton).not.toBeInTheDocument();

      // legend images show a status of not found
      const legend = container.querySelector('.legend');
      const legendImages = await within(legend).findAllByRole('img');
      expect(legendImages[0]).toHaveAttribute('alt', 'Object to find: box; Status: not found');
      expect(legendImages[1]).toHaveAttribute('alt', 'Object to find: circle; Status: not found');

      const canvas = container.querySelector('canvas.findable');
      const context = canvas.getContext('2d');

      // initial placement of canvas within the page
      jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ x: 0, y: 0 });

      // mock a click on circle
      context.isPointInPath.mockImplementation(path => path.name === 'circle');
      fireEvent(canvas, getMouseEvent('mousedown', { clientX: 450, clientY: 250 }, true));
      fireEvent(canvas, getMouseEvent('mouseup', { clientX: 450, clientY: 250 }));

      // object found
      expect(legendImages[0]).toHaveAttribute('alt', 'Object to find: box; Status: not found');
      expect(legendImages[1]).toHaveAttribute('alt', 'Object to find: circle; Status: found');
      dataLayer.push({ event: 'level_up', level: 1 });
      expect(window.dataLayer).toEqual(dataLayer);

      // mock a click on NOT an object
      context.isPointInPath.mockReturnValueOnce(false);
      fireEvent(canvas, getMouseEvent('mousedown', { clientX: 5, clientY: 5 }, true));
      fireEvent(canvas, getMouseEvent('mouseup', { clientX: 5, clientY: 5 }));

      // found objects are still the same
      expect(legendImages[0]).toHaveAttribute('alt', 'Object to find: box; Status: not found');
      expect(legendImages[1]).toHaveAttribute('alt', 'Object to find: circle; Status: found');

      // mock a click on box
      context.isPointInPath.mockImplementation(path => path.name === 'box');
      fireEvent(canvas, getMouseEvent('mousedown', { clientX: 350, clientY: 350 }, true));
      fireEvent(canvas, getMouseEvent('mouseup', { clientX: 350, clientY: 350 }));

      // object found
      expect(legendImages[0]).toHaveAttribute('alt', 'Object to find: box; Status: found');
      expect(legendImages[1]).toHaveAttribute('alt', 'Object to find: circle; Status: found');
      dataLayer.push({ event: 'level_up', level: 2 }, { event: 'unlock_achievement', achievement_id: 'game_complete' });
      expect(window.dataLayer).toEqual(dataLayer);

      // game complete
      expect(onGameComplete).toHaveBeenCalledTimes(1);

      // hint button is hidden
      expect(hintButton).not.toBeVisible();

      // replay button is visible
      replayButton = within(utilities).getByRole('button', { name: 'Play again' });
      expect(replayButton).toBeVisible();

    });

    describe('Canvas movement', () => {

      describe('Mouse', () => {

        test('Moving canvas within bounds by mouse click and drag', async () => {

          const { container } = await renderGame();

          const game = container.querySelector('.game');
          const canvas = container.querySelector('canvas.findable');

          // original positioning
          expect(game).toHaveStyle({ left: '0px', top: '0px' });

          // initial placement of canvas, relative to the document
          jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ x: 128, y: 106 });

          // (328, 306) is where mousedown is initiated, relative to the document
          fireEvent(canvas, getMouseEvent('mousedown', { clientX: 328, clientY: 306 }));

          // (200, 200) is where the mouse moved to, relative to the document
          fireEvent(canvas, getMouseEvent('mousemove', { clientX: 200, clientY: 200 }));

          // new positioning after mousemove
          expect(game).toHaveStyle({ left: '-128px', top: '-106px', cursor: 'grabbing' });

          // mouseup
          fireEvent(canvas, getMouseEvent('mouseup'));

          // cursor reverted after mouseup
          expect(game).toHaveStyle({ left: '-128px', top: '-106px' });

        });

        test('Moving the canvas to the edges with a buffer', async () => {

          const { container } = await renderGame();

          const game = container.querySelector('.game');
          const canvas = container.querySelector('canvas.findable');

          // original positioning
          expect(game).toHaveStyle({ left: '0px', top: '0px' });

          // initial placement of canvas, relative to the document
          jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ x: 128, y: 106 });

          // move into top-left buffer
          fireEvent(canvas, getMouseEvent('mousedown', { clientX: 100, clientY: 100 }));
          fireEvent(canvas, getMouseEvent('mousemove', { clientX: 200, clientY: 200 }));
          expect(game).toHaveStyle({ left: '66px', top: '66px' });
          fireEvent(canvas, getMouseEvent('mouseup'));

          // move into bottom-left buffer
          fireEvent(canvas, getMouseEvent('mousedown', { clientX: 100, clientY: 800 }));
          fireEvent(canvas, getMouseEvent('mousemove', { clientX: 100, clientY: 200 }));
          expect(game).toHaveStyle({ left: '66px', top: '-441px' });
          fireEvent(canvas, getMouseEvent('mouseup'));

          // move into bottom-right buffer
          fireEvent(canvas, getMouseEvent('mousedown', { clientX: 800, clientY: 800 }));
          fireEvent(canvas, getMouseEvent('mousemove', { clientX: 100, clientY: 800 }));
          expect(game).toHaveStyle({ left: '-266px', top: '-441px' });
          fireEvent(canvas, getMouseEvent('mouseup'));

          // move into top-right buffer
          fireEvent(canvas, getMouseEvent('mousedown', { clientX: 800, clientY: 100 }));
          fireEvent(canvas, getMouseEvent('mousemove', { clientX: 800, clientY: 800 }));
          expect(game).toHaveStyle({ left: '-266px', top: '66px' });
          fireEvent(canvas, getMouseEvent('mouseup'));

        });

        test('Moving the canvas to the edges without a buffer', async () => {

          const { container } = await renderGame({ buffer: false });

          const game = container.querySelector('.game');
          const canvas = container.querySelector('canvas.findable');

          // original positioning
          expect(game).toHaveStyle({ left: '0px', top: '0px' });

          // initial placement of canvas, relative to the document
          jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ x: 128, y: 106 });

          // move into top-left buffer
          fireEvent(canvas, getMouseEvent('mousedown', { clientX: 100, clientY: 100 }));
          fireEvent(canvas, getMouseEvent('mousemove', { clientX: 200, clientY: 200 }));
          expect(game).toHaveStyle({ left: '0px', top: '0px' });
          fireEvent(canvas, getMouseEvent('mouseup'));

          // move into bottom-left buffer
          fireEvent(canvas, getMouseEvent('mousedown', { clientX: 100, clientY: 800 }));
          fireEvent(canvas, getMouseEvent('mousemove', { clientX: 100, clientY: 200 }));
          expect(game).toHaveStyle({ left: '0px', top: '-375px' });
          fireEvent(canvas, getMouseEvent('mouseup'));

          // move into bottom-right buffer
          fireEvent(canvas, getMouseEvent('mousedown', { clientX: 800, clientY: 800 }));
          fireEvent(canvas, getMouseEvent('mousemove', { clientX: 100, clientY: 800 }));
          expect(game).toHaveStyle({ left: '-200px', top: '-375px' });
          fireEvent(canvas, getMouseEvent('mouseup'));

          // move into top-right buffer
          fireEvent(canvas, getMouseEvent('mousedown', { clientX: 800, clientY: 100 }));
          fireEvent(canvas, getMouseEvent('mousemove', { clientX: 800, clientY: 800 }));
          expect(game).toHaveStyle({ left: '-200px', top: '0px' });
          fireEvent(canvas, getMouseEvent('mouseup'));

        });

        test('Moving the canvas via the minimap', async () => {

          const { container } = await renderGame();

          const game = container.querySelector('.game');
          const minimap = container.querySelector('.mini-map');
          const grabbable = container.querySelector('.mini-map .shown');

          expect(game).toHaveStyle({ left: '0px', top: '0px' });
          expect(minimap).toHaveStyle({ height: '43.75px', width: '50px' });
          expect(grabbable).toHaveStyle({ height: '21.5625px', left: '-2px', top: '-2px', width: '37.5px' });

          // move the minimap
          fireEvent(grabbable, getMouseEvent('mousedown', { clientX: 730, clientY: 85 }));
          fireEvent(grabbable, getMouseEvent('mousemove', { clientX: 737, clientY: 93 }));

          expect(game).toHaveStyle({ left: '-112px', top: '-128px' });
          expect(grabbable).toHaveStyle({ height: '21.5625px', left: '5px', top: '6px', width: '37.5px' });

        });

      });

      describe('Touch', () => {

        test('Moving canvas within bounds by 2-touch scroll', async () => {

          const { container } = await renderGame();

          const game = container.querySelector('.game');

          // original positioning
          expect(game).toHaveStyle({ left: '0px', top: '0px' });

          // mock mousemove
          const canvas = container.querySelector('canvas.findable');

          // initial placement of canvas within the page
          jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ x: 128, y: 106 });

          // (328, 306) is where mousedown is initiated, relative to the document
          fireEvent(canvas, getTouchEvent('touchstart', { targetTouches: [{ clientX: 328, clientY: 306 }] }));
          
          // two-touch scroll
          fireEvent(canvas, getTouchEvent('touchmove', { targetTouches: [{ clientX: 200, clientY: 200 }, { clientX: 175, clientY: 175 }] }));

          // new positioning after 2-touch touchmove
          expect(game).toHaveStyle({ left: '-128px', top: '-106px' });

          fireEvent(canvas, getTouchEvent('touchend'));

        });

        test('1-touch scroll does not move the canvas', async () => {

          const { container } = await renderGame();

          const game = container.querySelector('.game');

          // original positioning
          expect(game).toHaveStyle({ left: '0px', top: '0px' });

          // mock mousemove
          const canvas = container.querySelector('canvas.findable');

          // initial placement of canvas within the page
          jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ x: 128, y: 106 });

          // (328, 306) is where mousedown is initiated, relative to the document
          fireEvent(canvas, getTouchEvent('touchstart', { targetTouches: [{ clientX: 328, clientY: 306 }] }));

          // one-touch scroll
          fireEvent(canvas, getTouchEvent('touchmove', { targetTouches: [{ clientX: 210, clientY: 210 }] }));

          // position is unchanged
          expect(game).toHaveStyle({ left: '0px', top: '0px' });

          fireEvent(canvas, getTouchEvent('touchend'));

        });

        test('Moving the canvas to the edges with a buffer', () => {

        });

        test('Moving the canvas to the edges without a buffer', () => {

        });

      });

      describe('Keyboard', () => {

        test('Arrow keys move the canvas the correct amount', async () => {

          const { container } = await renderGame();

          const sights = container.querySelector('.magnifying-glass');
          const canvas = container.querySelector('canvas.findable');

          expect(sights).not.toBeVisible();
          expect(canvas).not.toHaveFocus();

          await user.tab();
          expect(sights).toBeVisible();
          expect(canvas).toHaveFocus();

          // arrow keys move the canvas 2px in each direction
          await user.keyboard('{ArrowRight}');
          expect(sights).toHaveStyle({ left: '2px', top: '0px' });

          await user.keyboard('{ArrowDown}');
          expect(sights).toHaveStyle({ left: '2px', top: '2px' });

          await user.keyboard('{ArrowLeft}');
          expect(sights).toHaveStyle({ left: '0px', top: '2px' });

          await user.keyboard('{ArrowUp}');
          expect(sights).toHaveStyle({ left: '0px', top: '0px' });

          // shift + arrow keys move the canvas 20px in each direction
          await user.keyboard('{Shift>}{ArrowRight}{/Shift}');
          expect(sights).toHaveStyle({ left: '20px', top: '0px' });

          await user.keyboard('{Shift>}{ArrowDown}{/Shift}');
          expect(sights).toHaveStyle({ left: '20px', top: '20px' });

          await user.keyboard('{Shift>}{ArrowLeft}{/Shift}');
          expect(sights).toHaveStyle({ left: '0px', top: '20px' });

          await user.keyboard('{Shift>}{ArrowUp}{/Shift}');
          expect(sights).toHaveStyle({ left: '0px', top: '0px' });

        });

        test('With buffer: when sights reaches the edge of the viewable canvas, it automatically pans', async () => {

          const { container } = await renderGame();

          const game = container.querySelector('.game');
          const sights = container.querySelector('.magnifying-glass');
          const canvas = container.querySelector('canvas.findable');

          expect(sights).not.toBeVisible();
          expect(canvas).not.toHaveFocus();

          await user.tab();
          expect(sights).toBeVisible();
          expect(canvas).toHaveFocus();

          // starting point
          expect(game).toHaveStyle({ left: '0px', top: '0px' });


          // left
          
          // moves into buffer
          await user.keyboard('{Shift>}{ArrowLeft}{/Shift}');
          expect(game).toHaveStyle({ left: '66px', top: '0px' });
          expect(sights).toHaveStyle({ left: '-20px', top: '0px' });

          // move sights (+) all the way to the edge of the image
          // note: image does not move anymore
          await user.keyboard('{Shift>}{ArrowLeft}{/Shift}');
          expect(game).toHaveStyle({ left: '66px', top: '0px' });
          expect(sights).toHaveStyle({ left: '-40px', top: '0px' });

          await user.keyboard('{Shift>}{ArrowLeft}{/Shift}');
          expect(game).toHaveStyle({ left: '66px', top: '0px' });
          expect(sights).toHaveStyle({ left: '-50px', top: '0px' });

          // cannot move any further
          await user.keyboard('{ArrowLeft}');
          expect(game).toHaveStyle({ left: '66px', top: '0px' });
          expect(sights).toHaveStyle({ left: '-50px', top: '0px' });

          
          // up
          
          // moves into buffer
          await user.keyboard('{Shift>}{ArrowUp}{/Shift}');
          expect(game).toHaveStyle({ left: '66px', top: '66px' });
          expect(sights).toHaveStyle({ left: '-50px', top: '-20px' });

          // move sights (+) all the way to the edge of the image
          // note: image does not move anymore
          await user.keyboard('{Shift>}{ArrowUp}{/Shift}');
          expect(game).toHaveStyle({ left: '66px', top: '66px' });
          expect(sights).toHaveStyle({ left: '-50px', top: '-40px' });

          await user.keyboard('{Shift>}{ArrowUp}{/Shift}');
          expect(game).toHaveStyle({ left: '66px', top: '66px' });
          expect(sights).toHaveStyle({ left: '-50px', top: '-50px' });

          // cannot move any further
          await user.keyboard('{ArrowUp}');
          expect(game).toHaveStyle({ left: '66px', top: '66px' });
          expect(sights).toHaveStyle({ left: '-50px', top: '-50px' });


          // right
          
          // the calculation:
          // this.props.containerWidth - threshold <= this.state.canvasX + x + size
          // current values: 600 - 66 <= 66 + (-50) + 128 ---> 534 <= 144
          // 390 pixels to travel ---> 19 Shift+ArrowRight + 5 ArrowRight

          await user.keyboard('{Shift>}{ArrowRight>19/}{/Shift}');
          expect(game).toHaveStyle({ left: '66px', top: '66px' }); // canvas hasn't moved yet
          expect(sights).toHaveStyle({ left: '330px', top: '-50px' });

          // NOW it moves
          await user.keyboard('{ArrowRight>5/}');
          expect(game).toHaveStyle({ left: '-54px', top: '66px' });
          expect(sights).toHaveStyle({ left: '340px', top: '-50px' });

          // when does it move again?
          // current values: 534 <= 420
          // current values: 600 - 66 <= (-54) + 340 + 128 ---> 534 <= 414
          // 120 pixels to travel ---> 6 Shift+ArrowRight
          await user.keyboard('{Shift>}{ArrowRight>6/}{/Shift}');
          expect(game).toHaveStyle({ left: '-174px', top: '66px' });
          expect(sights).toHaveStyle({ left: '460px', top: '-50px' });

          // move all the way to the right
          // 750 is the farthest the sights can go, so 290 more pixels
          await user.keyboard('{Shift>}{ArrowRight>14/}{/Shift}');
          await user.keyboard('{ArrowRight>5/}');
          expect(game).toHaveStyle({ left: '-266px', top: '66px' });
          expect(sights).toHaveStyle({ left: '750px', top: '-50px' });

          // can't move anymore
          await user.keyboard('{ArrowRight}');
          expect(game).toHaveStyle({ left: '-266px', top: '66px' });
          expect(sights).toHaveStyle({ left: '750px', top: '-50px' });


          // down
          
          // the calculation:
          // this.props.containerHeight - threshold <= this.state.canvasY + y + size
          // current values: 325 - 66 <= 66 + (-50) + 128 ---> 259 <= 144
          // 115 pixels to travel ---> 5 Shift+ArrowDown + 8 ArrowDown

          await user.keyboard('{Shift>}{ArrowDown>5/}{/Shift}');
          expect(game).toHaveStyle({ left: '-266px', top: '66px' }); // canvas hasn't moved yet
          expect(sights).toHaveStyle({ left: '750px', top: '50px' });

          // NOW it moves
          await user.keyboard('{ArrowDown>8/}');
          expect(game).toHaveStyle({ left: '-266px', top: '-54px' });
          expect(sights).toHaveStyle({ left: '750px', top: '66px' });

          // when does it move again?
          // current values: 345 - 66 <= (-54) + 66 + 128 ---> 279 <= 140
          // 139 pixels to travel ---> 6 Shift+ArrowDown + 9 ArrowDown

          await user.keyboard('{Shift>}{ArrowDown>6/}{/Shift}');
          await user.keyboard('{ArrowDown>9/}');
          expect(game).toHaveStyle({ left: '-266px', top: '-174px' });
          expect(sights).toHaveStyle({ left: '750px', top: '204px' });

          // move all the way to the bottom
          // 650 is the farthest the sights can go, so 446 more pixels
          await user.keyboard('{Shift>}{ArrowDown>22/}{/Shift}');
          await user.keyboard('{ArrowDown>3/}');
          expect(game).toHaveStyle({ left: '-266px', top: '-441px' });
          expect(sights).toHaveStyle({ left: '750px', top: '650px' });

          // can't move anymore
          await user.keyboard('{ArrowDown}');
          expect(game).toHaveStyle({ left: '-266px', top: '-441px' });
          expect(sights).toHaveStyle({ left: '750px', top: '650px' });

        });

        test('Without buffer: when sights reaches the edge of the viewable canvas, it automatically pans', async () => {

          const { container } = await renderGame({ buffer: false });

          const game = container.querySelector('.game');
          const sights = container.querySelector('.magnifying-glass');
          const canvas = container.querySelector('canvas.findable');

          expect(sights).not.toBeVisible();
          expect(canvas).not.toHaveFocus();

          await user.tab();
          expect(sights).toBeVisible();
          expect(canvas).toHaveFocus();

          // starting point
          expect(game).toHaveStyle({ left: '0px', top: '0px' });


          // left
          
          // canvas cannot move left, but sights can (so the + can reach the edge)
          await user.keyboard('{Shift>}{ArrowLeft}{/Shift}');
          expect(game).toHaveStyle({ left: '0px', top: '0px' });
          expect(sights).toHaveStyle({ left: '-20px', top: '0px' });

          await user.keyboard('{Shift>}{ArrowLeft}{/Shift}');
          expect(game).toHaveStyle({ left: '0px', top: '0px' });
          expect(sights).toHaveStyle({ left: '-40px', top: '0px' });

          await user.keyboard('{Shift>}{ArrowLeft}{/Shift}');
          expect(game).toHaveStyle({ left: '0px', top: '0px' });
          expect(sights).toHaveStyle({ left: '-50px', top: '0px' });

          
          // up
          
          // canvas cannot move up, but sights can (so the + can reach the edge)
          await user.keyboard('{Shift>}{ArrowUp}{/Shift}');
          expect(game).toHaveStyle({ left: '0px', top: '0px' });
          expect(sights).toHaveStyle({ left: '-50px', top: '-20px' });

          await user.keyboard('{Shift>}{ArrowUp}{/Shift}');
          expect(game).toHaveStyle({ left: '0px', top: '0px' });
          expect(sights).toHaveStyle({ left: '-50px', top: '-40px' });

          await user.keyboard('{Shift>}{ArrowUp}{/Shift}');
          expect(game).toHaveStyle({ left: '0px', top: '0px' });
          expect(sights).toHaveStyle({ left: '-50px', top: '-50px' });


          // right
          // move all the way to the right

          await user.keyboard('{Shift>}{ArrowRight>40/}{/Shift}');
          expect(game).toHaveStyle({ left: '-200px', top: '0px' });
          expect(sights).toHaveStyle({ left: '750px', top: '-50px' });

          // cannot move anymore
          await user.keyboard('{ArrowRight}');
          expect(game).toHaveStyle({ left: '-200px', top: '0px' });
          expect(sights).toHaveStyle({ left: '750px', top: '-50px' });


          // down
          // move all the way to the bottom

          await user.keyboard('{Shift>}{ArrowDown>35/}{/Shift}');
          expect(game).toHaveStyle({ left: '-200px', top: '-375px' });
          expect(sights).toHaveStyle({ left: '750px', top: '650px' });

          // cannot move anymore
          await user.keyboard('{ArrowDown>}');
          expect(game).toHaveStyle({ left: '-200px', top: '-375px' });
          expect(sights).toHaveStyle({ left: '750px', top: '650px' });

        });

      });

    });

    describe('Scaling and sizing', () => {

    });

    test('Hint', async () => {

      const { container } = await renderGame({ objects: [boxObject] });

      const game = container.querySelector('.game');
      const image = screen.getByAltText('Seek and find');

      // starting point
      expect(game).toHaveStyle({ height: '700px', left: '0px', top: '0px', width: '800px' });
      expect(image).toHaveAttribute('height', '700');
      expect(image).toHaveAttribute('width', '800');

      const hintButton = screen.getByRole('button', { name: 'Give me a hint' });
      await user.click(hintButton);
      
      // canvas moves to the hint
      expect(game).toHaveStyle({ height: '700px', left: '-46.875px', top: '-174.375px', width: '800px' });

      // image resizes
      expect(image).toHaveAttribute('height', '525');
      expect(image).toHaveAttribute('width', '600');

    });

    test('Replay', async () => {

      const onGameComplete = jest.fn();

      const { container } = await renderGame({ onGameComplete });

      const canvas = container.querySelector('canvas.findable');
      const context = canvas.getContext('2d');

      // initial placement of canvas within the page
      jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ x: 0, y: 0 });

      // mock a click on circle
      context.isPointInPath.mockImplementation(path => path.name === 'circle');
      fireEvent(canvas, getMouseEvent('mousedown', { clientX: 450, clientY: 250 }));
      fireEvent(canvas, getMouseEvent('mouseup', { clientX: 450, clientY: 250 }));

      // mock a click on box
      context.isPointInPath.mockImplementation(path => path.name === 'box');
      fireEvent(canvas, getMouseEvent('mousedown', { clientX: 100, clientY: 100 }));
      fireEvent(canvas, getMouseEvent('mouseup', { clientX: 100, clientY: 100 }));

      // game complete
      expect(onGameComplete).toHaveBeenCalledTimes(1);

      // click play again button
      const playAgainButton = screen.getByRole('button', { name: 'Play again' });
      await user.click(playAgainButton);

      // play again button is hidden
      expect(playAgainButton).not.toBeVisible();

      // hint button is shown
      const hintButton = screen.getByRole('button', { name: 'Give me a hint' });
      expect(hintButton).toBeVisible();

      // legend images show a status of not found
      const legend = container.querySelector('.legend');
      const legendImages = await within(legend).findAllByRole('img');
      expect(legendImages[0]).toHaveAttribute('alt', 'Object to find: box; Status: not found');
      expect(legendImages[1]).toHaveAttribute('alt', 'Object to find: circle; Status: not found');

    });

    test('Zoom in', async () => {

    });

    test('Zoom out', async () => {

    });

    describe('Keyboard navigation', () => {

    });

    describe('Touch navigation', () => {

    });

  });

});
