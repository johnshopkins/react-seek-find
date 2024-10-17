import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Illustration from './Illustration';
import Legend from './Legend';
import Utilities from './Utilities';

import ResizeWatcher from '@johnshopkins/jhu-wds/src/shared/js/utils/watch-window-resize'

import settings from '../../settings';

import {
  clearGameState,
  loadGameState,
  saveGameState
} from '../lib/persistance';

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

    const { mode, scale } = this.determineScaleAndMode();

    // combine stored and default state
    this.state = {
      // objects,
      hint: null,
      hintActive: false,
      mode,
      scale,
      ...userData,
    };

    this.enterFullScreen = this.enterFullScreen.bind(this);
    this.exitFullScreen = this.exitFullScreen.bind(this);
    this.determineScaleAndMode = this.determineScaleAndMode.bind(this);
    this.onFind = this.onFind.bind(this);
    this.showHint - this.showHint.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
  }

  componentDidMount() {

    ResizeWatcher.startWatching();

    window.addEventListener('jhu:winresize:done', e => {
      const { mode, scale  } = this.determineScaleAndMode();
      this.setState({ mode, scale });
    })
  }

  shouldComponentUpdate(nextProps, nextState) {

    console.log('---');
    console.log('should container update?');
    console.log('---');

    for (const stateVar of Object.keys(nextState)) {
      if (nextState[stateVar] !== this.state[stateVar]) {
        console.log(`state.${stateVar} changed`);
      }
    }

    for (const propVar of Object.keys(nextProps)) {
      if (nextProps[propVar] !== this.props[propVar]) {
        console.log(`props.${propVar} changed`);
      }
    }

    console.log('---');

    return true;
  }

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
   * Determines the scale and mode (normal or fullscreen) of the application
   * @returns object
   */
  determineScaleAndMode() {

    const styles = window.getComputedStyle(this.container);
    const width = this.container.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);

    const scale = width >= this.props.width ? 1 : width / this.props.width;

    let mode = typeof this.state !== 'undefined' ? this.state.mode : 'normal';

    // switch back to normal mode if going from scaled->unscaled view
    if (typeof this.state !== 'undefined' && this.state.scale < 1 && mode === 'fullscreen') {
      mode = 'normal';
    }

    return { mode, scale };
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

      // if (found.id === this.state.hint) {
        this.removeHint();
      // }
      
    });
  }

  showHint() {

    const notFound = Object.values(this.objects).filter(object => !this.state.found.includes(object.id));

    const random = Math.floor(Math.random() * notFound.length);

    this.setState({ hint: notFound[random].id, hintActive: true }, () => {
      setTimeout(() => this.removeHint(), settings.hintFadeIn + this.props.hintKeepAlive);
    });
  }

  removeHint() {
    this.setState({ hint: null }, () => {
      setTimeout(() => this.setState({ hintActive: false }), settings.hintFadeOut);
    });
  }

  zoomIn() {

    console.log('zoom in');

  }

  zoomOut() {

    console.log('zoom out');

  }

  enterFullScreen() {
    console.log('enter full screen');
    this.setState({ mode: 'fullscreen' });
  }

  exitFullScreen() {
    console.log('exit full screen');
    this.setState({ mode: 'normal' });
  }

  render() {

    console.log('container render');
    console.log('---');

    // const containerWidth = this.props.width; // illustration width
    // const containerWidth = (document.body.clientWidth / 2);
    const containerWidth = this.state.scale === 1 ? this.props.width : (this.props.width * this.state.scale);

    // find height
    const widthRatio = containerWidth / this.props.width;

    const legendHeight = settings[`legendHeight_${this.state.breakpoint}`];
    const utilitiesHeight = settings[`utilitiesHeight_${this.state.breakpoint}`];

    const containerHeight = (this.props.height * widthRatio) + legendHeight + utilitiesHeight;

    const illustrationContainerWidth = containerWidth;
    const illustrationContainerHeight = this.props.height * widthRatio;

    const styles = {
      height: `${containerHeight}px`,
      width: `${containerWidth}px`,
    };

    return (
      <div className="container" style={styles}>
        <Legend
          found={this.state.found}
          objects={Object.values(this.objects)}
        />
        <Utilities
          hintActive={this.state.hintActive}
          enterFullScreen={this.enterFullScreen}
          exitFullScreen={this.exitFullScreen}
          mode={this.state.mode}
          scale={this.state.scale}
          showHint={() => this.showHint()}
          zoomIn={this.zoomIn}
          zoomOut={this.zoomOut}
        />
        <Illustration
          found={this.state.found}
          imageSrc={this.props.image}
          objects={Object.values(this.objects)}
          containerHeight={illustrationContainerHeight}
          containerWidth={illustrationContainerWidth}
          height={this.props.height}
          width={this.props.width}
          onFind={this.onFind}
          hint={this.objects[this.state.hint]}
          scale={this.state.scale}
        />
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
