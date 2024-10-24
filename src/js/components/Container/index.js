import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import Illustration from '../Illustration';
import Legend from '../Legend';
import ResizeWatcher from '@johnshopkins/jhu-wds/src/shared/js/utils/watch-window-resize'
import settings from '../../../settings';
import {
  clearGameState,
  loadGameState,
  saveGameState
} from '../../lib/persistance';
import './style.scss';

require('../../lib/modernizr');

/**
 * The container of the game, which manages the game state.
 */
class Game extends Component {

  constructor(props) {

    super(props);

    // the DOM element the game is contained in. helps determine view
    this.container = props.container;

    this.em = createRef();

    // // for testing
    // clearGameState();

    // fetch any stored data from localStorage
    const storedData = loadGameState();

    // combine stored data with default data
    const userData = {
      gameComplete: false,
      found: [],
      showTouchInstruction: true,
      timer: 0,
      ...storedData
    }

    // combine stored and default state
    this.state = {
      browserHeight: document.documentElement.clientHeight,
      browserWidth: document.documentElement.clientWidth,
      ...this.getViewState(),
      ...userData,
    };

    // organize the objects by ID
    this.objects = {};
    this.props.objects.forEach(object => {
      this.objects[object.id] = object;
    });

    this.getViewState = this.getViewState.bind(this);
    this.hideTouchInstruction = this.hideTouchInstruction.bind(this);
    this.onFind = this.onFind.bind(this);
    this.scaleToFit = this.scaleToFit.bind(this);
    this.setViewState = this.setViewState.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
  }

  componentDidMount() {

    this.setViewState();

    ResizeWatcher.startWatching();

    window.addEventListener('jhu:winresize:done', e => {

      const newHeight = document.documentElement.clientHeight;
      const newWidth = document.documentElement.clientWidth;
      const newOrientation = window.orientation;

      // make sure the size actually changed (iOS triggers them randomly at times)
      // see: https://johnkavanagh.co.uk/articles/understanding-phantom-window-resize-events-in-ios/
      
      // note: in iOS, going from landscape to portrait reports the same
      // height and width, so we must also check window.orientation.
      if (this.state.browserHeight !== newHeight || this.state.browserWidth !== newWidth || this.state.orientation !== newOrientation) {
        this.setViewState();
      }
    })
  }

  /**
   * Why? See: https://stackoverflow.com/questions/588004/is-floating-point-math-broken
   * @param {number} num 
   * @returns 
   */
  round(num) {
    return Math.round(num / 10) * 10;
  }

  roundDown(num) {
    return Math.floor(num / 10) * 10;
  }

  getViewState() {

    const emToPixel = this.em.current ? this.em.current.clientWidth : 16; // assume 16 to get started

    // width of game container (minus padding)
    const styles = window.getComputedStyle(this.container);
    const width = this.container.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);

    // 50 pixel buffer on top/bottom of user's screen
    const height = document.documentElement.clientHeight - 100;

    // base breakpoint on the width of the container, not the user's screen
    const breakpoint = this.getBreakpoint(width);

    const legendHeight = (settings[`legendThumbnailHeight_${breakpoint}`] + settings[`legendGap_${breakpoint}`]) * emToPixel;

    const illustrationContainerHeight = height - legendHeight;
    const illustrationContainerWidth = width;

    // store as integer. why? see: https://stackoverflow.com/questions/588004/is-floating-point-math-broken
    const maxZoomOutWidth = (width >= this.props.imageWidth ? 1 : width / this.props.imageWidth) * 100;
    const maxZoomOutHeight = (height >= this.props.imageHeight ? 1 : height / this.props.imageHeight) * 100;

    const maxZoomOut = Math.max(maxZoomOutWidth, maxZoomOutHeight);

    // round to nearest 10 and add 20 so the zoom isn't too close to the max zoom out
    let scale = (Math.ceil(maxZoomOut / 10) * 10) + 20;

    // don't show the imag TOO small on first load
    if (scale < 60) {
      scale = 60;
    }

