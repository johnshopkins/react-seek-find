/*global dataLayer*/
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import Illustration from '../Illustration';
import InstructionsOverlay from '../InstructionsOverlay';
import Legend from '../Legend';
import ResizeWatcher from '@johnshopkins/jhu-wds/src/shared/js/utils/watch-window-resize'
import * as settings from '../../../css/utils/shared-variables.scss';
import { clearGameState, loadGameState, saveGameState } from '../../lib/persistance';
import './style.scss';

if (!window.dataLayer) {
  window.dataLayer = [];
}

/**
 * The container of the game, which manages the game state.
 */
class Game extends Component {

  constructor(props) {

    super(props);

    // the DOM element the game is contained in. helps determine view
    this.container = props.container;
    this.containerRef = createRef();

    // // for testing
    // clearGameState(this.props.storageKey);

    // combine stored user data with default user data
    const userData = {
      bonusComplete: false,
      gameComplete: false,
      found: [],
      seenInstructions: false,
      ...loadGameState(this.props.storageKey)
    }

    // organize the objects by ID
    const objects = {};
    const findableObjects = !userData.gameComplete ? this.props.objects : [...this.props.objects, ...this.props.bonusObjects];
    findableObjects.forEach(object => {
      objects[object.id] = object;
    });

    // combine stored and default state
    this.state = {
      focused: false,
      isFullscreen: false,
      isKeyboardFocused: false,
      browserHeight: document.documentElement.clientHeight,
      browserWidth: document.documentElement.clientWidth,
      openInstructions: userData.seenInstructions === false,
      objects: objects,
      toFind: this.props.objects.reduce((accumulator, object) => accumulator + (object.getType() === '1:1' ? 1 : object.objects.length), 0),
      ...this.getViewState(true),
      ...userData,
    };

    this.closeInstructions = this.closeInstructions.bind(this);
    this.getViewState = this.getViewState.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyboardFocusChange = this.handleKeyboardFocusChange.bind(this);
    this.handleFoundObject = this.handleFoundObject.bind(this);
    this.openInstructions = this.openInstructions.bind(this);
    this.playBonusRound = this.playBonusRound.bind(this);
    this.replay = this.replay.bind(this);
    this.saveGame = this.saveGame.bind(this);
    this.scaleToFit = this.scaleToFit.bind(this);
    this.setViewState = this.setViewState.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.zoomTo = this.zoomTo.bind(this);
  }

