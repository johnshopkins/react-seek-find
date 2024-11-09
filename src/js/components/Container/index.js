/*global dataLayer*/
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import Illustration from '../Illustration';
import InstructionsOverlay from '../InstructionsOverlay';
import Legend from '../Legend';
import ResizeWatcher from '@johnshopkins/jhu-wds/src/shared/js/utils/watch-window-resize'
import settings from '../../../settings';
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

    // the DOM element used to calculate ems to pixels
    this.em = createRef();

    // // for testing
    // clearGameState();

    // combine stored user data with default user data
    const userData = {
      gameComplete: false,
      found: [],
      seenInstructions: false,
      ...loadGameState()
    }

    // combine stored and default state
    this.state = {
      browserHeight: document.documentElement.clientHeight,
      browserWidth: document.documentElement.clientWidth,
      openInstructions: userData.seenInstructions === false,
      ...this.getViewState(),
      ...userData,
    };

    // organize the objects by ID
    this.objects = {};
    this.props.objects.forEach(object => {
      this.objects[object.id] = object;
    });

    this.closeInstructions = this.closeInstructions.bind(this);
    this.getViewState = this.getViewState.bind(this);
    this.onFind = this.onFind.bind(this);
    this.openInstructions = this.openInstructions.bind(this);
    this.replay = this.replay.bind(this);
    this.saveGame = this.saveGame.bind(this);
    this.scaleToFit = this.scaleToFit.bind(this);
    this.setViewState = this.setViewState.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.zoomTo = this.zoomTo.bind(this);
  }

  componentDidMount() {

    this.setViewState();

    ResizeWatcher.startWatching();

    window.addEventListener('jhu:winresize:done', e => {

      const newHeight = document.documentElement.clientHeight;
      const newWidth = document.documentElement.clientWidth;
      const newOrientation = window.screen.orientation.type;

      // make sure the size actually changed (iOS triggers the resize event too much)
      // see: https://johnkavanagh.co.uk/articles/understanding-phantom-window-resize-events-in-ios/
      
      // note: in iOS, going from landscape to portrait reports the same
      // height and width, so we must also check window.orientation
      if (this.state.browserHeight !== newHeight || this.state.browserWidth !== newWidth || this.state.orientation !== newOrientation) {
        this.setViewState();
      }
    })
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

  getComputedPixelValue(styles, key) {
    return parseInt(styles[key].replace('px', ''));
  }

  getViewState() {

    // width of game container (minus padding)
    const styles = window.getComputedStyle(this.container);
    const width = !this.props.containerWidth ? this.container.clientWidth - parseFloat(styles.paddingLeft || 0) - parseFloat(styles.paddingRight || 0) : this.props.containerWidth;

    // small buffer around the game
    const height = !this.props.containerHeight ? document.documentElement.clientHeight - 20 : this.props.containerHeight;
    
    // base breakpoint on the width of the container, not the user's screen
    const breakpoint = this.getBreakpoint(width);

    const legendHeight = settings[`legendThumbnailHeight_${breakpoint}`] + settings[`legendGap_${breakpoint}`];

    const illustrationContainerHeight = height - legendHeight;
    const illustrationContainerWidth = width;

    // factor in the buffer size to figure out max zoom ou
    const bufferSize = (settings.utilitiesEdgeSpace * 4) + (settings.miniMap * 2);

    const maxZoomOutWidth = (illustrationContainerWidth - bufferSize >= this.props.imageWidth ? 1 : (illustrationContainerWidth  - bufferSize) / this.props.imageWidth) * 100;
    const maxZoomOutHeight = (illustrationContainerHeight - bufferSize >= this.props.imageHeight ? 1 : (illustrationContainerHeight - bufferSize) / this.props.imageHeight) * 100;
    const maxZoomOut = Math.min(maxZoomOutWidth, maxZoomOutHeight); // allow to zoom out to max width AND height

    // start zoom out (do not take buffer into account)
    const startZoomOutWidth = illustrationContainerWidth >= this.props.imageWidth ? 1 : (illustrationContainerWidth / this.props.imageWidth) * 100;
    const startZoomOutHeight = illustrationContainerHeight >= this.props.imageHeight ? 1 : (illustrationContainerHeight / this.props.imageHeight) * 100;
    let scale = Math.min(startZoomOutWidth, startZoomOutHeight);
    
    if (this.props.test) {
      scale = 100;
    }

    return {
      breakpoint,
      height,
      illustrationContainerHeight,
      illustrationContainerWidth,
      maxZoomOut,
      orientation: window.screen.orientation.type, // helps with detecting resize on mobile
      scale,
      width,
      zoomInLimitReached: scale === 100, // the farthest IN you can zoom
      zoomOutLimitReached: scale === maxZoomOut, // the farthest OUT you can zoom
    };
  }

  setViewState() {
    this.setState(this.getViewState());
  }

  getBreakpoint(width) {

    if (width < settings.breakpoint_small) {
      return 'small';
    }

    if (width < settings.breakpoint_medium) {
      return 'medium';
    }

    if (width < settings.breakpoint_large) {
      return 'large';
    }

    return 'xlarge';
  }

  onFind(foundObject) {

    if (this.state.found.includes(foundObject.id)) {
      // object already found
      return false;
    }

    this.setState(state => {

      const found = [...state.found]; // handle immutably to prevent bugs

      found.push(foundObject.id);

      return {
        gameComplete: found.length === Object.values(this.objects).length,
        found,
      }

    }, () => {

      dataLayer.push({
        event: 'level_up',
        level: this.state.found.length,
      });

      if (this.state.gameComplete) {
        this.props.onGameComplete();
        dataLayer.push({
          event: 'unlock_achievement',
          achievement_id: 'game_complete',
        });
      }

      this.saveGame({
        found: this.state.found,
        gameComplete: this.state.gameComplete,
      })
    });

    return true;
  }

  saveGame(changed = {}) {
    saveGameState({
      found: this.state.found,
      gameComplete: this.state.gameComplete,
      seenInstructions: this.state.seenInstructions,
      ...changed
    })
  }

  replay() {
    this.setState({
      found: [],
      gameComplete: false,
    })

    this.saveGame({
      found: [],
      seenInstructions: true,
      gameComplete: false,
    });
  }
  
  zoomIn(callback = () => {}) {

    const newZoom = !this.state.zoomOutLimitReached ?
      // go up to the next 10
      this.round(this.state.scale + 10) :
      // round the current scale up to the nearest 10
      this.roundUp(this.state.scale);

    this.zoomTo(newZoom, callback);
  }

  zoomOut(callback = () => {}) {
    this.zoomTo(this.round(this.state.scale - 10), callback);
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
    } else if (value < this.state.maxZoomOut) {
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

  scaleToFit(height, width, callback = () => {}) {

    // add a little buffer around the area to scale to fit to
    const buffer = 50;

    const containerHeight = this.state.illustrationContainerHeight;
    const containerWidth = this.state.illustrationContainerWidth;

    const scale = this.state.scale / 100;

    const scaledHeight = (height + buffer) * scale;
    const scaledWidth = (width + buffer) * scale;

    const zoomOutHeight = containerHeight >= scaledHeight ? this.state.scale : (containerHeight / scaledHeight) * this.state.scale;
    const zoomOutWidth = containerWidth >= scaledWidth ? this.state.scale : (containerWidth / scaledWidth) * this.state.scale;

    const newZoom = this.roundDown(Math.min(zoomOutHeight, zoomOutWidth));

    this.zoomTo(newZoom, callback);
  }

  render() {

    // contains legend
    const containerStyles = {
      height: `${this.state.height}px`,
      width: `${this.state.width}px`,
    }

    return (
      <>
        {this.state.openInstructions &&
          <InstructionsOverlay
            breakpoint={this.state.breakpoint}
            isAutoOpen={!this.state.seenInstructions}
            isOpen={this.state.openInstructions}
            onClose={this.closeInstructions}
            style={containerStyles}
          />
        }
        <div className={['container', this.state.breakpoint].join(' ')} style={containerStyles} aria-hidden={this.state.openInstructions}>
          <Illustration
            containerHeight={this.state.illustrationContainerHeight}
            containerWidth={this.state.illustrationContainerWidth}
            disableTabbing={this.state.openInstructions}
            found={this.state.found}
            foundKeepAlive={this.props.foundKeepAlive}
            gameComplete={this.state.gameComplete}
            hintKeepAlive={this.props.hintKeepAlive}
            imageHeight={this.props.imageHeight}
            imageSrc={this.props.image}
            imageWidth={this.props.imageWidth}
            objects={Object.values(this.objects)}
            onFind={this.onFind}
            openInstructions={this.openInstructions}
            replay={this.replay}
            scale={this.state.scale / 100}
            scaleToFit={this.scaleToFit}
            zoomIn={this.zoomIn}
            zoomOut={this.zoomOut}
            zoomInLimitReached={this.state.zoomInLimitReached}
            zoomOutLimitReached={this.state.zoomOutLimitReached}
          />
          <Legend
            found={this.state.found}
            objects={Object.values(this.objects)}
          />
        </div>
      </>
    );
  }
}

Game.defaultProps = {
  foundKeepAlive: 2000,
  hintKeepAlive: 10000,
  objects: [],
  onGameComplete: () => {},
  test: false,
};

Game.propTypes = {
  containerHeight: PropTypes.number, // for testing convenience
  containerWidth: PropTypes.number, // for testing convenience
  foundKeepAlive: PropTypes.number,
  height: PropTypes.number,
  hintKeepAlive: PropTypes.number,
  image: PropTypes.string.isRequired,
  onGameComplete: PropTypes.func.isRequired,
  width: PropTypes.number,
  objects: PropTypes.array,
  test: PropTypes.bool,
};

export default Game;
