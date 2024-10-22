import React, { Component } from 'react';
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

/**
 * The container of the game, which manages the game state.
 */
class Game extends Component {

  constructor(props) {

    super(props);

    // the DOM element the game is contained in. helps determine view
    this.container = props.container;

    // // for testing
    // clearGameState();

    // fetch any stored data from localStorage
    const storedData = loadGameState();

    // combine stored data with default data
    const userData = {
      found: [],
      timer: 0,
      ...storedData
    }

    // organize the objects by ID
    this.objects = {};
    this.props.objects.forEach(object => {
      this.objects[object.id] = object;
    });

    // determine variables related to the current view
    const { breakpoint, height, maxZoomOut, scale, width } = this.determineView();

    // combine stored and default state
    this.state = {
      breakpoint,
      height,
      maxZoomOut: maxZoomOut,
      zoomInLimitReached: scale === 100, // the farthest IN you can zoom
      zoomOutLimitReached: scale === maxZoomOut, // the farthest OUT you can zoom
      scale,
      width,
      browserHeight: document.documentElement.clientHeight,
      browserWidth: document.documentElement.clientWidth,
      ...userData,
    };

    this.determineView = this.determineView.bind(this);
    this.onFind = this.onFind.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
  }

  componentDidMount() {

    ResizeWatcher.startWatching();

    window.addEventListener('jhu:winresize:done', e => {

      const newHeight = document.documentElement.clientHeight;
      const newWidth = document.documentElement.clientWidth;

      // make sure the size actually changed (iOS triggers them randomly at times)
      // see: https://johnkavanagh.co.uk/articles/understanding-phantom-window-resize-events-in-ios/
      if (this.state.browserHeight !== newHeight || this.state.browserWidth !== newWidth) {
        const { breakpoint, height, maxZoomOut, scale, width } = this.determineView();
        this.setState({
          browserHeight: newHeight,
          browserWidth: newWidth,
          breakpoint,
          height,
          maxZoomOut,
          scale,
          width
        });
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

  determineView() {

    const breakpoint = document.documentElement.clientWidth > settings.breakpoint_desktop ? 'desktop' : 'mobile';

    // width of game container (minus padding)
    const styles = window.getComputedStyle(this.container);
    const width = this.container.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);

    // 50 pixel buffer on top/bottom of user's screen
    const height = document.documentElement.clientHeight - 100;

    // store as integer. why? see: https://stackoverflow.com/questions/588004/is-floating-point-math-broken
    const maxZoomOutWidth = (width >= this.props.imageWidth ? 1 : width / this.props.imageWidth) * 100;
    const maxZoomOutHeight = (height >= this.props.imageHeight ? 1 : height / this.props.imageHeight) * 100;

    const maxZoomOut = Math.max(maxZoomOutWidth, maxZoomOutHeight)

    // round to nearest 10 and add 20 so the zoom isn't too close to the max zoom out
    let scale = (Math.ceil(maxZoomOut / 10) * 10) + 20;

    // don't show the imag TOO small on first load
    if (scale < 60) {
      scale = 60;
    }

    return { breakpoint, height, maxZoomOut, scale, width };
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
      saveGameState({
        found: this.state.found,
        time: this.state.timer,
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

  render() {

    const containerHeight = this.state.height;
    const containerWidth = this.state.width;

    const legendHeight = settings[`legendThumbnailHeight_${this.state.breakpoint}`];

    const illustrationContainerHeight = containerHeight - legendHeight;
    const illustrationContainerWidth = containerWidth;


    // contains legend
    const containerStyles = {
      height: `${containerHeight}px`,
      width: `${containerWidth}px`,
    }

    const gameStyles = {
      height: `${illustrationContainerHeight}px`,
      width: `${illustrationContainerWidth}px`,
    };

    return (
      <div className={['container', this.state.breakpoint].join(' ')} style={containerStyles}>
        <Legend
          found={this.state.found}
          objects={Object.values(this.objects)}
        />
        <div className="game-container" role="region" aria-label="Seek and Find" style={gameStyles}>
          <Illustration
            found={this.state.found}
            foundKeepAlive={this.props.foundKeepAlive}
            containerStyles={gameStyles}
            imageSrc={this.props.image}
            objects={Object.values(this.objects)}
            containerHeight={illustrationContainerHeight}
            containerWidth={illustrationContainerWidth}
            height={this.props.imageHeight}
            width={this.props.imageWidth}
            onFind={this.onFind}
            scale={this.state.scale / 100}
            hintKeepAlive={this.props.hintKeepAlive}
            zoomIn={this.zoomIn}
            zoomOut={this.zoomOut}
            zoomInLimitReached={this.state.zoomInLimitReached}
            zoomOutLimitReached={this.state.zoomOutLimitReached}
          />
        </div>
        
      </div>
    );
  }
}

Game.defaultProps = {
  foundKeepAlive: 2000,
  hintKeepAlive: 10000,
};

Game.propTypes = {
  foundKeepAlive: PropTypes.number,
  height: PropTypes.number,
  hintKeepAlive: PropTypes.number,
  image: PropTypes.string.isRequired,
  width: PropTypes.number,
  objects: PropTypes.array,
};

export default Game;
