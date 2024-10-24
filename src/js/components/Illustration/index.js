import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import Background from '../Background';
import Findable from '../Findable';
import Found from '../Found';
import Hint from '../Hint';
import InstructionsModal from '../InstructionsModal';
import MiniMap from '../MiniMap';
import Sights from '../Sights';
import InstructionsIcon from '../Icons/Instructions';
import LightbulbIcon from '../Icons/Lightbulb';
import ZoomInIcon from '../Icons/ZoomIn';
import ZoomOutIcon from '../Icons/ZoomOut';
import settings from '../../../settings';
import './style.scss';

const throttle = require('lodash.throttle');

/**
 * Manages all the elements within the illustration portion
 * of the game (everything except the legend).
 */
class Illustration extends Component {

  constructor(props) {
    super(props);

    this.canvas = createRef();
    this.sights = createRef();
    this.findable = createRef();

    const canvasX = 0;
    const canvasY = 0;

    const { anchorX, anchorY } = this.getCenterAnchor(canvasX, canvasY);

    this.state = {

      // image coords that correspond to the origin (0, 0) of the game container
      // used for css positioning
      canvasX,
      canvasY,

      // image coords that correspond to center of the game container
      // used to anchor scaling to the center of the image
      anchorX,
      anchorY,

      isKeyboardFocused: false,
      focused: false,
      context: null,
      isDragging: false,
      dragStartX: null,
      dragStartY: null,
      hint: null,
      hintActive: false,
      found: null,
      foundActive: false,
      instructionsOpen: false,
    };

    this.closeInstructions = this.closeInstructions.bind(this);
    this.moveCanvas = this.moveCanvas.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFind = this.onFind.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = throttle(this.onMouseMove.bind(this), 30);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.openInstructions = this.openInstructions.bind(this);
    this.onSightsMove = this.onSightsMove.bind(this);
    this.showFound = this.showFound.bind(this);
    this.showHint = this.showHint.bind(this);
    this.onTouchMove = throttle(this.onTouchMove.bind(this), 30);
    this.onTouchStart = this.onTouchStart.bind(this);
  }

  /**
   * With the given coordinates that correspond to the origin (0, 0)
   * of the game container, figure out the coordinates that correspond
   * to the center of the game container.
   * @param {number} x 
   * @param {number} y 
   * @returns object
   */
  getCenterAnchor(x, y) {
    return {
      anchorX: x - (this.props.containerWidth / 2),
      anchorY: y - (this.props.containerHeight / 2),
    };
  }

  /**
   * With the given coordinates that correspond to the center of the
   * game container, figure out the coordinates that correspond to
   * the origin (0, 0) of the game container.
   * @param {number} x 
   * @param {number} y 
   * @returns object
   */
  getOriginFromCenterAnchor(x, y) {
    return {
      originX: x + (this.props.containerWidth / 2),
      originY: y + (this.props.containerHeight / 2),
    };
  }

  shouldComponentUpdate(nextProps, nextState) {

    // look for certain changes that should update component

    const stateVars = [
      'canvasX',
      'canvasY',
      'found',
      'foundActive',
      'hint',
      'hintActive',
      'instructionsOpen',
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
      'breakpoint',
      'emToPixel',
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

      const scaleDiff = (this.props.scale * 100) / (prevProps.scale * 100);

      const newX = this.state.anchorX * scaleDiff;
      const newY = this.state.anchorY * scaleDiff;

      this.moveCanvas(newX, newY, true);
    }
  }

  onFind(object) {
    this.showFound(object);
    this.props.onFind(object);
    this.removeHint();
  }

  onKeyDown(e) {
    if (this.state.focused) {
      this.setState({ isKeyboardFocused: true }, () => {
        this.sights.current.moveSights(e);
      });
    }
  }

  onFocus() {
    this.setState({ focused: true });
  }

  onBlur() {
    this.setState({
      focused: false,
      isKeyboardFocused: false,
    });
  }

  onMouseUp(e) {
    if (this.state.isDragging) {
      this.setState({ isDragging: false });
      return;
    }

    this.findable.current.checkGuess(e.offsetX, e.offsetY);
  }

  onMouseDown(e) {
    this.setState({
      dragStartX: e.nativeEvent.offsetX,
      dragStartY: e.nativeEvent.offsetY,
    });

    const target = e.target;
    target.addEventListener('mousemove', this.onMouseMove);

    window.addEventListener('mouseup', e => {
      this.onMouseUp(e);
      target.removeEventListener('mousemove', this.onMouseMove);
      this.setState({ isDragging: false });
    }, { once: true });
  }

  onMouseMove(e) {
    this.setState({ isDragging: true}, () => {

      const diffX = this.state.dragStartX - e.offsetX;
      const diffY = this.state.dragStartY - e.offsetY;

      let newX = this.state.canvasX - diffX;
      let newY = this.state.canvasY - diffY;

      this.moveCanvas(newX, newY);
      
    });
  }

