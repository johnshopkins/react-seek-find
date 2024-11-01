/**
 * @jest-environment jsdom
 */

import React, { act } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import Game from './index';
import FindableObject from '../../objects/FindableObject';
import getMouseEvent from '../../../../tests/helpers/getMouseEvent';
import getTouchEvent from '../../../../tests/helpers/getTouchEvent';
import { saveGameState } from '../../lib/persistance';

const boxObject = new FindableObject(
  'box',
  'box',
  'https://picsum.photos/143/143',
  () => {
    const path = new Path2D();
    path.moveTo(236.0, 236.0);
    path.lineTo(64.0, 236.0);
    path.lineTo(64.0, 64.0);
    path.lineTo(236.0, 64.0);
    path.lineTo(236.0, 236.0);
    path.closePath()
    path.name = 'box'; // for mocking mockImplementation
    return path;
  },
  { x: 10, y: 10 }
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
  { x: 10, y: 10 }
);

const getProps = (override) => {
  return {
    imageWidth: 1600,
    imageHeight: 1000,
    image: 'https://picsum.photos/1600/1000',
    objects: [boxObject, circleObject],
    ...override
  }
};

let GameContainer;
let user;

beforeAll(() => {

  GameContainer = null;
  document.body.innerHTML = '';

  GameContainer = document.createElement('div');
  GameContainer.setAttribute('max-width', '400px');

  window.screen.orientation = { type: 'portrait-primary' };

  Element.prototype.scroll = jest.fn();

  Object.defineProperty(document.documentElement, 'clientHeight', { value: 500, writable: true });
  Object.defineProperty(document.documentElement, 'clientWidth', { value: 800, writable: true });

  Object.defineProperty(GameContainer, 'clientWidth', { value: 800, writable: true });

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

  // this will only be updated when the component updates.
  // trigger it with a screen resize
  const em = document.querySelector('.container > div');
  Object.defineProperty(em, 'clientWidth', { value: 16, writable: true });

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
      expect(container.querySelector('.game-container .magnifying glass')).not.toBeInTheDocument();
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
      fireEvent(canvas, getMouseEvent('mousedown', { clientX: 100, clientY: 100 }, true));
      fireEvent(canvas, getMouseEvent('mouseup', { clientX: 100, clientY: 100 }));

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

          act(() => {
            // trigger a screen resize so em container is calculated
            window.resizeTo(800, 600)
          });

          const game = container.querySelector('.game');

          // original positioning
          expect(game).toHaveStyle({ left: '0px', top: '0px' });

          // mock mousemove
          const canvas = container.querySelector('canvas.findable');

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

      });

      describe('Touch', () => {

        test('Moving canvas within bounds by 2-touch scroll', async () => {

          const { container } = await renderGame();

          act(() => {
            // trigger a screen resize so em container is calculated
            window.resizeTo(800, 600)
          });

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

          act(() => {
            // trigger a screen resize so em container is calculated
            window.resizeTo(800, 600)
          });

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

        // test('Moving canvas within bounds by keyboard navigation', async () => {

        //   const { container } = await renderGame();

        //   const sights = container.querySelector('.magnifying-glass');
        //   const canvas = container.querySelector('canvas.findable');

        //   // expect(sights).toHaveAttribute('style', 'display: none; left: 0px; top: 0px; height: 128px; width: 128px;');
        //   expect(sights).not.toBeVisible();
        //   // expect(canvas).not.toHaveFocus();

        //   // await userEvent.tab();
        //   // expect(sights).toBeVisible();
        //   // expect(canvas).toHaveFocus();

        //   // await userEvent.type(document.activeElement, '{shift}{arrowright}{/shift}');
        //   // // await userEvent.type(canvas, '{shift}{arrowright}{/shift}');
        //   // expect(sights).toHaveAttribute('style', 'display: block; left: 20px; top: 0px; height: 128px; width: 128px;');

        //   // await userEvent.type(canvas, '{shift}{arrowright}{/shift}');
        //   // expect(sights).toHaveAttribute('style', 'display: block; left: 22px; top: 0px; height: 128px; width: 128px;')

        //   // await userEvent.tab();
        //   // await userEvent.keyboard('{Enter}');

        //   // expect(container.querySelector('.overlay-container')).toBeVisible();

        //   // const closeButton = getByLabelText('Close instructions');
        //   // const readyButton = getByText("I'm ready to play!");

        //   // expect(closeButton).toHaveFocus();

        //   // await userEvent.tab();
        //   // expect(readyButton).toHaveFocus();

        //   // // we don't trab the tab in the overlay
        //   // await userEvent.tab();
        //   // expect(document.body).toHaveFocus()


        //   // await userEvent.tab();
        //   // expect(closeButton).toHaveFocus();

        //   // // close the overlay
        //   // await userEvent.keyboard('{Enter}');
        //   // expect(container.querySelector('.overlay-container')).not.toBeInTheDocument();

        //   // // instructions button regains focus
        //   // expect(container.querySelector('button.instructions')).toHaveFocus();

        // });

      });

    });

    describe('Scaling and sizing', () => {

    });

    test('Hint', async () => {

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
