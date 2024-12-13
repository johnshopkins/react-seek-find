/*global Modernizr*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ArrowIcon from '../Icons/Arrow';
import ThumbnailGroups from './ThumbnailGroups';
import * as settings from '../../../css/utils/shared-variables.scss';
import './style.scss';

require('../../lib/modernizr');

class LegendScrollComponent extends Component {

  constructor(props) {
    super(props);

    this.isTouchEvents = Modernizr.touchevents;
    this.intervalId = null;

    const { availableSpace, minPositionX, maxPositionX } = this.getSpacingStates();

    this.state = {
      availableSpace,
      minPositionX,
      maxPositionX,
      direction: null,
      isPointerDown: false,
      positionX: 0,
    }

    this.getSpacingStates = this.getSpacingStates.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.scrollViaButton = this.scrollViaButton.bind(this);
  }

  getSpacingStates() {
    let availableSpace = this.props.width;

    if (!this.isTouchEvents) {
      const buttonWidth = parseInt(settings.utilitiesIconHeight) + (parseInt(settings.buttonPadding) * 2);
      availableSpace = this.props.width - (buttonWidth * 2) - (parseInt(settings[`legendPadding_${this.props.breakpoint}`]) * 4)
    }

    const minPositionX = 0;
    const maxPositionX = -Math.abs(this.props.legendWidth - availableSpace);

    console.log({width: this.props.width, availableSpace, maxPositionX});

    return { availableSpace, minPositionX, maxPositionX };
  }

  handleKeyDown(e, direction) {
    if (e.key !== 'Enter') {
      return;
    }
    this.handlePointerDown(direction)
  }

  scrollViaButton(direction) {
    this.setState(state => {
      const newState = {};
      const prevPositionX = state.positionX;

      const newValue = direction === 'left' ? prevPositionX + this.props.thumbnailSize : prevPositionX - this.props.thumbnailSize;

      if (direction === 'left' && newValue >= this.state.minPositionX) {
        newState.pointerDown = false;
        newState.positionX = this.state.minPositionX;
      } else if (direction === 'right' && newValue <= this.state.maxPositionX) {
        newState.pointerDown = false;
        newState.positionX = this.state.maxPositionX;
      } else {
        newState.positionX = newValue;
      }

      return newState;
    })
  }

  handlePointerDown(direction) {

    this.setState({
      isPointerDown: true,
      direction
    }, () => {

      window.addEventListener('pointerup', this.handlePointerUp, { once: true });

      this.scrollViaButton(direction);
      this.intervalId = setInterval(() => {
        console.log('button is being pressed');
        this.scrollViaButton(direction);
      }, 100);

    });
  };

  handlePointerUp () {
    clearInterval(this.intervalId);
    this.setState({ isPointerDown: false });
  }

  render() {

    const scrollLeftDisabled = this.state.positionX === this.state.minPositionX;
    const scrollRightDisabled = this.state.positionX === this.state.maxPositionX;

    return (
      <div className="legend-scroll">
        {!this.isTouchEvents &&
          <button
            onKeyDown={(e) => this.handleKeyDown(e, 'left')}
            onKeyUp={this.handlePointerUp}
            onPointerDown={e => {
              if (!scrollLeftDisabled) {
                this.handlePointerDown('left')
              }
            }}
            onPointerCancel={this.handlePointerUp}
            disabled={scrollLeftDisabled}
          >
            <ArrowIcon className="left" tooltip="Scroll left" />
          </button>
        }
        <ThumbnailGroups
          found={this.props.found}
          groups={this.props.groups}
          position={this.state.positionX}
          width={this.state.availableSpace}
        />
        {!this.isTouchEvents &&
          <button
            onKeyDown={(e) => this.handleKeyDown(e, 'right')}
            onKeyUp={this.handlePointerUp}
            onPointerDown={e => {
              if (!scrollRightDisabled) {
                this.handlePointerDown('right')
              }
            }}
            onPointerCancel={this.handlePointerUp}
            disabled={scrollRightDisabled}
          >
            <ArrowIcon className="right" tooltip="Scroll right" />
          </button>
        }
        
      </div>
    )
}

}

LegendScrollComponent.defaultProps = {};

LegendScrollComponent.propTypes = {
  breakpoint: PropTypes.string.isRequired,
  found: PropTypes.array.isRequired,
  groups: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  legendWidth: PropTypes.number.isRequired,
  thumbnailSize: PropTypes.number.isRequired,
};

export default LegendScrollComponent;
