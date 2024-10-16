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

    clearGameState();

    // fetch any stored data from localStorage
    const storedData = loadGameState();

    const userData = {
      found: [],
      timer: 0,
      ...storedData
    }

    const objects = {};
    this.props.objects.forEach(object => {
      objects[object.id] = {
        id: object.id,
        create: object.create,
        hint: object.hint,
        thumbnail: object.thumbnail,
        alt_text: object.alt_text,
        found: userData.found.includes(object.id),
      }
    });


    const { scale, view } = this.determineView();

    // combine stored and default state
    this.state = {
      userData,
      objects,
      hint: null,
      hintActive: false,
      scale,
      view,
    };

    this.determineView = this.determineView.bind(this);
    this.onFind = this.onFind.bind(this);
    this.showHint - this.showHint.bind(this);
  }

  componentDidMount() {

    ResizeWatcher.startWatching();

    window.addEventListener('jhu:winresize:done', e => {
      const { scale, view  } = this.determineView();
      this.setState({ scale, view });
    })
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

  determineView() {

    const width = document.body.clientWidth
    const view = width < this.props.width ? 'mobile' : 'desktop';
    const scale = view === 'desktop' ? 1 : width / this.props.width;

    return { view, scale };
  }

  determineScale() {

  }

  onFind(found) {

    this.setState((state) => {

      const foundObjectId = found.id;

      console.log(`${foundObjectId} found!`);

      const objects = state.objects;
      const userData = state.userData;

      objects[foundObjectId].found = true,
      userData.found.push(foundObjectId);

      return {
        userData,
        objects,
      }
    }, () => {
      saveGameState(this.state.userData)

      // if (found.id === this.state.hint) {
        this.removeHint();
      // }
      
    });
  }

  showHint() {

    const notFound = Object.values(this.state.objects).filter(object => !object.found);

    const random = Math.floor(Math.random() * notFound.length);

    this.setState({ hint: notFound[random].id, hintActive: true }, () => {
      setTimeout(() => this.removeHint(), settings.hintFadeIn + this.props.hintKeepAlive);
    });
  }

  removeHint() {
    console.log('remove hint');
    this.setState({ hint: null }, () => {
      setTimeout(() => this.setState({ hintActive: false }), settings.hintFadeOut);
    });
  }

  render() {

    console.log('rerender');

    // const containerWidth = this.props.width; // illustration width
    // const containerWidth = (document.body.clientWidth / 2);
    const containerWidth = this.state.view === 'desktop' ? this.props.width : (this.props.width * this.state.scale);

    // find height
    const widthRatio = containerWidth / this.props.width;

    const legendHeight = settings[`legendHeight_${this.state.breakpoint}`];
    const utilitiesHeight = settings[`utilitiesHeight_${this.state.breakpoint}`];

    const containerHeight = (this.props.height * widthRatio) + legendHeight + utilitiesHeight;

    const illustrationContainerWidth = containerWidth;
    const illustrtionContainerHeight = this.props.height * widthRatio;

    const styles = {
      height: `${containerHeight}px`,
      width: `${containerWidth}px`,
    };

    return (
      <div className={`container ${this.state.view}`} style={styles}>
        <Legend
          objects={Object.values(this.state.objects)}
        />
        <Utilities
          hintActive={this.state.hintActive}
          showHint={() => this.showHint()}
        />
        <Illustration
          imageSrc={this.props.image}
          objects={Object.values(this.state.objects)}
          containerHeight={illustrtionContainerHeight}
          containerWidth={illustrationContainerWidth}
          height={this.props.height}
          width={this.props.width}
          onFind={this.onFind}
          hint={this.state.objects[this.state.hint]}
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
