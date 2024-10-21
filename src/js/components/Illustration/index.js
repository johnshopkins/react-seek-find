import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';

import Background from '../Background';
import Findable from '../Findable';
import Hint from '../Hint';
import MiniMap from '../MiniMap';
import Sights from '../Sights';
import QuestionIcon from '../Icons/Question';
import ZoomInIcon from '../Icons/ZoomIn';
import ZoomOutIcon from '../Icons/ZoomOut';

import settings from '../../../settings';

import './style.scss';

class Illustration extends Component {

  constructor(props) {
    super(props);

    this.canvas = createRef();
    this.sights = createRef();
    this.findable = createRef();

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
      hint: null,
      hintActive: false,
    };

    this.moveCanvas = this.moveCanvas.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFind = this.onFind.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.showHint - this.showHint.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {

    // look for certain changes that should update component

    const stateVars = [
      'canvasX',
      'canvasY',
      'hint',
      'hintActive',
      'isDragging',
      'isKeyboardFocused',
      'sightsX',
      'sightsY',
    ];

    for (const stateVar of stateVars) {
      if (nextState[stateVar] !== this.state[stateVar]) {
        // console.log(`state.${stateVar} changed`);
        return true;
      }
    }

    const propVars = [
      'found',
      'containerHeight',
      'containerWidth',
      'scale',
    ]

    for (const propVar of propVars) {
      if (nextProps[propVar] !== this.props[propVar]) {
        // console.log(`props.${propVar} changed`);
        return true;
      }
    }

    return false;
  }

  componentDidUpdate(prevProps) {

    // conditions that require canvasX and canvasY to be recalculated
    const conditions = (
      this.props.containerWidth !== prevProps.containerWidth ||
      this.props.containerHeight !== prevProps.containerHeight ||
      this.props.scale !== prevProps.scale
    );

    if (conditions) {
      const newX = this.state.canvasX * this.props.scale;
      const newY = this.state.canvasY * this.props.scale;

      this.moveCanvas(newX, newY);
    }
  }

  onFind(object) {
    this.props.onFind(object);
    this.removeHint();
  }

  onKeyDown(e) {
    this.setState({ isClick: false }, () => {
      if (this.state.isKeyboardFocused) {
        this.sights.current.moveSights(e);
      }
    });
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

    this.findable.current.checkGuess(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  }

  onMouseDown(e) {
    this.setState({
      isMouseDown: true,
      isClick: true,
      dragStartX: e.nativeEvent.offsetX,
      dragStartY: e.nativeEvent.offsetY,
    });

    window.addEventListener('mouseup', e => {
      this.setState({
        isDragging: false,
        isMouseDown: false,
      })
    }, { once: true });
  }

  onMouseMove(e) {

    if (this.state.isMouseDown) {
      this.setState({ isDragging: true}, () => {

        if (!this.state.isDragging) {
          return;
        }

        const diffX = this.state.dragStartX - e.nativeEvent.offsetX;
        const diffY = this.state.dragStartY - e.nativeEvent.offsetY;

        let newX = this.state.canvasX - diffX;
        let newY = this.state.canvasY - diffY;

        this.moveCanvas(newX, newY);
        
      });
    }

  }

  moveCanvas(newX, newY) {

    // scaled dimensions of image
    const scaledHeight = this.props.height * this.props.scale;
    const scaledWidth = this.props.width * this.props.scale;

    if (newX > 0) {
      newX = 0
    } else if (newX < -Math.abs(scaledWidth - this.props.containerWidth)) {
      newX = -Math.abs(scaledWidth - this.props.containerWidth);
    }

    if (newY > 0) {
      newY = 0
    } else if (newY < -Math.abs(scaledHeight - this.props.containerHeight)) {
      newY = -Math.abs(scaledHeight - this.props.containerHeight);
    }

    this.setState({
      canvasX: newX,
      canvasY: newY,
    });
  }

  showHint() {

    const notFound = Object.values(this.props.objects).filter(object => !this.props.found.includes(object.id));
    const random = Math.floor(Math.random() * notFound.length);

    this.setState({ hint: notFound[random], hintActive: true }, () => {
      setTimeout(() => this.removeHint(), settings.hintFadeIn + this.props.hintKeepAlive);
    });
  }

  removeHint() {
    this.setState({ hint: null }, () => {
      setTimeout(() => this.setState({ hintActive: false }), settings.hintFadeOut);
    });
  }

  render() {

    const gameStyles = {
      height: `${this.props.height}px`,
      width: `${this.props.width}px`,
      left: this.state.canvasX,
      top: this.state.canvasY,
    };

    if (this.state.isDragging) {
      gameStyles.cursor = 'grabbing';
    }

    return (
      <>
        <div className="utilities" style={this.props.containerStyles}>

          <button className="hint" disabled={this.state.hintActive} onClick={() => this.showHint()}>
            <QuestionIcon tooltip="Give me a hint" />
          </button>

          <div className="navigation">
            
            <MiniMap
              canvasX={this.state.canvasX}
              canvasY={this.state.canvasY}
              containerHeight={this.props.containerHeight}
              containerWidth={this.props.containerWidth}
              imageHeight={this.props.height * this.props.scale}
              imageWidth={this.props.width * this.props.scale}
              moveCanvas={this.moveCanvas}
            />
            
            <button className="zoom-in" onClick={this.props.zoomIn} disabled={this.props.zoomInLimitReached}>
              <ZoomInIcon tooltip="Zoom in" />
            </button>

            <button className="zoom-out" onClick={this.props.zoomOut} disabled={this.props.zoomOutLimitReached}>
              <ZoomOutIcon tooltip="Zoom out" />
            </button>

            <div style={{ background: '#fff', padding: '5px' }}>
              {this.props.scale * 100}%
            </div>
          </div>

        </div>
        <div className="game" style={gameStyles}>
          <Sights
            ref={this.sights}
            checkGuess={(x, y) => this.findable.current.checkGuess(x, y)}
            height={this.props.height}
            width={this.props.width}
            scale={this.props.scale}
            show={this.state.isKeyboardFocused}
          />
          <Hint
            height={this.props.height}
            width={this.props.width}
            object={this.state.hint}
            onShowHint={coords => this.sights.current.moveSightsTo(coords)}
            scale={this.props.scale}
          />
          <Findable
            onFind={this.onFind}
            found={this.props.found}
            objects={this.props.objects}
            ref={this.findable}
            scale={this.props.scale}
            height={this.props.height}
            width={this.props.width}
            onMouseDown={this.onMouseDown}
            onMouseMove={this.onMouseMove}
            onMouseUp={this.onMouseUp}
            onTouchMove={this.onTouchMove}
            onTouchStart={this.onTouchStart}
            onDragStart={() => false}
            onFocus={this.onFocus}
            onKeyDown={this.onKeyDown}
            onBlur={this.onBlur}
          />
          <Background
            imageSrc={this.props.imageSrc}
            height={this.props.height}
            width={this.props.width}
            scale={this.props.scale}
          />
        </div>
      </>
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
  containerStyles: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  onFind: PropTypes.func.isRequired,
  hint: PropTypes.object,
  scale: PropTypes.number.isRequired,
};

export default Illustration;
