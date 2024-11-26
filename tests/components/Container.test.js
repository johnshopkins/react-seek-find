/**
 * @jest-environment jsdom
 */

import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { Game } from '../../src/js/main';
import { FindableObject } from '../../src/js/main';
import getMouseEvent from '../helpers/getMouseEvent';
import getPointerEvent from '../helpers/getPointerEvent';
import getTouchEvent from '../helpers/getTouchEvent';
import { saveGameState } from '../../src/js/lib/persistance';

// mock settings so i don't have to keep updating tests for sizing changes
jest.mock('../../src/css/utils/shared-variables.scss', () => {
  return {
    buttonPadding: 10,

    // animations (in ms)
    foundKeepAlive: 2000,

    canvasTransition: '300ms ease-out',

    // breakpoints (up to given pixel width)
    breakpoint_small: 430,
    breakpoint_medium: 768,
    breakpoint_large: 1001, // captures 1000

    // sizing (in pixels)
    legendThumbnailHeight_small: 38,
    legendThumbnailHeight_medium: 40,
    legendThumbnailHeight_large: 62,
    legendThumbnailHeight_xlarge: 62,

    legendGap: 5,
    legendGap_small: 5,
    legendGap_medium: 5,
    legendGap_large: 5,
    legendGap_xlarge: 5,

    legendPadding: 5,
    legendPadding_small: 5,
    legendPadding_medium: 5,
    legendPadding_large: 5,
    legendPadding_xlarge: 5,

    miniMap: 55,
    utilitiesIconHeight: 32,
    utilitiesEdgeSpace: 14,
  }
})

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

// for when you need a bunch of objects to test
const bunchOfObjects = [];
let i = 0;
for (let y = 100; y < 800; y += 200) {
  for (let x = 100; x <= 1400; x += 200) {
    const id = `box${i}`;
    bunchOfObjects.push(new FindableObject(
      id,
      id,
      'https://picsum.photos/143/143',
      () => {
        const path = new Path2D();
        path.moveTo(x, y);
        path.lineTo(x, y + 100);
        path.lineTo(x + 100, y + 100);
        path.lineTo(x + 100, y);
        path.closePath();
        path.name = id; // for mocking mockImplementation
        return path;
      },
      { x: x - 50, y: y - 50 },
      200
    ));
    i++;
  }
}

const getProps = (override) => {
  return {
    containerWidth: 600,
    containerHeight: 400,
    imageWidth: 800,
    imageHeight: 700,
    image: 'https://picsum.photos/800/700',
    objects: [boxObject, circleObject],
    test: true,
    ...override
  }
};

const updateDimensions = (width, height) => {
  Object.defineProperty(document.documentElement, 'clientHeight', { value: height, writable: true });
  Object.defineProperty(document.documentElement, 'clientWidth', { value: width, writable: true });
  Object.defineProperty(GameContainer, 'clientHeight', { value: height, writable: true });
  Object.defineProperty(GameContainer, 'clientWidth', { value: width, writable: true });
}

let GameContainer;
let user;

beforeAll(() => {

  // for em calculation
  document.body.innerHTML = '';
  document.body.style.fontSize = '18px';

  GameContainer = document.createElement('div');

  window.screen.orientation = { type: 'portrait-primary' };

  Element.prototype.scroll = jest.fn();

  updateDimensions(600, 400);

  window.resizeTo = function (width, height) {

    const orientation = height >= width ? 'landscape-primary' : 'portrait-primary';
    window.screen.orientation = { type: orientation };

    updateDimensions(width, height);

    window.dispatchEvent(new Event('jhu:winresize:done'))
  }
});

beforeEach(() => {
  window.dataLayer = [];
  user = userEvent.setup({ delay: null });
  updateDimensions(600, 400);
  jest.useFakeTimers();
})

afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
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

      // close button is not present
      expect(container.querySelector('.overlay-container .close')).not.toBeInTheDocument();

      // close the overlay
      await user.click(within(instructionsOverlay).getByRole('button', { name: 'I\'m ready to play!' }));
      expect(container.querySelector('.overlay-container')).not.toBeInTheDocument();

    });

    test('Instructions overlay is not open on later views', async () => {

      localStorage.clear();
      saveGameState({ seenInstructions: true });

      const { container } = await renderGame();

      const instructionsOverlay = container.querySelector('.overlay-container');
      expect(instructionsOverlay).not.toBeInTheDocument();

    });

    test('Reopening instructions is tracked', async () => {

      localStorage.clear();
      saveGameState({ seenInstructions: true });

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

      localStorage.clear();
      saveGameState({ seenInstructions: true });

      const { container } = await renderGame();

      await user.tab();
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
      expect(container.querySelector('.game-container .sights')).not.toBeInTheDocument();
      expect(container.querySelector('.game-container .instructions')).not.toBeInTheDocument();
      expect(container.querySelector('.game-container .hint')).not.toBeInTheDocument();
      expect(container.querySelector('.game-container .found-container')).not.toBeInTheDocument();
      expect(container.querySelector('.game-container .findable')).not.toBeInTheDocument();

      // load image
      fireEvent.load(image);

      expect(image).toBeVisible();
      expect(loading).not.toBeVisible();
      expect(container.querySelector('.game-container .utilities')).toBeVisible();
      expect(container.querySelector('.game-container .sights')).not.toBeVisible();
      expect(container.querySelector('.game-container .instructions')).toBeVisible();
      expect(container.querySelector('.game-container .hint')).toBeVisible();
      expect(container.querySelector('.game-container .found-container')).toBeVisible();
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
      const legend = container.querySelector('.legend-container');
      const legendLabel = container.querySelector('.legend-container .label');
      const legendImageContainers = container.querySelectorAll('.legend-container .thumbnail');
      const legendImages = await within(legend).findAllByRole('img');

      expect(legendLabel).toHaveTextContent('Can you find us all? 0/2');
      expect(within(legendImageContainers[0]).queryByTitle('Found')).not.toBeInTheDocument();
      expect(within(legendImageContainers[1]).queryByTitle('Found')).not.toBeInTheDocument();
      expect(legendImages[0]).toHaveAttribute('alt', 'Object to find: box; Status: not found');
      expect(legendImages[1]).toHaveAttribute('alt', 'Object to find: circle; Status: not found');

      const canvas = container.querySelector('canvas.findable');
      const context = canvas.getContext('2d');

      // initial placement of canvas within the page
      jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ x: 0, y: 0 });

      // mock a click on circle
      context.isPointInPath.mockImplementation(path => path.name === 'circle');
      fireEvent(canvas, getMouseEvent('mousedown', { offsetX: 450, offsetY: 250 }, true));
      fireEvent(canvas, getMouseEvent('mouseup', { offsetX: 450, offsetY: 250 }));

      // object found
      expect(legendLabel).toHaveTextContent('Can you find us all? 1/2');
      expect(within(legendImageContainers[0]).queryByTitle('Found')).not.toBeInTheDocument();
      expect(within(legendImageContainers[1]).getByTitle('Found')).toBeInTheDocument();
      expect(legendImages[0]).toHaveAttribute('alt', 'Object to find: box; Status: not found');
      expect(legendImages[1]).toHaveAttribute('alt', 'Object to find: circle; Status: found');
      dataLayer.push({ event: 'level_up', level: 1 });
      expect(window.dataLayer).toEqual(dataLayer);

      // mock a click on NOT an object
      context.isPointInPath.mockReturnValueOnce(false);
      fireEvent(canvas, getMouseEvent('mousedown', { offsetX: 5, offsetY: 5 }, true));
      fireEvent(canvas, getMouseEvent('mouseup', { offsetX: 5, offsetY: 5 }));

      // found objects are still the same
      expect(within(legendImageContainers[0]).queryByTitle('Found')).not.toBeInTheDocument();
      expect(within(legendImageContainers[1]).getByTitle('Found')).toBeInTheDocument();
      expect(legendImages[0]).toHaveAttribute('alt', 'Object to find: box; Status: not found');
      expect(legendImages[1]).toHaveAttribute('alt', 'Object to find: circle; Status: found');

      // mock a click on the circle, again
      context.isPointInPath.mockImplementation(path => path.name === 'circle');
      fireEvent(canvas, getMouseEvent('mousedown', { offsetX: 450, offsetY: 250 }, true));
      fireEvent(canvas, getMouseEvent('mouseup', { offsetX: 450, offsetY: 250 }));

      // the already found message pops up
      const alreadyFound = container.querySelector('.game .already-found');
      expect(alreadyFound).toBeInTheDocument();
      expect(alreadyFound).toHaveStyle({ left: '450px', top: '250px' });
      

      // mock a click on box
      context.isPointInPath.mockImplementation(path => path.name === 'box');
      fireEvent(canvas, getMouseEvent('mousedown', { offsetX: 350, offsetY: 350 }, true));
      fireEvent(canvas, getMouseEvent('mouseup', { offsetX: 350, offsetY: 350 }));

      // object found
      expect(legendLabel).toHaveTextContent('Can you find us all? 2/2');
      expect(within(legendImageContainers[0]).getByTitle('Found')).toBeInTheDocument();
      expect(within(legendImageContainers[1]).getByTitle('Found')).toBeInTheDocument();
      expect(legendImages[0]).toHaveAttribute('alt', 'Object to find: box; Status: found');
      expect(legendImages[1]).toHaveAttribute('alt', 'Object to find: circle; Status: found');
      dataLayer.push({ event: 'level_up', level: 2 }, { event: 'unlock_achievement', achievement_id: 'game_complete' });
      expect(window.dataLayer).toEqual(dataLayer);

      act(() => {
        jest.runAllTimers();
      });

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
          expect(game).toHaveClass('game grabbing');
          expect(game).toHaveStyle({ left: '-128px', top: '-106px' });

          // mouseup
          fireEvent(canvas, getMouseEvent('mouseup'));

          // cursor reverted after mouseup
          expect(game).toHaveClass('game');
          expect(game).toHaveStyle({ left: '-128px', top: '-106px' });

        });

        test('Moving the canvas to the edges', async () => {

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
          expect(game).toHaveStyle({ left: '83px', top: '83px' });
          fireEvent(canvas, getMouseEvent('mouseup'));

          // move into bottom-left buffer
          fireEvent(canvas, getMouseEvent('mousedown', { clientX: 100, clientY: 800 }));
          fireEvent(canvas, getMouseEvent('mousemove', { clientX: 100, clientY: 200 }));
          expect(game).toHaveStyle({ left: '83px', top: '-433px' });
          fireEvent(canvas, getMouseEvent('mouseup'));

          // move into bottom-right buffer
          fireEvent(canvas, getMouseEvent('mousedown', { clientX: 800, clientY: 800 }));
          fireEvent(canvas, getMouseEvent('mousemove', { clientX: 100, clientY: 800 }));
          expect(game).toHaveStyle({ left: '-283px', top: '-433px' });
          fireEvent(canvas, getMouseEvent('mouseup'));

          // move into top-right buffer
          fireEvent(canvas, getMouseEvent('mousedown', { clientX: 800, clientY: 100 }));
          fireEvent(canvas, getMouseEvent('mousemove', { clientX: 800, clientY: 800 }));
          expect(game).toHaveStyle({ left: '-283px', top: '83px' });
          fireEvent(canvas, getMouseEvent('mouseup'));

        });

        test('Moving the canvas via the minimap', async () => {

          const { container } = await renderGame();

          const game = container.querySelector('.game');
          const minimap = container.querySelector('.mini-map');
          const grabbable = container.querySelector('.mini-map .shown');

          expect(game).toHaveStyle({ left: '0px', top: '0px' });
          expect(minimap).toHaveStyle({ height: '41.125px', width: '47px' });
          expect(grabbable).toHaveStyle({ height: '20.563px', left: '0px', top: '0px', width: '35.25px' });

          // move the minimap
          fireEvent(grabbable, getPointerEvent('pointerdown', { clientX: 730, clientY: 85 }));
          fireEvent(grabbable, getPointerEvent('pointermove', { clientX: 737, clientY: 93 }));
          fireEvent(grabbable, getPointerEvent('pointerup', { clientX: 737, clientY: 93 }));

          expect(game).toHaveStyle({ left: '-119.149px', top: '-136.17px' });
          expect(grabbable).toHaveStyle({ height: '20.563px', left: '7px', top: '8px', width: '35.25px' });

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

          // (328, 306) is where touch is initiated, relative to the document
          fireEvent(canvas, getTouchEvent('touchstart', { targetTouches: [{ clientX: 328, clientY: 306 }, { clientX: 303, clientY: 181 }] }));
          
          // two-touch scroll
          fireEvent(canvas, getTouchEvent('touchmove', { targetTouches: [{ clientX: 200, clientY: 200 }, { clientX: 175, clientY: 175 }] }));
          act(() => {
            jest.runAllTimers();
          });

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

      });

      describe('Keyboard', () => {

        test('Arrow keys move the canvas the correct amount', async () => {

          const { container } = await renderGame();

          const sights = container.querySelector('.sights');
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

        test('When sights reaches the edge of the viewable canvas, it automatically pans', async () => {

          const { container } = await renderGame();

          const game = container.querySelector('.game');
          const sights = container.querySelector('.sights');
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
          expect(game).toHaveStyle({ left: '83px', top: '0px' });
          expect(sights).toHaveStyle({ left: '-20px', top: '0px' });

          // move sights (+) all the way to the edge of the image
          // note: image does not move anymore
          await user.keyboard('{Shift>}{ArrowLeft}{/Shift}');
          expect(game).toHaveStyle({ left: '83px', top: '0px' });
          expect(sights).toHaveStyle({ left: '-40px', top: '0px' });

          await user.keyboard('{Shift>}{ArrowLeft}{/Shift}');
          expect(game).toHaveStyle({ left: '83px', top: '0px' });
          expect(sights).toHaveStyle({ left: '-50px', top: '0px' });

          // cannot move any further
          await user.keyboard('{ArrowLeft}');
          expect(game).toHaveStyle({ left: '83px', top: '0px' });
          expect(sights).toHaveStyle({ left: '-50px', top: '0px' });

          
          // up
          
          // moves into buffer
          await user.keyboard('{Shift>}{ArrowUp}{/Shift}');
          expect(game).toHaveStyle({ left: '83px', top: '83px' });
          expect(sights).toHaveStyle({ left: '-50px', top: '-20px' });

          // move sights (+) all the way to the edge of the image
          // note: image does not move anymore
          await user.keyboard('{Shift>}{ArrowUp}{/Shift}');
          expect(game).toHaveStyle({ left: '83px', top: '83px' });
          expect(sights).toHaveStyle({ left: '-50px', top: '-40px' });

          await user.keyboard('{Shift>}{ArrowUp}{/Shift}');
          expect(game).toHaveStyle({ left: '83px', top: '83px' });
          expect(sights).toHaveStyle({ left: '-50px', top: '-50px' });

          // cannot move any further
          await user.keyboard('{ArrowUp}');
          expect(game).toHaveStyle({ left: '83px', top: '83px' });
          expect(sights).toHaveStyle({ left: '-50px', top: '-50px' });


          // right
          
          // the calculation:
          // this.props.containerWidth - threshold <= this.state.canvasX + x + size
          // current values: 600 - 83 <= 83 + (-50) + 128 ---> 517 <= 161
          // 356 pixels to travel ---> 17 Shift+ArrowRight + 8 ArrowRight

          await user.keyboard('{Shift>}{ArrowRight>17/}{/Shift}');
          expect(game).toHaveStyle({ left: '83px', top: '83px' }); // canvas hasn't moved yet
          expect(sights).toHaveStyle({ left: '290px', top: '-50px' });

          // NOW it moves
          await user.keyboard('{ArrowRight>8/}');
          expect(game).toHaveStyle({ left: '-37px', top: '83px' });
          expect(sights).toHaveStyle({ left: '306px', top: '-50px' });

          // when does it move again?
          // current values: 534 <= 420
          // current values: 600 - 83 <= (-37) + 306 + 128 ---> 517 <= 397
          // 120 pixels to travel ---> 6 Shift+ArrowRight
          await user.keyboard('{Shift>}{ArrowRight>6/}{/Shift}');
          expect(game).toHaveStyle({ left: '-157px', top: '83px' });
          expect(sights).toHaveStyle({ left: '426px', top: '-50px' });

          // move all the way to the right
          // 750 is the farthest the sights can go, so 324 more pixels
          await user.keyboard('{Shift>}{ArrowRight>16/}{/Shift}');
          await user.keyboard('{ArrowRight>2/}');
          expect(game).toHaveStyle({ left: '-283px', top: '83px' });
          expect(sights).toHaveStyle({ left: '750px', top: '-50px' });

          // // can't move anymore
          await user.keyboard('{ArrowRight}');
          expect(game).toHaveStyle({ left: '-283px', top: '83px' });
          expect(sights).toHaveStyle({ left: '750px', top: '-50px' });


          // down
          
          // the calculation:
          // this.props.containerHeight - threshold <= this.state.canvasY + y + size
          // current values: 350 - 83 <= 83 + (-50) + 128 ---> 267 <= 161
          // 106 pixels to travel ---> 5 Shift+ArrowDown + 3 ArrowDown

          await user.keyboard('{Shift>}{ArrowDown>5/}{/Shift}');
          expect(game).toHaveStyle({ left: '-283px', top: '83px' }); // canvas hasn't moved yet
          expect(sights).toHaveStyle({ left: '750px', top: '50px' });

          // NOW it moves
          await user.keyboard('{ArrowDown>3/}');
          expect(game).toHaveStyle({ left: '-283px', top: '-37px' });
          expect(sights).toHaveStyle({ left: '750px', top: '56px' });

          // when does it move again?
          // current values: 345 - 83 <= -37 + 52 + 128 ---> 267 <= 143
          // 124 pixels to travel ---> 5 Shift+ArrowDown + 10 ArrowDown

          await user.keyboard('{Shift>}{ArrowDown>6/}{/Shift}');
          await user.keyboard('{ArrowDown>2/}');
          expect(game).toHaveStyle({ left: '-283px', top: '-157px' });
          expect(sights).toHaveStyle({ left: '750px', top: '180px' });

          // move all the way to the bottom
          // 650 is the farthest the sights can go, so 470 more pixels
          await user.keyboard('{Shift>}{ArrowDown>23/}{/Shift}');
          await user.keyboard('{ArrowDown>5/}');
          expect(game).toHaveStyle({ left: '-283px', top: '-433px' });
          expect(sights).toHaveStyle({ left: '750px', top: '650px' });

          // can't move anymore
          await user.keyboard('{ArrowDown}');
          expect(game).toHaveStyle({ left: '-283px', top: '-433px' });
          expect(sights).toHaveStyle({ left: '750px', top: '650px' });

        });

        test('If keyboard is newly focused, move the sights into view', async () => {

          const { container } = await renderGame();

          const game = container.querySelector('.game');
          const sights = container.querySelector('.sights');
          const canvas = container.querySelector('canvas.findable');

          // use the mouse to move the canvas into the bottom right

          // initial positions
          expect(game).toHaveStyle({ left: '0px', top: '0px' });
          expect(sights).toHaveStyle({ left: '0px', top: '0px' });

          // move to the bottom right of the canvas
          fireEvent(canvas, getMouseEvent('mousedown', { clientX: 800, clientY: 300 }));
          fireEvent(canvas, getMouseEvent('mousemove', { clientX: 200, clientY: 10 }));
          fireEvent(canvas, getMouseEvent('mouseup', { clientX: 200, clientY: 10 }));
          expect(game).toHaveStyle({ left: '-283px', top: '-290px' });

          fireEvent(canvas, getMouseEvent('mousedown', { clientX: 800, clientY: 300 }));
          fireEvent(canvas, getMouseEvent('mousemove', { clientX: 400, clientY: 10 }));
          fireEvent(canvas, getMouseEvent('mouseup', { clientX: 200, clientY: 10 }));
          expect(game).toHaveStyle({ left: '-283px', top: '-433px' });

          // click on the canvas (fireEvent doesn't change focus)
          await user.click(canvas);
          expect(canvas).toHaveFocus();

          // get out of the game
          await user.tab({ shift: true });
          expect(document.body).toHaveFocus();

          // tab back into canvas
          await user.tab();
          expect(canvas).toHaveFocus();
          expect(sights).toHaveStyle({ left: '283px', top: '433px' });

        })

        test('If a user switches from mouse to keyboard navigation, move the sights into view', async () => {

          const { container } = await renderGame();

          const game = container.querySelector('.game');
          const sights = container.querySelector('.sights');
          const canvas = container.querySelector('canvas.findable');

          // use the mouse to move the canvas into the bottom right

          // initial positions
          expect(game).toHaveStyle({ left: '0px', top: '0px' });
          expect(sights).toHaveStyle({ left: '0px', top: '0px' });

          // move to the bottom right of the canvas
          fireEvent(canvas, getMouseEvent('mousedown', { clientX: 800, clientY: 300 }));
          fireEvent(canvas, getMouseEvent('mousemove', { clientX: 200, clientY: 10 }));
          fireEvent(canvas, getMouseEvent('mouseup', { clientX: 200, clientY: 10 }));
          expect(game).toHaveStyle({ left: '-283px', top: '-290px' });

          fireEvent(canvas, getMouseEvent('mousedown', { clientX: 800, clientY: 300 }));
          fireEvent(canvas, getMouseEvent('mousemove', { clientX: 400, clientY: 10 }));
          fireEvent(canvas, getMouseEvent('mouseup', { clientX: 200, clientY: 10 }));
          expect(game).toHaveStyle({ left: '-283px', top: '-433px' });

          // click on the canvas (fireEvent doesn't change focus)
          await user.click(canvas);
          expect(canvas).toHaveFocus();

          // switch to keyboard navigation
          await user.keyboard('{ArrowRight}');
          expect(sights).toHaveStyle({ left: '283px', top: '433px' });

        })

      });

    });

    test('Scaling and sizing', async () => {

      const { container } = await renderGame({
        containerHeight: null,
        containerWidth: null
      });

      const outerContainer = container.querySelector('.container');
      const gameContainer = container.querySelector('.game-container')
      const game = container.querySelector('.game');
      const canvas = container.querySelector('canvas.findable');

      expect(outerContainer).toHaveStyle({ height: '380px', width: '600px' });
      expect(gameContainer).toHaveStyle({ height: '330px', width: '600px' });

      // initial position
      expect(game).toHaveStyle({ left: '0px', top: '0px' });

      // move ro the center of the canvas
      fireEvent(canvas, getMouseEvent('mousedown', { clientX: 423, clientY: 339 }));
      fireEvent(canvas, getMouseEvent('mousemove', { clientX: 323, clientY: 189 }));
      expect(game).toHaveStyle({ left: '-100px', top: '-150px' });

      act(() => {
        window.resizeTo(500, 300);
      });

      expect(outerContainer).toHaveStyle({ height: '280px', width: '500px' });
      expect(gameContainer).toHaveStyle({ height: '230px', width: '500px' });
      expect(game).toHaveStyle({ left: '-150px', top: '-200px' });

    });

    describe('Fullscreen', () => {

      test('Enter/exit fullscreen mode via button', async () => {

        const { container } = await renderGame({
          containerHeight: null,
          containerWidth: null
        });

        const outerContainer = container.querySelector('.container');
        expect(outerContainer).toHaveStyle({ height: '380px', width: '600px' });

        const fullscreenButton = screen.getByRole('button', { name: 'Enter fullscreen' });
        expect(fullscreenButton).toBeInTheDocument();

        await user.click(fullscreenButton);
        expect(document.body).toHaveClass('fullscreen')
        expect(outerContainer).not.toHaveStyle({ height: '380px', width: '600px' });
        expect(fullscreenButton).toHaveTextContent('Exit fullscreen');

        await user.click(fullscreenButton);
        expect(document.body).not.toHaveClass('fullscreen')
        expect(outerContainer).toHaveStyle({ height: '380px', width: '600px' });
        expect(fullscreenButton).toHaveTextContent('Enter fullscreen');

      });

      test('Exit fullscreen mode via Escape key', async () => {

        const { container } = await renderGame({
          containerHeight: null,
          containerWidth: null
        });

        const outerContainer = container.querySelector('.container');
        expect(outerContainer).toHaveStyle({ height: '380px', width: '600px' });

        await user.tab();
        await user.tab();
        expect(screen.getByRole('button', { name: 'Enter fullscreen' })).toHaveFocus();

        await user.keyboard('{Enter}');
        expect(document.body).toHaveClass('fullscreen')
        expect(outerContainer).not.toHaveStyle({ height: '380px', width: '600px' });

        await user.keyboard('{Escape}');
        expect(document.body).not.toHaveClass('fullscreen')
        expect(outerContainer).toHaveStyle({ height: '380px', width: '600px' });

      });

    });

    describe('Zooming', () => {

      test('Zooming - max zoom out is 26%', async () => {

        const { container } = await renderGame({ objects: [boxObject] });

        const gamePlacement = container.querySelector('.game-placement');
        const game = container.querySelector('.game');
        const image = screen.getByAltText('Seek and find');
        const canvas = container.querySelector('canvas.findable');

        // initial placement of canvas, relative to the document
        jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ x: 128, y: 106 });

        const zoomInButton = screen.getByRole('button', { name: 'Zoom in' });
        const zoomOutButton = screen.getByRole('button', { name: 'Zoom out' });

        expect(zoomInButton).toBeDisabled();
        expect(zoomOutButton).not.toBeDisabled();

        // starting point
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({ left: '0px', top: '0px' });
        expect(image).toHaveAttribute('height', '700');
        expect(image).toHaveAttribute('width', '800');

        // move to the center of the canvas
        fireEvent(canvas, getMouseEvent('mousedown', { clientX: 423, clientY: 339 }));
        fireEvent(canvas, getMouseEvent('mousemove', { clientX: 323, clientY: 164 }));
        expect(game).toHaveStyle({ left: '-100px', top: '-175px'  });

        // zoom out to 90%
        await user.click(zoomOutButton);
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({ left: '-60px', top: '-140px' });
        expect(image).toHaveAttribute('height', '630');
        expect(image).toHaveAttribute('width', '720');

        expect(zoomInButton).not.toBeDisabled();

        // zoom out to 80%
        await user.click(zoomOutButton);
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({  left: '-20px', top: '-105px' });
        expect(image).toHaveAttribute('height', '560');
        expect(image).toHaveAttribute('width', '640');

        // zoom out to 70%
        await user.click(zoomOutButton);
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({  left: '20px', top: '-70px' });
        expect(image).toHaveAttribute('height', '490');
        expect(image).toHaveAttribute('width', '560');

        // zoom out to 60%
        await user.click(zoomOutButton);
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({  left: '60px', top: '-35px' });
        expect(image).toHaveAttribute('height', '420');
        expect(image).toHaveAttribute('width', '480');

        // zoom out to 50%
        await user.click(zoomOutButton);
        expect(gamePlacement).toHaveStyle({ left: '100px', top: '0px' });
        expect(game).toHaveStyle({  left: '0px', top: '0px' });
        expect(image).toHaveAttribute('height', '350');
        expect(image).toHaveAttribute('width', '400');

        // zoom out to 40%
        await user.click(zoomOutButton);
        expect(gamePlacement).toHaveStyle({ left: '140px', top: '0px' });
        expect(game).toHaveStyle({  left: '0px', top: '35px' });
        expect(image).toHaveAttribute('height', '280');
        expect(image).toHaveAttribute('width', '320');

        // zoom out to 30%
        await user.click(zoomOutButton);
        expect(gamePlacement).toHaveStyle({ left: '180px', top: '0px' });
        expect(game).toHaveStyle({  left: '0px', top: '70px' });
        expect(image).toHaveAttribute('height', '210');
        expect(image).toHaveAttribute('width', '240');

        // zoom out to 26% (full zoom out)
        await user.click(zoomOutButton);
        expect(gamePlacement).toHaveStyle({ left: '194.857px', top: '0px' });
        expect(game).toHaveStyle({  left: '0px', top: '83px' });
        expect(image).toHaveAttribute('height', '184');
        expect(image).toHaveAttribute('width', '210.286');

        expect(zoomInButton).not.toBeDisabled();
        expect(zoomOutButton).toBeDisabled();

        // zoom back in to 30%
        await user.click(zoomInButton);
        expect(gamePlacement).toHaveStyle({ left: '180px', top: '0px' });
        expect(game).toHaveStyle({  left: '0px', top: '70px' });
        expect(image).toHaveAttribute('height', '210');
        expect(image).toHaveAttribute('width', '240');

        // zoom back in to 40%
        await user.click(zoomInButton);
        expect(gamePlacement).toHaveStyle({ left: '140px', top: '0px' });
        expect(game).toHaveStyle({  left: '0px', top: '35px' });
        expect(image).toHaveAttribute('height', '280');
        expect(image).toHaveAttribute('width', '320');

        // zoom back in to 50%
        await user.click(zoomInButton);
        expect(gamePlacement).toHaveStyle({ left: '100px', top: '0px' });
        expect(game).toHaveStyle({  left: '0px', top: '0px' });
        expect(image).toHaveAttribute('height', '350');
        expect(image).toHaveAttribute('width', '400');

        // zoom back in to 60%
        await user.click(zoomInButton);
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({  left: '60px', top: '-35px' });
        expect(image).toHaveAttribute('height', '420');
        expect(image).toHaveAttribute('width', '480');

        // zoom back in to 70%
        await user.click(zoomInButton);
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({  left: '20px', top: '-70px' });
        expect(image).toHaveAttribute('height', '490');
        expect(image).toHaveAttribute('width', '560');
        
        // zoom back in to 80%
        await user.click(zoomInButton);
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({  left: '-20px', top: '-105px' });
        expect(image).toHaveAttribute('height', '560');
        expect(image).toHaveAttribute('width', '640');

        // zoom back in to 90%
        await user.click(zoomInButton);
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({ left: '-60px', top: '-140px' });
        expect(image).toHaveAttribute('height', '630');
        expect(image).toHaveAttribute('width', '720');

        // zoom back in to 100%
        await user.click(zoomInButton);
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({ left: '-100px', top: '-175px'  });
        expect(image).toHaveAttribute('height', '700');
        expect(image).toHaveAttribute('width', '800');

        expect(zoomInButton).toBeDisabled();
        expect(zoomOutButton).not.toBeDisabled();

      });

      test('Keyboard zooming - max zoom out is 26%', async () => {

        const { container } = await renderGame({ objects: [boxObject] });

        const gamePlacement = container.querySelector('.game-placement');
        const game = container.querySelector('.game');
        const image = screen.getByAltText('Seek and find');
        const canvas = container.querySelector('canvas.findable');
        const sights = container.querySelector('.sights');

        // initial placement of canvas, relative to the document
        // jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ x: 128, y: 106 });
        jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ x: 259, y: 9 });

        const zoomInButton = screen.getByRole('button', { name: 'Zoom in' });
        const zoomOutButton = screen.getByRole('button', { name: 'Zoom out' });

        jest.spyOn(sights, 'getBoundingClientRect')
          .mockReturnValueOnce({ x: 609, y: 69 })
          .mockReturnValueOnce({ x: 509, y: 134 })
          .mockReturnValueOnce({ x: 509, y: 134 })
          .mockReturnValueOnce({ x: 509, y: 134 })
          .mockReturnValueOnce({ x: 509, y: 134 })
          .mockReturnValueOnce({ x: 509, y: 134 })
          .mockReturnValueOnce({ x: 509, y: 134 })
          .mockReturnValueOnce({ x: 509, y: 134 })
          // zoom back in
          .mockReturnValueOnce({ x: 508.984375, y: 134 })
          .mockReturnValueOnce({ x: 509, y: 134 })
          .mockReturnValueOnce({ x: 509, y: 134 })
          .mockReturnValueOnce({ x: 509, y: 134 })
          .mockReturnValueOnce({ x: 509, y: 134 })
          .mockReturnValueOnce({ x: 509, y: 134 })
          .mockReturnValueOnce({ x: 509, y: 134 })
          .mockReturnValueOnce({ x: 509, y: 134 })

        jest.spyOn(game, 'getBoundingClientRect')
          .mockReturnValueOnce({ x: 259, y: -231 })
          .mockReturnValueOnce({ x: 199, y: -131 })
          .mockReturnValueOnce({ x: 239, y: -96 })
          .mockReturnValueOnce({ x: 279, y: -61 })
          .mockReturnValueOnce({ x: 319, y: -26 })
          .mockReturnValueOnce({ x: 359, y: 9 })
          .mockReturnValueOnce({ x: 399, y: 44 })
          .mockReturnValueOnce({ x: 439, y: 79 })
          // zoom back in
          .mockReturnValueOnce({ x: 453.84375, y: 92 })
          .mockReturnValueOnce({ x: 439, y: 79 })
          .mockReturnValueOnce({ x: 399, y: 44 })
          .mockReturnValueOnce({ x: 359, y: 9 })
          .mockReturnValueOnce({ x: 319, y: -26 })
          .mockReturnValueOnce({ x: 279, y: -61 })
          .mockReturnValueOnce({ x: 239, y: -96 })
          .mockReturnValueOnce({ x: 199, y: -131 })

        expect(zoomInButton).toBeDisabled();
        expect(zoomOutButton).not.toBeDisabled();

        // starting point
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({ left: '0px', top: '0px' });
        expect(image).toHaveAttribute('height', '700');
        expect(image).toHaveAttribute('width', '800');

        // activate keyboard navigation
        await user.tab();
        expect(sights).toBeVisible();
        expect(canvas).toHaveFocus();

        // move sights to the center of the canvas
        await user.keyboard('{Shift>}{ArrowRight>17/}{/Shift}');
        await user.keyboard('{ArrowRight>5/}');
        await user.keyboard('{Shift>}{ArrowDown>15/}{/Shift}');

        // activate zoom out button
        await user.tab();
        await user.tab();
        await user.tab();
        await user.tab();

        expect(zoomOutButton).toHaveFocus();

        // zoom out to 90%
        await user.keyboard('{Enter}');
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({ left: '-60px', top: '-140px' });
        expect(image).toHaveAttribute('height', '630');
        expect(image).toHaveAttribute('width', '720');

        expect(zoomInButton).not.toBeDisabled();

        // zoom out to 80%
        await user.keyboard('{Enter}');
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({  left: '-20px', top: '-105px' });
        expect(image).toHaveAttribute('height', '560');
        expect(image).toHaveAttribute('width', '640');

        // zoom out to 70%
        await user.keyboard('{Enter}');
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({  left: '20px', top: '-70px' });
        expect(image).toHaveAttribute('height', '490');
        expect(image).toHaveAttribute('width', '560');

        // zoom out to 60%
        await user.keyboard('{Enter}');
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({  left: '60px', top: '-35px' });
        expect(image).toHaveAttribute('height', '420');
        expect(image).toHaveAttribute('width', '480');

        // zoom out to 50%
        await user.keyboard('{Enter}');
        expect(gamePlacement).toHaveStyle({ left: '100px', top: '0px' });
        expect(game).toHaveStyle({  left: '0px', top: '0px' });
        expect(image).toHaveAttribute('height', '350');
        expect(image).toHaveAttribute('width', '400');

        // zoom out to 40%
        await user.keyboard('{Enter}');
        expect(gamePlacement).toHaveStyle({ left: '140px', top: '0px' });
        expect(game).toHaveStyle({  left: '0px', top: '35px' });
        expect(image).toHaveAttribute('height', '280');
        expect(image).toHaveAttribute('width', '320');

        // zoom out to 30%
        await user.keyboard('{Enter}');
        expect(gamePlacement).toHaveStyle({ left: '180px', top: '0px' });
        expect(game).toHaveStyle({  left: '0px', top: '70px' });
        expect(image).toHaveAttribute('height', '210');
        expect(image).toHaveAttribute('width', '240');

        // zoom out to 26% (full zoom out)
        await user.keyboard('{Enter}');
        expect(gamePlacement).toHaveStyle({ left: '194.857px', top: '0px' });
        expect(game).toHaveStyle({  left: '0px', top: '83px' });
        expect(image).toHaveAttribute('height', '184');
        expect(image).toHaveAttribute('width', '210.286');

        expect(zoomInButton).not.toBeDisabled();
        expect(zoomOutButton).toBeDisabled();
        expect(zoomInButton).toHaveFocus()

        // zoom back in to 30%
        await user.keyboard('{Enter}');
        expect(gamePlacement).toHaveStyle({ left: '180px', top: '0px' });
        expect(game).toHaveStyle({  left: '0px', top: '70px' });
        expect(image).toHaveAttribute('height', '210');
        expect(image).toHaveAttribute('width', '240');

        // zoom back in to 40%
        await user.keyboard('{Enter}');
        expect(gamePlacement).toHaveStyle({ left: '140px', top: '0px' });
        expect(game).toHaveStyle({  left: '0px', top: '35px' });
        expect(image).toHaveAttribute('height', '280');
        expect(image).toHaveAttribute('width', '320');

        // zoom back in to 50%
        await user.keyboard('{Enter}');
        expect(gamePlacement).toHaveStyle({ left: '100px', top: '0px' });
        expect(game).toHaveStyle({  left: '0px', top: '0px' });
        expect(image).toHaveAttribute('height', '350');
        expect(image).toHaveAttribute('width', '400');

        // zoom back in to 60%
        await user.keyboard('{Enter}');
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({  left: '60px', top: '-35px' });
        expect(image).toHaveAttribute('height', '420');
        expect(image).toHaveAttribute('width', '480');

        // zoom back in to 70%
        await user.keyboard('{Enter}');
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({  left: '20px', top: '-70px' });
        expect(image).toHaveAttribute('height', '490');
        expect(image).toHaveAttribute('width', '560');
        
        // zoom back in to 80%
        await user.keyboard('{Enter}');
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({  left: '-20px', top: '-105px' });
        expect(image).toHaveAttribute('height', '560');
        expect(image).toHaveAttribute('width', '640');

        // zoom back in to 90%
        await user.keyboard('{Enter}');
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({ left: '-60px', top: '-140px' });
        expect(image).toHaveAttribute('height', '630');
        expect(image).toHaveAttribute('width', '720');

        // zoom back in to 100%
        await user.keyboard('{Enter}');
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({ left: '-100px', top: '-175px'  });
        expect(image).toHaveAttribute('height', '700');
        expect(image).toHaveAttribute('width', '800');

        expect(zoomInButton).toBeDisabled();
        expect(zoomOutButton).not.toBeDisabled();

      });

      test('Zooming - max zoom out is 28%', async () => {

        const { container } = await renderGame({ containerHeight: 410, objects: [boxObject] });

        const gamePlacement = container.querySelector('.game-placement');
        const game = container.querySelector('.game');
        const image = screen.getByAltText('Seek and find');
        const canvas = container.querySelector('canvas.findable');

        // initial placement of canvas, relative to the document
        jest.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ x: 128, y: 106 });

        const zoomInButton = screen.getByRole('button', { name: 'Zoom in' });
        const zoomOutButton = screen.getByRole('button', { name: 'Zoom out' });

        expect(zoomInButton).toBeDisabled();
        expect(zoomOutButton).not.toBeDisabled();

        // starting point
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({ left: '0px', top: '0px' });
        expect(image).toHaveAttribute('height', '700');
        expect(image).toHaveAttribute('width', '800');

        // move to the center of the canvas 170
        // height: (image height (700) - container height (360)) / 2 == 170 diff
        fireEvent(canvas, getMouseEvent('mousedown', { clientX: 423, clientY: 339 }));
        fireEvent(canvas, getMouseEvent('mousemove', { clientX: 323, clientY: 169 }));
        expect(game).toHaveStyle({ left: '-100px', top: '-170px'  });

        // zoom out to 90%
        await user.click(zoomOutButton);
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({ left: '-60px', top: '-135px' });
        expect(image).toHaveAttribute('height', '630');
        expect(image).toHaveAttribute('width', '720');

        expect(zoomInButton).not.toBeDisabled();

        // zoom out to 80%
        await user.click(zoomOutButton);
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({  left: '-20px', top: '-100px' });
        expect(image).toHaveAttribute('height', '560');
        expect(image).toHaveAttribute('width', '640');

        // zoom out to 70%
        await user.click(zoomOutButton);
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({  left: '20px', top: '-65px' });
        expect(image).toHaveAttribute('height', '490');
        expect(image).toHaveAttribute('width', '560');

        // zoom out to 60%
        await user.click(zoomOutButton);
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({  left: '60px', top: '-30px' });
        expect(image).toHaveAttribute('height', '420');
        expect(image).toHaveAttribute('width', '480');

        // zoom out to 50%
        await user.click(zoomOutButton);
        expect(gamePlacement).toHaveStyle({ left: '100px', top: '0px' });
        expect(game).toHaveStyle({  left: '0px', top: '5px' });
        expect(image).toHaveAttribute('height', '350');
        expect(image).toHaveAttribute('width', '400');

        // zoom out to 40%
        await user.click(zoomOutButton);
        expect(gamePlacement).toHaveStyle({ left: '140px', top: '0px' });
        expect(game).toHaveStyle({  left: '0px', top: '40px' });
        expect(image).toHaveAttribute('height', '280');
        expect(image).toHaveAttribute('width', '320');

        // zoom out to 28% (full zoom out)
        // 30% is skipped because it is too close to 26%
        await user.click(zoomOutButton);
        expect(gamePlacement).toHaveStyle({ left: '189.143px', top: '0px' });
        expect(game).toHaveStyle({  left: '0px', top: '83px' });
        expect(image).toHaveAttribute('height', '194');
        expect(image).toHaveAttribute('width', '221.714');

        expect(zoomInButton).not.toBeDisabled();
        expect(zoomOutButton).toBeDisabled();

        // zoom back in to 40%
        // 30% is skipped because it is too close to 28%
        await user.click(zoomInButton);
        expect(gamePlacement).toHaveStyle({ left: '140px', top: '0px' });
        expect(game).toHaveStyle({  left: '0px', top: '40px' });
        expect(image).toHaveAttribute('height', '280');
        expect(image).toHaveAttribute('width', '320');

        // zoom back in to 50%
        await user.click(zoomInButton);
        expect(gamePlacement).toHaveStyle({ left: '100px', top: '0px' });
        expect(game).toHaveStyle({  left: '0px', top: '5px' });
        expect(image).toHaveAttribute('height', '350');
        expect(image).toHaveAttribute('width', '400');

        // zoom back in to 60%
        await user.click(zoomInButton);
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({  left: '60px', top: '-30px' });
        expect(image).toHaveAttribute('height', '420');
        expect(image).toHaveAttribute('width', '480');

        // zoom back in to 70%
        await user.click(zoomInButton);
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({  left: '20px', top: '-65px' });
        expect(image).toHaveAttribute('height', '490');
        expect(image).toHaveAttribute('width', '560');
        
        // zoom back in to 80%
        await user.click(zoomInButton);
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({  left: '-20px', top: '-100px' });
        expect(image).toHaveAttribute('height', '560');
        expect(image).toHaveAttribute('width', '640');

        // zoom back in to 90%
        await user.click(zoomInButton);
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({ left: '-60px', top: '-135px' });
        expect(image).toHaveAttribute('height', '630');
        expect(image).toHaveAttribute('width', '720');

        // zoom back in to 100%
        await user.click(zoomInButton);
        expect(gamePlacement).toHaveStyle({ left: '0px', top: '0px' });
        expect(game).toHaveStyle({ left: '-100px', top: '-170px'  });
        expect(image).toHaveAttribute('height', '700');
        expect(image).toHaveAttribute('width', '800');

        expect(zoomInButton).toBeDisabled();
        expect(zoomOutButton).not.toBeDisabled();

      });

    });

    describe('Hint', () => {

      test('Hint is removed after timeout', async () => {

        const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

        const { container } = await renderGame({ objects: [boxObject] });

        const game = container.querySelector('.game');
        const image = screen.getByAltText('Seek and find');

        // starting point
        expect(game).toHaveStyle({ left: '0px', top: '0px' });
        expect(container.querySelector('canvas.hint')).not.toBeInTheDocument();
        expect(image).toHaveAttribute('height', '700');
        expect(image).toHaveAttribute('width', '800');

        const hintButton = screen.getByRole('button', { name: 'Give me a hint' });
        await user.click(hintButton);
        
        // hint is in the document
        expect(container.querySelector('canvas.hint')).toBeInTheDocument();
        
        // canvas moves to the hint
        expect(game).toHaveStyle({ left: '-23.75px', top: '-148.75px' });

        // image resizes
        expect(image).toHaveAttribute('height', '490');
        expect(image).toHaveAttribute('width', '560');

        act(() => {
          jest.runAllTimers();
        });
        
        // hint is not in the document
        expect(container.querySelector('canvas.hint')).not.toBeInTheDocument();

        setTimeoutSpy.mockRestore();

      });

      test('Hint is removed after user request', async () => {

        const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

        const { container } = await renderGame({ objects: [boxObject] });

        const game = container.querySelector('.game');
        const image = screen.getByAltText('Seek and find');

        // starting point
        expect(game).toHaveStyle({ left: '0px', top: '0px' });
        expect(container.querySelector('canvas.hint')).not.toBeInTheDocument();
        expect(image).toHaveAttribute('height', '700');
        expect(image).toHaveAttribute('width', '800');

        const hintButton = screen.getByRole('button', { name: 'Give me a hint' });
        await user.click(hintButton);
        
        // hint is in the document
        expect(container.querySelector('canvas.hint')).toBeInTheDocument();

        // remove hint button is in the document
        const removeHintButton = screen.getByRole('button', { name: 'Remove hint' });
        expect(removeHintButton).toHaveFocus();

        // user requests to remove hint
        await user.click(hintButton);

        // hint is not in the document
        expect(container.querySelector('canvas.hint')).not.toBeInTheDocument();

        // hint button again has focus
        expect(hintButton).toHaveFocus();

        expect(clearTimeout).toHaveBeenCalledTimes(1);

        clearTimeoutSpy.mockRestore();

      });

      test('Duplicate hints aren\'t given until all hints are shown', async () => {

        const { container } = await renderGame({ objects: bunchOfObjects.slice(0, 10) });
        const hintButton = screen.getByRole('button', { name: 'Give me a hint' });

        const hintsGiven = [];

        for (let i = 0; i < 10; i++) {
          await user.click(hintButton);
          hintsGiven.push(container.querySelector('canvas.hint').dataset.id);
          await user.click(hintButton);
        }

        // 10 hints given
        expect(hintsGiven.length).toEqual(10);

        // all hints given should be unqique
        const uniqueHints = [...new Set(hintsGiven)];
        expect(hintsGiven.length).toEqual(uniqueHints.length);

        // turn on hint
        await user.click(hintButton);
        
        const activeHint = container.querySelector('canvas.hint');

        // turn off hint
        await user.click(hintButton);

        expect(hintsGiven).toContain(activeHint.dataset.id);

      });

      test('If an item is found, it does not get factored into hints anymore', async () => {

        const objects = bunchOfObjects.slice(0, 10);
        const { container } = await renderGame({ objects });

        const canvas = container.querySelector('canvas.findable');
        const context = canvas.getContext('2d');

        const hintButton = screen.getByRole('button', { name: 'Give me a hint' });

        const hintsGiven = [];

        for (let i = 0; i < 5; i++) {
          await user.click(hintButton);
          hintsGiven.push(container.querySelector('canvas.hint').dataset.id);
          await user.click(hintButton);
        }

        // get an object that has not been given a hint
        const notFound = objects.filter(object => !hintsGiven.includes(object.id))
        const randomNotFound = notFound[Math.floor(Math.random() * notFound.length)];

        // find the random object
        context.isPointInPath.mockImplementation(path => path.name === randomNotFound.id);
        const clickCoords = {
          offsetX: randomNotFound.hintCoords.x + 50,
          offsetY: randomNotFound.hintCoords.y + 50,
        }
        fireEvent(canvas, getMouseEvent('mousedown', clickCoords, true));
        fireEvent(canvas, getMouseEvent('mouseup', clickCoords));

        // activate a bunch more hints
        for (let i = 0; i < 30; i++) {
          await user.click(hintButton);
          hintsGiven.push(container.querySelector('canvas.hint').dataset.id);
          await user.click(hintButton);
        }

        // only get the unique hints
        const uniqueHints = [...new Set(hintsGiven)];

        // does not contain randomFound
        expect(uniqueHints).not.toContain(randomNotFound.id);
      });

    });

    describe('Legend', () => {

      describe('Pointers', () => {

        test('Can scroll when there are more thumbnails than space allows', async() => {

          const { container } = await renderGame({ objects: bunchOfObjects });
          
          const legend = container.querySelector('.legend-container');

          const thumbnails = container.querySelector('.legend-container .thumbnails');
          expect(thumbnails).toHaveStyle({ 'left': '0px' });

          const scrollLeftButton = within(legend).getByRole('button', { name: 'Scroll left' });
          const scrollRightButton = within(legend).getByRole('button', { name: 'Scroll right' });

          expect(scrollLeftButton).toBeInTheDocument();
          expect(scrollLeftButton).toBeDisabled();
          expect(scrollRightButton).toBeInTheDocument();
          expect(scrollRightButton).not.toBeDisabled();

          // hold down the scroll left button for 1 second
          act(() => fireEvent.pointerDown(scrollLeftButton))
          act(() => jest.advanceTimersByTime(1000));
          act(() => fireEvent.pointerUp(scrollLeftButton))

          // thumbnails cannot scroll further left
          expect(thumbnails).toHaveStyle({ 'left': '0px' });

          // hold down the scroll right button for 1 second
          act(() => fireEvent.pointerDown(scrollRightButton));
          act(() => jest.advanceTimersByTime(1000));
          act(() => fireEvent.pointerUp(scrollRightButton));

          expect(thumbnails).toHaveStyle({ 'left': '-400px' }); // 10 x thumbnailWidth (40)
          expect(scrollLeftButton).not.toBeDisabled();
          expect(scrollRightButton).not.toBeDisabled();

          // hold down the scroll right button for 1 more second
          act(() => fireEvent.pointerDown(scrollRightButton))
          act(() => jest.advanceTimersByTime(1000));
          act(() => fireEvent.pointerUp(scrollRightButton))

          expect(thumbnails).toHaveStyle({ 'left': '-779px' }); // max
          expect(scrollLeftButton).not.toBeDisabled();
          expect(scrollRightButton).toBeDisabled();

          // hold down the scroll right button for 1 more second
          act(() => fireEvent.pointerDown(scrollRightButton))
          act(() => jest.advanceTimersByTime(1000));
          act(() => fireEvent.pointerUp(scrollRightButton))

          expect(thumbnails).toHaveStyle({ 'left': '-779px' }); // still at max

          // hold down the scroll left button for 1 second
          act(() => fireEvent.pointerDown(scrollLeftButton))
          act(() => jest.advanceTimersByTime(1000));
          act(() => fireEvent.pointerUp(scrollLeftButton))

          expect(thumbnails).toHaveStyle({ 'left': '-379px' });

          // hold down the scroll left button for 1 more second
          act(() => fireEvent.pointerDown(scrollLeftButton))
          act(() => jest.advanceTimersByTime(1000));
          act(() => fireEvent.pointerUp(scrollLeftButton))

          expect(thumbnails).toHaveStyle({ 'left': '0px' });
          expect(scrollLeftButton).toBeDisabled();
          expect(scrollRightButton).not.toBeDisabled();

        });

        test('Keyboard users can navigate the legend', async() => {

          const { container } = await renderGame({ objects: bunchOfObjects });
          
          const legend = container.querySelector('.legend-container');

          const thumbnails = container.querySelector('.legend-container .thumbnails');
          expect(thumbnails).toHaveStyle({ 'left': '0px' });

          const scrollLeftButton = within(legend).getByRole('button', { name: 'Scroll left' });
          const scrollRightButton = within(legend).getByRole('button', { name: 'Scroll right' });

          await user.tab();
          await user.tab();
          await user.tab();
          await user.tab();
          await user.tab();
          await user.tab();

          expect(scrollRightButton).toHaveFocus();

          // hold down the scroll right button for 1 second
          await user.keyboard('{Enter>}');
          act(() => jest.advanceTimersByTime(1000));
          await user.keyboard('{/Enter}');

          expect(thumbnails).toHaveStyle({ 'left': '-400px' }); // 10 x thumbnailWidth (40)
          expect(scrollLeftButton).not.toBeDisabled();
          expect(scrollRightButton).not.toBeDisabled();

          // hold down the scroll right button for 1 more second
          await user.keyboard('{Enter>}');
          act(() => jest.advanceTimersByTime(1000));
          await user.keyboard('{/Enter}');

          expect(thumbnails).toHaveStyle({ 'left': '-779px' }); // max
          expect(scrollLeftButton).not.toBeDisabled();
          expect(scrollRightButton).toBeDisabled();

          // hold down the scroll right button for 1 more second
          await user.keyboard('{Enter>}');
          act(() => jest.advanceTimersByTime(1000));
          await user.keyboard('{/Enter}');

          expect(thumbnails).toHaveStyle({ 'left': '-779px' }); // still at max

          await user.tab({ shift: true });
          expect(scrollLeftButton).toHaveFocus();

          // hold down the scroll left button for 1 second
          await user.keyboard('{Enter>}');
          act(() => jest.advanceTimersByTime(1000));
          await user.keyboard('{/Enter}');

          expect(thumbnails).toHaveStyle({ 'left': '-379px' });

          // hold down the scroll left button for 1 more second
          await user.keyboard('{Enter>}');
          act(() => jest.advanceTimersByTime(1000));
          await user.keyboard('{/Enter}');

          expect(thumbnails).toHaveStyle({ 'left': '0px' });
          expect(scrollLeftButton).toBeDisabled();
          expect(scrollRightButton).not.toBeDisabled();

        });

        test('No scroll option present when all thumbnails fit in alloted space', async() => {

          const { container } = await renderGame();

          const legend = container.querySelector('.legend-container');

          expect(within(legend).queryByRole('button', { name: 'Scroll left' })).not.toBeInTheDocument();
          expect(within(legend).queryByRole('button', { name: 'Scroll right' })).not.toBeInTheDocument();

        });

      });

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
      
      jest.runAllTimers();

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

  });

});
