/*global Modernizr*/
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import ArrowIcon from '../Icons/Arrow';
import ThumbnailGroups from './ThumbnailGroups';
import getOffsetCoords from '../../lib/get-offset-coords';
import * as settings from '../../../css/utils/shared-variables.scss';
import './style.scss';

const throttle = require('lodash.throttle');
require('../../lib/modernizr');

class LegendScrollComponent extends Component {

  constructor(props) {
    super(props);

    this.isTouchEvents = Modernizr.touchevents;

    this.legendScrollRef = createRef(null);
    this.intervalId = null;

    const { availableSpace, minPositionX, maxPositionX } = this.getSpacingStates();

    this.state = {
      availableSpace,
      dragStartX: 0,
      minPositionX,
      maxPositionX,
      direction: null,
      isPointerDown: false,
      positionX: 0,
    }

    this.getSpacingStates = this.getSpacingStates.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handlePointerCancel = this.handlePointerCancel.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = throttle(this.handlePointerMove.bind(this), 15);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.scroll = this.scroll.bind(this);
  }

  getSpacingStates() {
    let availableSpace = this.props.width;

    if (!this.isTouchEvents) {
      const buttonWidth = parseInt(settings.utilitiesIconHeight) + (parseInt(settings.buttonPadding) * 2);
      availableSpace = this.props.width - (buttonWidth * 2) - (parseInt(settings[`legendPadding_${this.props.breakpoint}`]) * 4)
    }

    const minPositionX = 0;
    const maxPositionX = !this.isTouchEvents ?
      // remove width padding of last group
      -Math.abs(this.props.legendWidth - parseInt(settings[`legendPadding_${this.props.breakpoint}`]) - availableSpace) :
      -Math.abs(this.props.legendWidth - availableSpace);

    console.log({width: this.props.width, availableSpace, maxPositionX});

    return { availableSpace, minPositionX, maxPositionX };
  }

  handleKeyDown(e, direction) {
    if (e.key !== 'Enter') {
      return;
    }
    this.handlePointerDown(e, direction, 'keyup')
  }

  scroll(direction, distance = 0) {

    if (direction === 'right' && this.state.positionX === this.state.maxPositionX) {
      return;
    }

    if (direction === 'left' && this.state.positionX === this.state.minPositionX) {
      return;
    }

    this.setState(state => {
      const newState = {};
      const prevPositionX = state.positionX;

      const newValue = direction === 'left' ? prevPositionX + distance : prevPositionX - distance;

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

  handlePointerDown(e, direction = null, upEvent = 'pointerup') {

    if (this.isTouchEvents) {

      const { offsetX } = getOffsetCoords(e);
      this.setState({ dragStartX: offsetX })

      this.legendScrollRef.current.addEventListener('pointermove', this.handlePointerMove);

    } else {

      this.setState({
        isPointerDown: true,
        direction
      }, () => {

        this.scroll(direction, this.props.thumbnailSize);
        this.intervalId = setInterval(() => {
          this.scroll(direction, this.props.thumbnailSize);
        }, 100);

      });
    }

    this.legendScrollRef.current.addEventListener(upEvent, this.handlePointerUp, { once: true });
  };

  handlePointerMove (e) {

    const { offsetX } = getOffsetCoords(e);

    const diffX = (this.state.dragStartX - offsetX);
    const direction = diffX > 0 ? 'right' : 'left';

    this.scroll(direction, Math.abs(diffX));
  }

  handlePointerUp () {
    clearInterval(this.intervalId);
    this.setState({ isPointerDown: false });
  }

  handlePointerCancel() {
    this.handlePointerUp();
    window.removeEventListener('pointerup', this.handlePointerUp, { once: true });
  }

  render() {

    const props = {
      className: 'legend-scroll',
      ref: this.legendScrollRef
    }

    if (this.isTouchEvents) {
      props.onPointerDown = this.handlePointerDown;
      props.onPointerCancel = this.handlePointerCancel;
      props.style = { touchAction: 'none' };
    }

    const scrollLeftDisabled = this.state.positionX === this.state.minPositionX;
    const scrollRightDisabled = this.state.positionX === this.state.maxPositionX;

    return (
      <div {...props}>
        {!this.isTouchEvents &&
          <button
            onKeyDown={(e) => this.handleKeyDown(e, 'left')}
            onPointerDown={e => this.handlePointerDown(e, 'left')}
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
            onPointerDown={e => this.handlePointerDown(e, 'right')}
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
  groups: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  legendWidth: PropTypes.number.isRequired,
  thumbnailSize: PropTypes.number.isRequired,
};

export default LegendScrollComponent;