  onTouchMove(e) {

    if (e.targetTouches.length !== 2 || e.changedTouches.length !== 2) {
      console.log('do not respond to this touchmove event');
      return;
    }

    const bcr = e.target.getBoundingClientRect();
    const offsetX = e.targetTouches[0].clientX - bcr.x;
    const offsetY = e.targetTouches[0].clientY - bcr.y;

    const diffX = this.state.dragStartX - offsetX;
    const diffY = this.state.dragStartY - offsetY;

    let newX = this.state.canvasX - diffX;
    let newY = this.state.canvasY - diffY;

    this.moveCanvas(newX, newY);
  }

  onTouchStart(e) {

    if (this.props.showTouchInstruction) {
      this.props.hideTouchInstruction();
    }

    // do not limit this event to 2-touch events because an event
    // can go from 1-touch to 2-touch without triggering touchstart again

    // touch events do not give offset relative to target element,
    // so we need to calculate them to get offset values like mouse events
    const bcr = e.target.getBoundingClientRect();
    const offsetX = e.targetTouches[0].clientX - bcr.x;
    const offsetY = e.targetTouches[0].clientY - bcr.y;

    const state = {
      dragStartX: offsetX,
      dragStartY: offsetY,
    };
    this.setState(state);

    window.addEventListener('touchmove', this.onTouchMove);

    // reset state vars
    window.addEventListener('touchend', e => {
      this.setState({
        prevTouchDistance: null,
        prevTouchEvent: null,
      })
      window.removeEventListener('touchmove', this.onTouchMove);
    }, { once: true });
  }

  /**
   * Move the image canvas to a new location. newX and newY correspond
   * to the coordinates of the image at its currently scaled size and will
   * be placed at the origin (0, 0) of the game container.
   * 
   * If `center` parameter is true, the newX and newY represent the (x, y)
   * coordinates to move to that are in the center of the game container.
   * 
   * @param {number} newX 
   * @param {number} newY
   * @param {string} center
   */
  moveCanvas(newX, newY, center = false, moveSights = true) {

    if (center) {
      const originCoordinates = this.getOriginFromCenterAnchor(newX, newY)
      newX = originCoordinates.originX;
      newY = originCoordinates.originY;
    }

    // scaled dimensions of image
    const scaledHeight = this.props.height * this.props.scale;
    const scaledWidth = this.props.width * this.props.scale;

    if (this.props.buffer) {
      // adds buffer area around image for allow for utilities
      // replaces "uses edges of image" code below

      const utilityEdgeSpace = settings.utilitiesEdgeSpace * this.props.emToPixel;
      const miniMapWidth = settings.miniMap * this.props.emToPixel;

      const xMin = miniMapWidth + (utilityEdgeSpace * 2);
      const xMax = -Math.abs(scaledWidth - this.props.containerWidth) - miniMapWidth - (utilityEdgeSpace * 2);
      const yMin = xMin;
      const yMax = -Math.abs(scaledHeight - this.props.containerHeight) - miniMapWidth - (utilityEdgeSpace * 2);

      // adds buffer for icons
      if (newX > xMin) {
        newX = xMin;
      } else if (newX < xMax) {
        newX = xMax;
      }

      if (newY > yMin) {
        newY = yMin;
      } else if (newY < yMax) {
        newY = yMax;
      }
    } else {
      // uses edges of image
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
    }

    const { anchorX, anchorY } = this.getCenterAnchor(newX, newY);

    if (moveSights) {
      // move sights to this location as well
      const sightsX = newX < 0 ? Math.abs(newX) : 0;
      const sightsY = newY < 0 ? Math.abs(newY) : 0;
      this.sights.current.moveSightsTo(sightsX, sightsY, true);
    }

    this.setState({
      canvasX: newX,
      canvasY: newY,
      anchorX,
      anchorY,
    });
  }

  /**
   * Pan the canvas, if necessary.
   * @param {number} x 
   * @param {number} y 
   * @param {string} direction 
   */
  onSightsMove(x, y, direction) {

    // 1.3x the size of the minimap width
    const threshold = ((settings.miniMap * 1.2) + settings.utilitiesEdgeSpace) * this.props.emToPixel;
    
    // move 1/5 of either the container height or width (whichever is largest)
    // but don't scroll more than the smallest
    const largestDimension = Math.max(this.props.containerHeight, this.props.containerWidth);
    const smallestDimension = Math.min(this.props.containerHeight, this.props.containerWidth);

    let move = largestDimension / 5;
    if (move > smallestDimension) {
      move = smallestDimension / 2;
    }

    const currentX = this.state.canvasX;
    const currentY = this.state.canvasY;

    let height = this.props.containerHeight;
    let width = this.props.containerWidth;

    if (currentY > 0) {
      // make up for the buffer space
      // multiple by two to make up for addition of currentY in the calculation
      // if we don't multiply by two, it's the same as currentY = 0
      y = y + (currentY * 2);
    }

    if (currentX > 0) {
      // make up for the buffer space
      // multiple by two to make up for addition of currentX in the calculation
      // if we don't multiply by two, it's the same as currentX = 0
      x = x + (currentX * 2);
    }

    if (direction === 'down' && y > Math.abs(currentY) + height - threshold) {
      this.moveCanvas(currentX, currentY - move, false, false);
    } else if (direction === 'right' && x > Math.abs(currentX) + width - threshold) {
      this.moveCanvas(currentX - move, currentY, false, false);
    } else if (direction === 'up' && y < Math.abs(currentY) + threshold) {
      this.moveCanvas(currentX, currentY + move, false, false);
    } else if ( direction === 'left' && x < Math.abs(currentX) + threshold) {
      this.moveCanvas(currentX + move, currentY, false, false);
    }
  }

