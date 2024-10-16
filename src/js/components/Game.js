import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Illustration from './Illustration';
import Legend from './Legend';
import Utilities from './Utilities';

import { animations } from '../../settings';

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

    // combine stored and default state
    this.state = {
      userData,
      objects,
      hint: null,
      hintActive: false,
    };

    this.onFind = this.onFind.bind(this);
    this.showHint - this.showHint.bind(this);
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
      setTimeout(() => this.removeHint(), animations.hintFadeIn + this.props.hintKeepAlive);
    });
  }

  removeHint() {
    console.log('remove hint');
    this.setState({ hint: null }, () => {
      setTimeout(() => this.setState({ hintActive: false }), animations.hintFadeOut);
    });
  }

  render() {

    // const containerWidth = 300;
    // const containerHeight = 500;
    const containerWidth = this.props.width;
    const containerHeight = this.props.height;

    const styles = {
      height: `${containerHeight}px`,
      width: `${containerWidth}px`,
    };

    return (
      <div className="container" style={styles}>
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
          height={this.props.height}
          width={this.props.width}
          onFind={this.onFind}
          hint={this.state.objects[this.state.hint]}
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
