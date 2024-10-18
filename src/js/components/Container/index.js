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

    const { breakpoint, height, scale, width } = this.determineView();

    // combine stored and default state
    this.state = {
      breakpoint,
      height,
      hint: null,
      hintActive: false,
      scale,
      width,
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
      const { breakpoint, height, scale, width } = this.determineView();
      this.setState({ breakpoint, height, scale, width });
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
  roundUp(num) {
    return Math.ceil(num * 10) / 10;
  }

  determineView() {

    const breakpoint = document.documentElement.clientWidth > settings.breakpoint_desktop ? 'desktop' : 'mobile';

    // width of game container (minus padding)
    const styles = window.getComputedStyle(this.container);
    const width = this.container.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);

    // 50 pixel buffer on top/bottom of user's screen
    const height = document.documentElement.clientHeight - 100;

    // store as integer. why? see: https://stackoverflow.com/questions/588004/is-floating-point-math-broken
    let scale = (width >= this.props.imageWidth ? 1 : width / this.props.imageWidth) * 100;

    // round to nearest 10
    scale = Math.ceil(scale / 10) * 10;

    // don't show the imag TOO small on first load
    if (scale < 40) {
      scale = 40;
    }

    return { height, scale, width, breakpoint };
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
        return;
      }

      const newZoom = this.roundUp(state.scale + 10);

      return { scale: newZoom }

    });
  }

  zoomOut() {
    this.setState(state => {

      if (state.scale === 10) {
        return;
      }

      const newZoom = state.scale - 10;

      return { scale: newZoom }

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
