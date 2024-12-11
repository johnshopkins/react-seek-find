import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import * as settings from '../../../css/utils/shared-variables.scss';
import './style.scss';


class Findable extends Component {

  constructor(props) {
    super(props);

    // this.state = {};

    this.canvasRef = createRef(null);

    this.checkGuess = this.checkGuess.bind(this);
    this.drawObjects = this.drawObjects.bind(this);
  }

  shouldComponentUpdate(nextProps) {

    if (this.props.objects.length !== nextProps.objects.length) {
      return true;
    }

    const propVars = [
      'disableTabbing',
      'isPinchZooming',
      'scale',
    ]

    for (const propVar of propVars) {
      if (nextProps[propVar] !== this.props[propVar]) {
        return true;
      }
    }

    return false;
  }

  componentDidMount() {

    this.drawObjects();

    // this event must be listened for at all times (not just after onTouchStart)
    // to ensure it is being listened for activity (instead of passively, which is the
    // default for many mobile browsers). Allows e.preventDefault() to run within
    // touchmove callback, which we need to facilitate both 1- (use browser default) 
    // and 2-touch events (use our callback)
    const canvas = this.canvasRef.current;
    canvas.addEventListener('touchmove', this.props.onTouchMove, { passive: false });
    canvas.addEventListener('touchend', this.props.onTouchEnd);
    canvas.addEventListener('touchcancel', this.props.onTouchCancel);
  }

  componentDidUpdate(prevProps) {

    if (this.props.objects.length !== prevProps.objects.length) {

      const context = this.canvasRef.current.getContext('2d');
      context.clearRect(0, 0, this.props.width, this.props.height);

      this.drawObjects();
    }

    return true;
  }

  drawObjects() {

    const context = this.canvasRef.current.getContext('2d');

    this.props.objects.map(object => {
      if (object.getType() === '1:1') {
        object.plotted = object.create.call(this, context);
      } else {
        // group
        object.objects.map(childObject => {
          childObject.plotted = childObject.create.call(this, context);
          return childObject;
        });
      }
      return object;
    });

  }

  checkGuess(positionX, positionY) {

    const context = this.canvasRef.current.getContext('2d');

    const x = positionX / this.props.scale;
    const y = positionY / this.props.scale;

    for (const object of this.props.objects) {

      let found = false;
      
      if (object.getType() === '1:1') {
        if (context.isPointInPath(object.plotted, x, y)) {
          this.props.onFind(object, x, y);
          found = true
        }
      } else {
        // group
        for (const childObject of object.objects) {
          if (context.isPointInPath(childObject.plotted, x, y)) {
            this.props.onFind(childObject, x, y);
            found = true;
            break;
          }
        }
      }

      if (found) {
        break;
      }
    }
  }

  render() {

    const canvasStyle = {
      touchAction: !this.props.needsManualScroll ? 'pan-y' : 'none',
      height: `${this.props.height * this.props.scale}px`,
      width: `${this.props.width * this.props.scale}px`
    }

    if (!this.props.isPinchZooming) {
      canvasStyle.transition = `height ${settings.canvasTransition}, width ${settings.canvasTransition}`;
    }

    return (
      <canvas
        className="findable"
        ref={this.canvasRef}
        height={this.props.height}
        width={this.props.width}
        onMouseDown={this.props.onMouseDown}
        onTouchStart={this.props.onTouchStart}
        tabIndex={this.props.disableTabbing ? '-1' : '0'}
        style={canvasStyle}
      />
    )
  }
}

Findable.defaultProps = {
  disableTabbing: false,
  isPinchZooming: false,
  needsManualScroll: false,
  objects: [],
};

Findable.propTypes = {
  disableTabbing: PropTypes.bool,
  height: PropTypes.number.isRequired,
  isPinchZooming: PropTypes.bool,
  needsManualScroll: PropTypes.bool,
  objects: PropTypes.array,
  onFind: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onTouchCancel: PropTypes.func.isRequired,
  onTouchStart: PropTypes.func.isRequired,
  onTouchMove: PropTypes.func.isRequired,
  onTouchEnd: PropTypes.func.isRequired,
  scale: PropTypes.number,
  width: PropTypes.number.isRequired,
};

export default Findable;
