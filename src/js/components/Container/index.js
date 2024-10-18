import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Illustration from '../Illustration';
import Legend from '../Legend';
import Utilities from '../Utilities';

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

  determineView() {

    const breakpoint = document.documentElement.clientWidth > settings.breakpoint_desktop ? 'desktop' : 'mobile';

    // width of game container (minus padding)
    const styles = window.getComputedStyle(this.container);
    const width = this.container.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);

    // 50 pixel buffer on top/bottom of user's screen
    const height = document.documentElement.clientHeight - 100;

    let scale = width >= this.props.width ? 1 : width / this.props.width;

    // don't show the imag TOO small on first load
    if (scale < 0.5) {
      scale = 0.5;
    }

    console.log({ height, scale, width, breakpoint });

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

  render() {

    // 50 pixel buffer on top/bottom of user's screen
    const containerHeight = this.state.height

    // scale should always be < 1 (illustration is larger than container)
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
            gameStyles={gameStyles}
            imageSrc={this.props.image}
            objects={Object.values(this.objects)}
            containerHeight={illustrationContainerHeight}
            containerWidth={illustrationContainerWidth}
            height={this.props.height}
            width={this.props.width}
            onFind={this.onFind}
            scale={this.state.scale}
            hintKeepAlive={this.props.hintKeepAlive}
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
