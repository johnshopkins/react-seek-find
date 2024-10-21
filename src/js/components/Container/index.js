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

class Game extends Component {

  constructor(props) {

    super(props);

    // this.saveGame = data => saveGameState(data);
    // this.onGameComplete = this.props.onGameComplete;

    // the DOM element the game is contained in. helps determine view
    this.container = props.container;

    clearGameState();

    // fetch any stored data from localStorage
    const storedData = loadGameState();

    const userData = {
      found: [],
      timer: 0,
      ...storedData
    }

    this.objects = {};
    this.props.objects.forEach(object => {
      this.objects[object.id] = {
        id: object.id,
        create: object.create,
        hint: object.hint,
        thumbnail: object.thumbnail,
        alt_text: object.alt_text,
      }
    });

    const { breakpoint, height, maxZoomOut, scale, width } = this.determineView();

    // combine stored and default state
    this.state = {
      breakpoint,
      height,
      hint: null,
      hintActive: false,
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

  // shouldComponentUpdate(nextProps, nextState) {

  //   console.log('---');
  //   console.log('should container update?');
  //   console.log('---');

  //   for (const stateVar of Object.keys(nextState)) {
  //     if (nextState[stateVar] !== this.state[stateVar]) {
  //       console.log(`state.${stateVar} changed`);
  //     }
  //   }

  //   for (const propVar of Object.keys(nextProps)) {
  //     if (nextProps[propVar] !== this.props[propVar]) {
  //       console.log(`props.${propVar} changed`);
  //     }
  //   }

  //   console.log('---');

  //   return true;
  // }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
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

    console.log('scale', scale);
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
  hintKeepAlive: 10000,
};

Game.propTypes = {
  height: PropTypes.number,
  hintKeepAlive: PropTypes.number,
  image: PropTypes.string.isRequired,
  width: PropTypes.number,
  objects: PropTypes.array,
};

export default Game;