  showHint() {

    const notFound = Object.values(this.props.objects).filter(object => !this.props.found.includes(object.id));
    const random = Math.floor(Math.random() * notFound.length);

    const hint = notFound[random];
    const coords = hint.hintCoords;

    const hintOffset = (hint.hintSize * this.props.scale) / 2;
    const newX = coords.x * this.props.scale;
    const newY = coords.y * this.props.scale;

    // move canvas so that the hint is within the center (or as close to center as possible) of the view
    this.moveCanvas(-Math.abs(newX + hintOffset), -Math.abs(newY + hintOffset), true, false);

    // scale the image so the entire hint can be seen as closely as possible
    this.props.scaleToFit(hint.hintSize, hint.hintSize, () => {
      // move sights to the hint area
      this.sights.current.moveSightsTo(coords.x, coords.y);
    });

    this.setState({ hint: notFound[random], hintActive: true }, () => {
      setTimeout(() => this.removeHint(), settings.hintFadeIn + this.props.hintKeepAlive);
    });
  }

  removeHint() {
    this.setState({ hint: null }, () => {
      setTimeout(() => this.setState({ hintActive: false }), settings.hintFadeOut);
    });
  }

  showFound(object) {

    this.setState({ found: object, foundActive: true }, () => {
      setTimeout(() => this.removeFound(), settings.foundFadeIn + this.props.foundKeepAlive);
    });
  }

  removeFound() {
    this.setState({ found: null }, () => {
      setTimeout(() => this.setState({ foundActive: false }), settings.foundFadeOut);
    });
  }

  openInstructions() {
    this.setState({ instructionsOpen: true });
  }

  closeInstructions() {
    this.setState({ instructionsOpen: false });
  }

  render() {

    console.log('illustration render');

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
      <div
        className="game-container"
        role="region"
        aria-label="Seek and Find"
        style={this.props.containerStyles}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
      >
        <InstructionsModal
          onClose={this.closeInstructions}
          isOpen={this.state.instructionsOpen}
        />
        <div className="utilities" style={this.props.containerStyles}>

          <div className="instructions-and-hint">
            <button className="instructions" onClick={() => this.openInstructions()}>
              <InstructionsIcon tooltip="How to play" />
            </button>

            {!this.props.gameComplete &&
              <button className="hint" disabled={this.state.hintActive} onClick={() => this.showHint()}>
                <LightbulbIcon tooltip="Give me a hint" />
              </button>
            }
          </div>

          <div className="navigation">
            
            <MiniMap
              breakpoint={this.props.breakpoint}
              canvasX={this.state.canvasX}
              canvasY={this.state.canvasY}
              containerHeight={this.props.containerHeight}
              containerWidth={this.props.containerWidth}
              emToPixel={this.props.emToPixel}
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
              {Math.round(this.props.scale * 100)}%
            </div>
          </div>

        </div>

        <div className="game" style={gameStyles}>
          <Sights
            ref={this.sights}
            checkGuess={(x, y) => this.findable.current.checkGuess(x, y)}
            height={this.props.height}
            onSightsMove={this.onSightsMove}
            width={this.props.width}
            scale={this.props.scale}
            // show={this.state.isKeyboardFocused}
            show={true}
          />
          <Hint
            height={this.props.height}
            width={this.props.width}
            object={this.state.hint}
            scale={this.props.scale}
          />
          <Found
            height={this.props.height}
            width={this.props.width}
            object={this.state.found}
            scale={this.props.scale}
          />
          <Findable
            onFind={this.onFind}
            objects={this.props.objects}
            ref={this.findable}
            scale={this.props.scale}
            height={this.props.height}
            width={this.props.width}
            onMouseDown={this.onMouseDown}
            onTouchStart={this.onTouchStart}
            showTouchInstruction={this.props.showTouchInstruction}
            touchInstructionStyle={this.props.containerStyles}
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
  foundKeepAlive: PropTypes.number.isRequired,
  imageSrc: PropTypes.string.isRequired,
  objects: PropTypes.array,
  containerHeight: PropTypes.number.isRequired,
  containerWidth: PropTypes.number.isRequired,
  containerStyles: PropTypes.object.isRequired,
  hintKeepAlive: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  onFind: PropTypes.func.isRequired,
  hint: PropTypes.object,
  scale: PropTypes.number.isRequired,
};

export default Illustration;