  componentDidMount() {

    this.setViewState(false, () => {
      this.props.onResize({
        browserHeight: this.state.browserHeight,
        buffer: this.state.buffer,
        gameHeight: this.state.height,
        gameWidth: this.state.width,
      });
    });

    ResizeWatcher.startWatching();

    window.addEventListener('jhu:winresize:done', e => {

      const newState = {
        browserHeight: document.documentElement.clientHeight,
        browserWidth: document.documentElement.clientWidth,
        orientation: window.screen.orientation.type,
      };

      // make sure the size actually changed (iOS triggers the resize event too much)
      // see: https://johnkavanagh.co.uk/articles/understanding-phantom-window-resize-events-in-ios/
      
      // note: in iOS, going from landscape to portrait reports the same
      // height and width, so we must also check window.orientation
      if (this.state.browserHeight !== newState.browserHeight || this.state.browserWidth !== newState.browserWidth || this.state.orientation !== newState.orientation) {
        this.setViewState(newState, () => {
          this.props.onResize({
            browserHeight: this.state.browserHeight,
            buffer: this.state.buffer,
            gameHeight: this.state.height,
            gameWidth: this.state.width,
          });
        });
      } else {
        this.setState({
          browserHeight: this.state.browserHeight,
          buffer: this.state.buffer,
          gameHeight: this.state.height,
          gameWidth: this.state.width,
        })
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isFullscreen !== this.state.isFullscreen) {
      const html = document.getElementsByTagName('html')[0];
      if (this.state.isFullscreen) {
        html.classList.add('fullscreen');
        window.addEventListener('keydown', this.handleKeyDown);
      } else {
        html.classList.remove('fullscreen');
        window.removeEventListener('keydown', this.handleKeyDown);
      }

      this.setViewState();
    }
  }

  round(num) {
    return Math.round(num / 10) * 10;
  }

  roundDown(num) {
    return Math.floor(num / 10) * 10;
  }

  roundUp(num) {
    return Math.ceil(num / 10) * 10;
  }

  getViewState(init = false, additionalState = {}) {

    let buffer, width, height;

    if (!this.state || (this.state && !this.state.isFullscreen)) {
      // width of game container (minus padding)
      const styles = window.getComputedStyle(this.container);
      width = !this.props.containerWidth ? this.container.clientWidth - parseFloat(styles.paddingLeft || 0) - parseFloat(styles.paddingRight || 0) : this.props.containerWidth;

      // small buffer around the game
      buffer = document.documentElement.clientHeight > 600 ? 50 : 20;
      height = !this.props.containerHeight ? document.documentElement.clientHeight - buffer : this.props.containerHeight;

    } else {
      buffer = 0;
      width = window.innerWidth;
      height = window.innerHeight;
    }

    // base breakpoint on the width of the container, not the user's screen
    const breakpoint = this.getBreakpoint(width);

    const legendHeight = parseInt(settings[`legendThumbnailHeight_${breakpoint}`]) + (parseInt(settings[`legendPadding_${breakpoint}`]) * 2);

    const illustrationContainerHeight = height - legendHeight;
    const illustrationContainerWidth = width;

    // factor in the buffer size to figure out max zoom ou
    const bufferSize = (parseInt(settings.utilitiesEdgeSpace) * 4) + (parseInt(settings.miniMap) * 2);
    const maxZoomOutWidth = (illustrationContainerWidth - bufferSize >= this.props.imageWidth ? 1 : (illustrationContainerWidth  - bufferSize) / this.props.imageWidth) * 100;
    const maxZoomOutHeight = (illustrationContainerHeight - bufferSize >= this.props.imageHeight ? 1 : (illustrationContainerHeight - bufferSize) / this.props.imageHeight) * 100;
    const maxZoomOut = Math.min(maxZoomOutWidth, maxZoomOutHeight); // allow to zoom out to max width AND height

    // starting zoom out (do not take buffer into account)
    let scale;
    if (init) {
      const startZoomOutWidth = illustrationContainerWidth >= this.props.imageWidth ? 1 : (illustrationContainerWidth / this.props.imageWidth) * 100;
      const startZoomOutHeight = illustrationContainerHeight >= this.props.imageHeight ? 1 : (illustrationContainerHeight / this.props.imageHeight) * 100;
      scale = Math.min(startZoomOutWidth, startZoomOutHeight);

      if (this.props.test) {
        scale = 100;
      }

    } else {
      if (this.state.scale >= maxZoomOut) {
        scale = this.state.scale;
      } else {
        // scale not available after resize. force up to new max zoom out
        scale = maxZoomOut;
      } 
    }

    return {
      breakpoint,
      buffer,
      height,
      illustrationContainerHeight,
      illustrationContainerWidth,
      maxZoomOut,
      orientation: window.screen.orientation.type, // helps with detecting resize on mobile
      scale,
      width,
      zoomInLimitReached: scale === 100, // the farthest IN you can zoom
      zoomOutLimitReached: scale === maxZoomOut, // the farthest OUT you can zoom
      ...additionalState,
    };
  }

  setViewState(additionalState = {}, callback = () => {}) {
    this.setState(this.getViewState(false, additionalState), callback);
  }

  getBreakpoint(width) {

    if (width < parseInt(settings.breakpoint_small)) {
      return 'small';
    }

    if (width < parseInt(settings.breakpoint_medium)) {
      return 'medium';
    }

    if (width < parseInt(settings.breakpoint_large)) {
      return 'large';
    }

    return 'xlarge';
  }

  handleFoundObject(foundObject) {

    if (this.state.found.includes(foundObject.id)) {
      // object already found
      return false;
    }

    const gameAlreadyComplete = this.state.gameComplete;

    this.setState(state => {

      const newState = {
        found: [...state.found] // handle immutably to prevent bugs
      };

      newState.found.push(foundObject.id);

      const round = !state.gameComplete ? 'game' : 'bonus'
      newState[`${round}Complete`] = newState.found.length === this.state.toFind;

      if (!state.gameComplete) {
        // game round
        newState.gameComplete = newState.found.length === this.state.toFind;
      } else {
        // bonus round
        newState.bonusComplete = newState.found.length === this.state.toFind;
      }

      return newState;

    }, () => {

      dataLayer.push({
        event: 'level_up',
        level: this.state.found.length,
      });

      if (!gameAlreadyComplete && this.state.gameComplete) {

        setTimeout(() => {
          this.props.onGameComplete();
          this.playBonusRound();
        }, 1000)

        dataLayer.push({
          event: 'unlock_achievement',
          achievement_id: 'game_complete',
        });

      } else if (this.state.bonusComplete) {

        setTimeout(() => {
          this.props.onBonusComplete();
        }, 1000)

        dataLayer.push({
          event: 'unlock_achievement',
          achievement_id: 'bonus_complete',
        });
      }

      this.saveGame({
        bonusComplete: this.state.bonusComplete,
        found: this.state.found,
        gameComplete: this.state.gameComplete,
      })
    });

    return true;
  }

  saveGame(changed = {}) {
    saveGameState({
      bonusComplete: this.state.bonusComplete,
      found: this.state.found,
      gameComplete: this.state.gameComplete,
      seenInstructions: this.state.seenInstructions,
      ...changed
    }, this.props.storageKey)
  }

  replay() {

    const objects = {};
    this.props.objects.forEach(object => {
      objects[object.id] = object;
    });

    this.setState({
      found: [],
      gameComplete: false,
      bonusComplete: false,
      objects
    })

    this.saveGame({
      found: [],
      seenInstructions: true,
      gameComplete: false,
      bonusComplete: false,
    });
  }

  playBonusRound() {

    this.setState(state => {

      const objects = {};
      const findableObjects = !state.gameComplete ? this.props.objects : [...this.props.bonusObjects, ...this.props.objects];
      findableObjects.forEach(object => {
        objects[object.id] = object;
      });

      const toFind = Object.values(objects).reduce((accumulator, object) => accumulator + (object.getType() === '1:1' ? 1 : object.objects.length), 0);

      return {
        objects,
        toFind
      }
    });
  }
  
  zoomIn(callback = () => {}) {

    let newZoom = !this.state.zoomOutLimitReached ?
      // go up to the next 10
      this.round(this.state.scale + 10) :
      // round the current scale up to the nearest 10
      this.roundUp(this.state.scale);

    if (newZoom - this.state.scale < 3) {
      newZoom = this.round(this.state.scale + 10);
    }

    this.zoomTo(newZoom, callback);
  }

  zoomOut(callback = () => {}) {
    let newZoom = this.round(this.state.scale - 10);

    if (newZoom - this.state.maxZoomOut < 3) {
      newZoom = this.state.maxZoomOut;
    }

    this.zoomTo(newZoom, callback);
  }

  zoomTo(value, callback = () => {}) {

    let newState = {};
    let limitReached = false;

    if (value >= 100) {
      newState = {
        scale: 100,
        zoomInLimitReached: true,
        zoomOutLimitReached: false,
      };
      limitReached = true;
    } else if (value <= this.state.maxZoomOut) {
      newState = {
        scale: this.state.maxZoomOut,
        zoomInLimitReached: false,
        zoomOutLimitReached: true,
      }
      limitReached = true;
    } else {
      newState = {
        scale: value,
        zoomInLimitReached: false,
        zoomOutLimitReached: false,
      }
    }

    this.setState(newState, callback.call(null, newState.scale / 100, limitReached));
  }

  closeInstructions() {
    this.setState({
      openInstructions: false,
      seenInstructions: true,
    });

    this.saveGame({ seenInstructions: true });
  }

  openInstructions() {
    dataLayer.push({ event: 'tutorial_begin' });
    this.setState({ openInstructions: true });
  }

  handleKeyboardFocusChange(focused) {
    if (focused !== this.state.isKeyboardFocused) {
      this.setState({ isKeyboardFocused: focused });
    }
  }

  scaleToFit(height, width, callback = () => {}) {

    // add a little buffer around the area to scale to fit to
    const buffer = 30;

    const containerHeight = this.state.illustrationContainerHeight;
    const containerWidth = this.state.illustrationContainerWidth;

    const scale = this.state.scale / 100;

    const scaledHeight = (height + buffer) * scale;
    const scaledWidth = (width + buffer) * scale;

    const zoomOutHeight = (containerHeight / scaledHeight) * this.state.scale;
    const zoomOutWidth = (containerWidth / scaledWidth) * this.state.scale;

    const newZoom = this.roundDown(Math.min(zoomOutHeight, zoomOutWidth));

    this.zoomTo(newZoom, callback);
  }

  handleBlur (e) {
    if (!this.containerRef.current.contains(e.relatedTarget)) {
      this.setState({
        focused: false,
        isKeyboardFocused: false
      });
    }
  }

  handleFocus() {
    if (!this.state.focused) {
      this.setState({ focused: true });
      this.containerRef.current.addEventListener('keyup', (e) => {
        if (e.key === 'Tab') {
          this.setState({ isKeyboardFocused: true });
        }
      }, { once: true })
    }
  }

  handleKeyDown(e) {
    if (e.key === 'Escape') {
      this.toggleFullscreen();
    }
  }

  toggleFullscreen() {
    this.setState((state) => {
      const newValue = !state.isFullscreen;
      return { isFullscreen: newValue };
    }, () => {
      if (!this.state.isFullscreen) {
        this.props.onExitFullscreen();
      }
    });
  }

  render() {

    // contains legend
    const containerStyles = {};

    if (!this.state.isFullscreen) {
      containerStyles.height = `${this.state.height}px`;
      containerStyles.width = `${this.state.width}px`;

    }

    const containerClasses = ['container', this.state.breakpoint];
    if (this.state.isKeyboardFocused) {
      containerClasses.push('keyboard-focused');
    }

    return (
      <div
        ref={this.containerRef}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
      >
        {this.state.openInstructions &&
          <InstructionsOverlay
            breakpoint={this.state.breakpoint}
            isAutoOpen={!this.state.seenInstructions}
            isOpen={this.state.openInstructions}
            onClose={this.closeInstructions}
            style={containerStyles}
          />
        }
        <div className={containerClasses.join(' ')} style={containerStyles} aria-hidden={this.state.openInstructions}>
          <Illustration
            containerHeight={this.state.illustrationContainerHeight}
            containerWidth={this.state.illustrationContainerWidth}
            disableTabbing={this.state.openInstructions}
            found={this.state.found}
            foundKeepAlive={this.props.foundKeepAlive}
            gameComplete={this.state.gameComplete}
            bonusComplete={this.state.bonusComplete}
            hintKeepAlive={this.props.hintKeepAlive}
            imageHeight={this.props.imageHeight}
            imageSrc={this.props.image}
            imageWidth={this.props.imageWidth}
            isFullscreen={this.state.isFullscreen}
            isKeyboardFocused={this.state.isKeyboardFocused}
            objects={Object.values(this.state.objects)}
            onFind={this.handleFoundObject}
            onKeyboardFocusChange={this.handleKeyboardFocusChange}
            openInstructions={this.openInstructions}
            replay={this.replay}
            scale={this.state.scale / 100}
            scaleToFit={this.scaleToFit}
            test={this.props.test}
            toggleFullscreen={this.toggleFullscreen}
            zoomIn={this.zoomIn}
            zoomOut={this.zoomOut}
            zoomInLimitReached={this.state.zoomInLimitReached}
            zoomTo={this.zoomTo}
            zoomOutLimitReached={this.state.zoomOutLimitReached}
          />
          <Legend
            breakpoint={this.state.breakpoint}
            found={this.state.found}
            groups={this.props.groups}
            objects={Object.values(this.state.objects)}
            width={this.state.width}
          />
        </div>
      </div>
    );
  }
}

Game.defaultProps = {
  bonusObjects: [],
  foundKeepAlive: 2000,
  hintKeepAlive: 10000,
  objects: [],
  onBonusComplete: () => {},
  onExitFullscreen: () => {},
  onGameComplete: () => {},
  onResize: () => {},
  storageKey: 'hopkins-seek-find',
  test: false,
};

Game.propTypes = {
  bonusObjects: PropTypes.array,
  containerHeight: PropTypes.number, // for testing convenience
  containerWidth: PropTypes.number, // for testing convenience
  foundKeepAlive: PropTypes.number,
  height: PropTypes.number,
  hintKeepAlive: PropTypes.number,
  image: PropTypes.string.isRequired,
  onExitFullscreen: PropTypes.func.isRequired,
  onBonusComplete: PropTypes.func.isRequired,
  onGameComplete: PropTypes.func.isRequired,
  onResize: PropTypes.func.isRequired,
  width: PropTypes.number,
  objects: PropTypes.array,
  storageKey: PropTypes.string,
  test: PropTypes.bool,
};

export default Game;
