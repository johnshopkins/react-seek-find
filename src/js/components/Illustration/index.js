import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';

import Background from '../Background';
import Hint from '../Hint';
import Sights from '../Sights';

import './style.scss';

class Illustration extends Component {

  constructor(props) {
    super(props);

    this.canvas = createRef();
    this.sights = createRef();

    this.state = {
      canvasX: 0,
      canvasY: 0,
      isClick: false,
      isKeyboardFocused: false,
      context: null,
      isDragging: false,
      dragStartX: null,
      dragStartY: null,
      isMouseDown: false,
    };

    this.objects = [];

    this.checkGuess = this.checkGuess.bind(this);
    this.drawObjects = this.drawObjects.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onShowHint = this.onShowHint.bind(this);
  }

  drawObjects() {

    this.state.context.clearRect(0, 0, this.props.width, this.props.height);
    this.state.context.resetTransform();
    this.state.context.scale(this.props.scale, this.props.scale);

    this.objects = this.props.objects.map(object => {
      object.plotted = object.create.call(this, this.state.context, this.props.found.includes(object.id));
      return object;
    });
  }

  componentDidMount() {

    window.addEventListener('mouseup', e => {
      this.setState({
        isDragging: false,
        isMouseDown: false,
      })
    });

    const context = this.canvas.current.getContext('2d');
    this.setState({ context: context }, () => this.drawObjects());
    
  }

  shouldComponentUpdate(nextProps, nextState) {

    // look for certain changes that should update component

    const stateVars = [
      'canvasX',
      'canvasY',
      'isKeyboardFocused',
      'sightsX',
      'sightsY',
    ];

    for (const stateVar of stateVars) {
      if (nextState[stateVar] !== this.state[stateVar]) {
        console.log(`state.${stateVar} changed`);
        return true;
      }
    }

    const propVars = [
      'found',
      'containerHeight',
      'containerWidth',
      'hint',
      'scale',
    ]

    for (const propVar of propVars) {
      if (nextProps[propVar] !== this.props[propVar]) {
        console.log(`props.${propVar} changed`);
        return true;
      }
    }

    return false;
  }

  componentDidUpdate() {
    this.drawObjects();
  }

  checkGuess(positionX, positionY) {
    for (const object of this.objects) {
      if (this.state.context.isPointInPath(object.plotted, positionX, positionY)) {
        this.props.onFind(object);
        break;
      }
    }
  }

  onKeyDown(e) {
    this.setState({ isClick: false }, () => {
      if (this.state.isKeyboardFocused) {
        this.sights.current.moveSights(e);
      }
    });
  }

  onShowHint({ x, y }) {
    this.sights.current.moveSightsTo(x, y);
  }

  onFocus() {
    this.setState({ isKeyboardFocused: !this.state.isClick });
  }

  onBlur() {
    this.setState({ isKeyboardFocused: false });
  }

  onMouseUp(e) {

    if (this.state.isDragging) {
      this.setState({ isDragging: false });
      return;
    }

    this.checkGuess(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  }

  onMouseDown(e) {
    this.setState({
      isMouseDown: true,
      isClick: true,
      dragStartX: e.nativeEvent.offsetX,
      dragStartY: e.nativeEvent.offsetY,
    });
  }

  onMouseMove(e) {

    if (this.state.isMouseDown) {
      this.setState({ isDragging: true}, () => {

        if (!this.state.isDragging) {
          return;
        }

        const diffX = this.state.dragStartX - e.nativeEvent.offsetX;
        const diffY = this.state.dragStartY - e.nativeEvent.offsetY;

        // set min/max drag values

        let newX = this.state.canvasX - diffX;
        let newY = this.state.canvasY - diffY;
        
        if (newX > 0) {
          newX = 0
        } else if (newX < -Math.abs(this.props.width - this.props.containerWidth)) {
          newX = -Math.abs(this.props.width - this.props.containerWidth);
        }

        if (newY > 0) {
          newY = 0
        } else if (newY < -Math.abs(this.props.height - this.props.containerHeight)) {
          newY = -Math.abs(this.props.height - this.props.containerHeight);
        }

        this.setState({
          canvasX: newX,
          canvasY: newY,
        });
        
      });
    }

  }

  render() {

    console.log('illustration render');
    console.log('---');

    const containerStyles = {
      height: `${this.props.containerHeight}px`,
      width: `${this.props.containerWidth}px`,
    };

    const gameStyles = {
      height: `${this.props.height}px`,
      width: `${this.props.width}px`,
      left: this.state.canvasX,
      top: this.state.canvasY,
    };

    if (this.state.isDragging) {
      gameStyles.cursor = 'grabbing';
    }

    console.log('hint?', this.props.hint);

    return (
      <div className="game-container" role="region" aria-label="Seek and Find" style={containerStyles}>
        <div
          className="game"
          style={gameStyles}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseUp={this.onMouseUp}
          onDragStart={() => false}
          onFocus={this.onFocus}
          onKeyDown={this.onKeyDown}
          onBlur={this.onBlur}
          tabIndex="0" // makes keyboard focusable
        >
          {this.state.isKeyboardFocused &&
            <Sights
              ref={this.sights}
              checkGuess={this.checkGuess}
              height={this.props.height}
              width={this.props.width}
              scale={this.props.scale}
            />
          }
          <Hint
            height={this.props.height}
            width={this.props.width}
            object={this.props.hint}
            onShowHint={this.onShowHint}
            scale={this.props.scale}
          />
          <canvas
            ref={this.canvas}
            height={this.props.height}
            width={this.props.width}
          />
          <Background
            imageSrc={this.props.imageSrc}
            height={this.props.height}
            width={this.props.width}
            scale={this.props.scale}
          />
        </div>
      </div>
    );

  }
}

Illustration.defaultProps = {
  found: [],
  scale: 1,
};

Illustration.propTypes = {
  found: PropTypes.array,
  imageSrc: PropTypes.string.isRequired,
  objects: PropTypes.array,
  containerHeight: PropTypes.number.isRequired,
  containerWidth: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  onFind: PropTypes.func.isRequired,
  hint: PropTypes.object,
  scale: PropTypes.number.isRequired,
};

export default Illustration;
