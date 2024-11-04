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

  getViewState() {

    let emToPixel;

    // add !== 0 condition to aid in testing
    if (this.em.current && this.em.current.clientWidth !== 0) {
      emToPixel = this.em.current.clientWidth;
    } else {
      emToPixel = parseInt(window.getComputedStyle(document.body).getPropertyValue('font-size').replace('px', ''));
    }

    // width of game container (minus padding)
    const styles = window.getComputedStyle(this.container);
    const width = this.container.clientWidth - parseFloat(styles.paddingLeft || 0) - parseFloat(styles.paddingRight || 0);

    const height = document.documentElement.clientHeight;
    
    // base breakpoint on the width of the container, not the user's screen
    const breakpoint = this.getBreakpoint(width);

    const legendHeight = (settings[`legendThumbnailHeight_${breakpoint}`] + settings[`legendGap_${breakpoint}`]) * emToPixel;

    const illustrationContainerHeight = height - legendHeight;
    const illustrationContainerWidth = width;

    const maxZoomOutWidth = (width >= this.props.imageWidth ? 1 : width / this.props.imageWidth) * 100;
    const maxZoomOutHeight = (illustrationContainerHeight >= this.props.imageHeight ? 1 : illustrationContainerHeight / this.props.imageHeight) * 100;
    const maxZoomOut = Math.max(maxZoomOutWidth, maxZoomOutHeight);
    // const maxZoomOut = Math.min(maxZoomOutWidth, maxZoomOutHeight); // allow to zoom out to max width AND height

    // set scale to the the largest of the min/max to avoid white space on initial view
    let scale = maxZoomOut;
    // let scale = Math.max(maxZoomOutWidth, maxZoomOutHeight); // allow to zoom out to max width AND height

    if (this.props.test) {
      scale = 100;
    }

    return {
      breakpoint,
      emToPixel,
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
    this.zoomTo(this.round(this.state.scale + 10), callback);
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
        zoomInLimitReached: true
      };
      limitReached = true;
    } else if (value < this.state.maxZoomOut) {
      newState = {
        scale: this.state.maxZoomOut,
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
    this.setState({ openInstructions: false });
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

    const scaledHeight = height * this.state.scale;
    const scaledWidth = width * this.state.scale;

    const zoomOutHeight = (containerHeight >= scaledHeight + buffer ? 1 : containerHeight / (scaledHeight  + buffer)) * 100;
    const zoomOutWidth = (containerWidth >= scaledWidth + buffer ? 1 : containerWidth / (scaledWidth + buffer)) * 100;

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
          <div ref={this.em} aria-hidden style={{ position: 'absolute', visibility: 'hidden', width: '1em' }} />
          <Legend
            found={this.state.found}
            objects={Object.values(this.objects)}
          />
          <Illustration
            buffer={this.props.buffer}
            containerHeight={this.state.illustrationContainerHeight}
            containerWidth={this.state.illustrationContainerWidth}
            disableTabbing={this.state.openInstructions}
            emToPixel={this.state.emToPixel}
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
        </div>
      </>
    );
  }
}

Game.defaultProps = {
  buffer: true,
  foundKeepAlive: 2000,
  hintKeepAlive: 10000,
  objects: [],
  onGameComplete: () => {},
  test: false,
};

Game.propTypes = {
  buffer: PropTypes.bool,
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