    return {
      breakpoint,
      emToPixel,
      height,
      illustrationContainerHeight,
      illustrationContainerWidth,
      maxZoomOut,
      orientation: window.orientation, // helps with detecting resize on mobile
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

    this.setState(state => {

      const found = [...state.found]; // handle immutably to prevent bugs

      if (found.includes(foundObject.id)) {
        return;
      }

      found.push(foundObject.id)

      return { found }

    }, () => {

      const gameComplete = this.state.found.length === Object.values(this.objects).length;

      if (gameComplete) {
        this.props.onGameComplete()
      }

      saveGameState({
        found: this.state.found,
        time: this.state.timer,
        gameComplete,
      })
    });
  }

  zoomIn() {
    this.setState(state => {

      if (state.scale === 100) {
        return { zoomInLimitReached: true };
      }

      const newZoom = this.round(state.scale + 10);

      return {
        scale: newZoom,
        zoomInLimitReached: false,
        zoomOutLimitReached: false
      }
    });
  }

  zoomOut() {
    this.setState(state => {

      if (state.scale === this.state.maxZoomOut) {
        return { zoomOutLimitReached: true };
      }

      let newZoom = this.round(state.scale - 10);

      if (newZoom < this.state.maxZoomOut) {
        newZoom = this.state.maxZoomOut;
      }

      return {
        scale: newZoom,
        zoomInLimitReached: false,
        zoomOutLimitReached: false
      }
    });
  }

  hideTouchInstruction() {
    this.setState({ showTouchInstruction: false })

    saveGameState({
      found: this.state.found,
      showTouchInstruction: false,
      time: this.state.timer,
    })
  }

  scaleToFit(height, width) {

    const buffer = 50;

    const containerHeight = this.state.illustrationContainerHeight;
    const containerWidth = this.state.illustrationContainerWidth;

    const zoomOutHeight = (containerHeight >= height + buffer ? 1 : containerHeight / (height  + buffer)) * 100;
    const zoomOutWidth = (containerWidth >= width + buffer ? 1 : containerWidth / (width + buffer)) * 100;

    let zoomTo = this.roundDown(Math.min(zoomOutHeight, zoomOutWidth));

    if (this.state.scale <= zoomTo) {
      // app is already scaled out enough; do not adjust
      return;
    }

    if (zoomTo < this.state.maxZoomOut) {
      zoomTo = this.state.maxZoomOut;
    }

    this.setState({ scale: zoomTo });
  }

  render() {

    const containerHeight = this.state.height;
    const containerWidth = this.state.width;

    // contains legend
    const containerStyles = {
      height: `${containerHeight}px`,
      width: `${containerWidth}px`,
    }

    const gameStyles = {
      height: `${this.state.illustrationContainerHeight}px`,
      width: `${this.state.illustrationContainerWidth}px`,
    };

    return (
      <div className={['container', this.state.breakpoint].join(' ')} style={containerStyles}>

        {/* used to convert ems to pixels */}
        <div ref={this.em} aria-hidden style={{ position: 'absolute', visibility: 'hidden', width: '1em' }} />
        
        <Legend
          found={this.state.found}
          objects={Object.values(this.objects)}
        />
        
        <Illustration
          buffer={this.props.buffer}
          breakpoint={this.state.breakpoint}
          emToPixel={this.state.emToPixel}
          found={this.state.found}
          gameComplete={this.state.gameComplete}
          foundKeepAlive={this.props.foundKeepAlive}
          containerStyles={gameStyles}
          imageSrc={this.props.image}
          objects={Object.values(this.objects)}
          containerHeight={this.state.illustrationContainerHeight}
          containerWidth={this.state.illustrationContainerWidth}
          height={this.props.imageHeight}
          width={this.props.imageWidth}
          onFind={this.onFind}
          scale={this.state.scale / 100}
          hintKeepAlive={this.props.hintKeepAlive}
          showTouchInstruction={this.state.showTouchInstruction}
          hideTouchInstruction={this.hideTouchInstruction}
          scaleToFit={this.scaleToFit}
          zoomIn={this.zoomIn}
          zoomOut={this.zoomOut}
          zoomInLimitReached={this.state.zoomInLimitReached}
          zoomOutLimitReached={this.state.zoomOutLimitReached}
        />
        
      </div>
    );
  }
}

Game.defaultProps = {
  buffer: true,
  foundKeepAlive: 2000,
  hintKeepAlive: 10000,
  onGameComplete: () => {},
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
};

export default Game;
