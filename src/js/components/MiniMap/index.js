import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import getOffsetCoords from '../../lib/get-offset-coords';
import roundToThousandth from '../../lib/roundToThousandth';
import * as settings from '../../../css/utils/shared-variables.scss';
import './style.scss';
const throttle = require('lodash.throttle');

class MiniMap extends Component {

  constructor(props) {
    super(props);

    this.shownRef = createRef(null);

    this.state = {
      dragStartX: null,
      dragStartY: null,
    };

    this.miniMapSize = parseInt(settings.miniMap) - 8;
    this.mapWidth = this.miniMapSize;

    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = throttle(this.handlePointerMove.bind(this), 15);
    this.handlePointerUp = this.handlePointerUp.bind(this);
  }

  handlePointerDown(e) {

    const { offsetX, offsetY } = getOffsetCoords(e);

    this.setState({
      dragStartX: offsetX,
      dragStartY: offsetY,
    })

    this.shownRef.current.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp, { once: true });
  }

  handlePointerMove(e) {

    const { offsetX, offsetY } = getOffsetCoords(e);

    const diffX = (this.state.dragStartX - offsetX);
    const diffY = (this.state.dragStartY - offsetY);

    let newX = this.props.canvasX + (diffX * this.sizeUp);
    let newY = this.props.canvasY + (diffY * this.sizeUp);

    this.props.moveCanvas(newX, newY);

  }

  handlePointerUp() {
    this.handlePointerMove.cancel();
    this.shownRef.current.removeEventListener('pointermove', this.handlePointerMove);
  }

  handlePointerCancel() {
    this.handlePointerUp();
    window.removeEventListener('pointerup', this.handlePointerUp, { once: true });
  }

  render() {

    this.sizeDown = this.miniMapSize / this.props.imageWidth;
    this.sizeUp = this.props.imageWidth / this.miniMapSize;

    this.mapHeight = this.props.imageHeight * this.sizeDown;

    const mapStyle = {
      height: `${this.mapHeight}px`,
      width: `${this.mapWidth}px`,
    }

    const shownHeight = roundToThousandth(Math.min(this.sizeDown * this.props.containerHeight, this.mapHeight));
    const shownWidth = roundToThousandth(Math.min(this.sizeDown * this.props.containerWidth, this.mapWidth));

    // adjustments for CSS absolute positioning
    const left = this.props.canvasX <= 0 ? roundToThousandth(Math.min(Math.abs(this.props.canvasX * this.sizeDown), this.mapWidth - shownWidth)) : 0;
    const top = this.props.canvasY <= 0 ? roundToThousandth(Math.min(Math.abs(this.props.canvasY * this.sizeDown), this.mapHeight - shownHeight)) : 0;

    const shownStyle = {
      left: `${left}px`,
      height: `${shownHeight}px`,
      top: `${top}px`,
      width: `${shownWidth}px`,
    }

    return (
      <div
        className="mini-map"
        style={mapStyle}
        // enables clicks within minimap to still register as focused within game container
        tabIndex="-1"
      >
        <div
          className="shown"
          style={shownStyle}
          ref={this.shownRef}
          onPointerDown={this.handlePointerDown}
          onPointerCancel={this.handlePointerCancel}
        ></div>
      </div>
    )
  }

}

MiniMap.defaultProps = {};

MiniMap.propTypes = {
  canvasX: PropTypes.number.isRequired,
  canvasY: PropTypes.number.isRequired,
  containerHeight: PropTypes.number.isRequired,
  containerWidth: PropTypes.number.isRequired,
  imageHeight: PropTypes.number.isRequired,
  imageWidth: PropTypes.number.isRequired,
  moveCanvas: PropTypes.func.isRequired,
};

export default MiniMap;
