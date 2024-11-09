import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import Background from '../Background';
import Findable from '../Findable';
import Found from '../Found';
import Hint from '../Hint';
import MiniMap from '../MiniMap';
import Sights from '../Sights';
import InstructionsIcon from '../Icons/Instructions';
import LightbulbIcon from '../Icons/Lightbulb';
import ReplayIcon from '../Icons/Replay';
import ZoomInIcon from '../Icons/ZoomIn';
import ZoomOutIcon from '../Icons/ZoomOut';
import getOffsetCoords from '../../lib/get-offset-coords';
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

      isClick: false,
      isKeyboardFocused: false,
      loading: true,
      isDragging: false,
      dragStartX: null,
      dragStartY: null,
      found: [],
      hint: null,
      hintActive: false,
    };

    this.moveCanvas = this.moveCanvas.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFind = this.onFind.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMoveNotThrottled = this.onMouseMove.bind(this);
    this.onMouseMoveThrottled = throttle(this.onMouseMove.bind(this), 30);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onSightsMove = this.onSightsMove.bind(this);
    this.showFound = this.showFound.bind(this);
    this.showHint = this.showHint.bind(this);
    this.onTouchMove = throttle(this.onTouchMove.bind(this), 30);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.replay = this.replay.bind(this);
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

  /**
   * The component should update only if changes were
   * made to certain state and prop variables
   * @param {object} nextProps 
   * @param {object} nextState 
   * @returns 
   */
  shouldComponentUpdate(nextProps, nextState) {
    const stateVars = [
      'canvasX',
      'canvasY',
      'found',
      'hint',
      'hintActive',
      'isDragging',
      'isKeyboardFocused',
      'loading',
    ];

    for (const stateVar of stateVars) {
      if (nextState[stateVar] !== this.state[stateVar]) {
        return true;
      }
    }

    const propVars = [
      'disableTabbing',
      'found',
      'gameComplete',
      'containerHeight',
      'containerWidth',
      'scale',
    ]

    for (const propVar of propVars) {
      if (nextProps[propVar] !== this.props[propVar]) {
        return true;
      }
    }

    return false;
  }

  /**
   * After the component updates, look for certain conditions
   * that require the canvas position to be recalculated.
   * @param {object} prevProps 
   * @param {object} prevState 
   */
  componentDidUpdate(prevProps, prevState) {

    const conditions = (

      // screen resize
      this.props.containerWidth !== prevProps.containerWidth ||
      this.props.containerHeight !== prevProps.containerHeight ||

      // scale changed
      this.props.scale !== prevProps.scale ||

      // hint recently became active
      (this.state.hintActive === true && prevState.hintActive === false)
    );

    if (conditions) {

      const scaleDiff = (this.props.scale * 100) / (prevProps.scale * 100);

      // move the sights
      this.sights.current.calibrateSights(scaleDiff);

      // new (x, y) coordinates to the center of the canvas' current location
      let newX = this.state.anchorX * scaleDiff;
      let newY = this.state.anchorY * scaleDiff;

      // translate to coordinates that moveCanvas can use (expects (x, y) to be origin)
      const originCoordinates = this.getOriginFromCenterAnchor(newX, newY)

      // but don't allow these to go above 0.
      // prevents the canvas from moving into the buffer on resize
      newX = originCoordinates.originX <= 0 ? originCoordinates.originX : 0;
      newY = originCoordinates.originY <= 0 ? originCoordinates.originY : 0;
      
      this.moveCanvas(newX, newY);
    }
  }

  /**
   * Reset the game so the user can play again
   */
  replay() {
    this.props.replay();

    // restore canvas position to (0, 0)
    const canvasX = 0;
    const canvasY = 0;

    const { anchorX, anchorY } = this.getCenterAnchor(canvasX, canvasY);

    this.setState({ canvasX, canvasY, anchorX, anchorY });

    this.findable.current.focusCanvas();
    this.sights.current.resetSights();
  }

  /**
   * If a found object is confirmed (hasn't been found before),
   * highlight it and remove the hint.
   * @param {object} object 
   */
  onFind(object) {
    const confirmed = this.props.onFind(object)
    if (confirmed) {
      this.showFound(object);
      this.removeHint(true);
    }
  }

  /**
   * A key was pressed while the game is in focus.
   * @param {event} e 
   */
  onKeyDown(e) {
    this.setState({ isClick: false }, () => {
      if (this.state.isKeyboardFocused) {
        this.sights.current.moveSights(e);
      }
    });
  }

  /**
   * When the game is focused, if it wasn't initiated by a click,
   * it was initiated by the keyboard. Set isKeyboardFocused to TRUE
   * so tht the sights will be shown.
   */
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

    this.findable.current.checkGuess(e.offsetX, e.offsetY);
  }

  onMouseDown(e) {

    const { offsetX, offsetY } = getOffsetCoords(e);
    
    this.setState({
      dragStartX: offsetX,
      dragStartY: offsetY,
    });

    const target = e.target;
    target.addEventListener('mousemove', this.onMouseMoveThrottled);

    window.addEventListener('mouseup', e => {
      this.onMouseMoveThrottled.cancel();
      target.removeEventListener('mousemove', this.onMouseMoveThrottled);
      this.onMouseUp(e);
    }, { once: true });
  }

  /**
   * React to the user moving the mouse after mousedown triggered.
   * Make sure the mouse has moved at least 5 pixels in one direction
   * before initiating click and drag. This prevents users that move
   * the mouse a couple pixels during the click from triggering a
   * click and drag when they actually wanted to submit a guess.
   * @param {MouseEvent} e 
   */
  onMouseMove(e) {

    const { offsetX, offsetY } = getOffsetCoords(e);
    const diffX = this.state.dragStartX - offsetX;
    const diffY = this.state.dragStartY - offsetY;

    if (this.state.isDragging) {
      let newX = this.state.canvasX - diffX;
      let newY = this.state.canvasY - diffY;
      this.moveCanvas(newX, newY);
    } else if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
      this.setState({ isDragging: true}, () => {
        this.onMouseMoveNotThrottled(e);
      });
    }
  }

  onTouchMove(e) {

    if (e.targetTouches.length !== 2 || e.changedTouches.length !== 2) {
      return;
    }

    const { offsetX, offsetY } = getOffsetCoords(e, true);

    const diffX = this.state.dragStartX - offsetX;
    const diffY = this.state.dragStartY - offsetY;

    let newX = this.state.canvasX - diffX;
    let newY = this.state.canvasY - diffY;

    this.moveCanvas(newX, newY);
  }

  onTouchStart(e) {

    // do not limit this event to 2-touch events because an event
    // can go from 1-touch to 2-touch without triggering touchstart again

    const { offsetX, offsetY } = getOffsetCoords(e, true);

    this.setState({
      dragStartX: offsetX,
      dragStartY: offsetY,
      isKeyboardFocused: false,
    });

    window.addEventListener('touchmove', this.onTouchMove);

    // reset state vars
    window.addEventListener('touchend', e => {
      this.onTouchMove.cancel();
      window.removeEventListener('touchmove', this.onTouchMove);
    }, { once: true });
  }

  /**
   * Move the image canvas to a new location. newX and newY correspond
   * to the coordinates of the image at its currently scaled size and will
   * be placed at the origin of the game container.
   * @param {number} newX 
   * @param {number} newY
   */
  moveCanvas(newX, newY) {

    // scaled dimensions of image
    const scaledHeight = this.props.imageHeight * this.props.scale;
    const scaledWidth = this.props.imageWidth * this.props.scale;

    if (this.props.buffer) {
      // adds buffer area around image for allow for utilities
      // replaces "uses edges of image" code below

      const xMin = settings.miniMap + (settings.utilitiesEdgeSpace * 2);
      const xMax = -Math.abs(scaledWidth - this.props.containerWidth) - settings.miniMap - (settings.utilitiesEdgeSpace * 2);
      const yMin = xMin;
      const yMax = -Math.abs(scaledHeight - this.props.containerHeight) - settings.miniMap - (settings.utilitiesEdgeSpace * 2);

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
   * @param {number} size
   * @param {string} direction 
   */
  onSightsMove(x, y, size, direction) {

    // size of minimap + utility edge
    const threshold = settings.miniMap + (settings.utilitiesEdgeSpace * 2);
    
    // move 1/5 of either the container height or width (whichever is largest)
    // but don't scroll more than the smallest
    const largestDimension = Math.max(this.props.containerHeight, this.props.containerWidth);
    const smallestDimension = Math.min(this.props.containerHeight, this.props.containerWidth);

    let move = largestDimension / 5;
    if (move > smallestDimension) {
      move = smallestDimension / 2;
    }

    if (direction === 'down' && this.props.containerHeight - threshold <= this.state.canvasY + y + size) {
      this.moveCanvas(this.state.canvasX, this.state.canvasY - move);
    } else if (direction === 'right' && this.props.containerWidth - threshold <= this.state.canvasX + x + size) {
      this.moveCanvas(this.state.canvasX - move, this.state.canvasY);
    } else if (direction === 'up' && y < Math.abs(this.state.canvasY) + threshold) {
      this.moveCanvas(this.state.canvasX, this.state.canvasY + move);
    } else if ( direction === 'left' && x < Math.abs(this.state.canvasX) + threshold) {
      this.moveCanvas(this.state.canvasX + move, this.state.canvasY);
    }
  }

  showHint() {

    const notFound = Object.values(this.props.objects).filter(object => !this.props.found.includes(object.id));
    const random = Math.floor(Math.random() * notFound.length);

    const hint = notFound[random];
    const coords = hint.hintCoords;
    const hintSize = hint.hintSize;

    const hintOffset = (hintSize * this.props.scale) / 2;
    const newX = coords.x * this.props.scale;
    const newY = coords.y * this.props.scale;

    this.setState({

      // set the center anchor to be the center of the hint
      // on componentDidUpdate, the new canvas position will be based on that
      anchorX: -Math.abs(newX + hintOffset),
      anchorY: -Math.abs(newY + hintOffset),

      // activate hint
      hint: hint,
      hintActive: true

    }, () => {

      this.props.scaleToFit(hint.hintSize, hint.hintSize, (scale) => {
        this.sights.current.moveSightsTo(coords.x * scale, coords.y * scale);
      });

      setTimeout(() => this.removeHint(), 15000);

      this.findable.current.focusCanvas();

    });
  }

  removeHint() {
    this.setState({
      hint: null,
      hintActive: false
    });
  }

  showFound(object) {
    this.setState(state => {
      const found = [...state.found]; // handle immutably to prevent bugs
      found.push(object);
      return { found }
    });
  }

  roundToThousandth(num) {
    return Math.round(num * 1000) / 1000;
  }

  render() {

    const containerStyles = {
      height: `${this.props.containerHeight}px`,
      width: `${this.props.containerWidth}px`,
    };

    const gameStyles = {
      height: `${this.props.imageHeight}px`,
      width: `${this.props.imageWidth}px`,
      left: this.roundToThousandth(this.state.canvasX),
      top: this.roundToThousandth(this.state.canvasY),
      // left: this.state.canvasX,
      // top: this.state.canvasY,
    };

    if (this.state.isDragging) {
      gameStyles.cursor = 'grabbing';
    } else {
      gameStyles.transition = `all ${settings.canvasTransition}`;
    }

    return (
      <div
        className="game-container"
        role="region"
        aria-label="Seek and Find"
        style={containerStyles}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        onMouseDown={() => {
          this.setState({
            isClick: true,
            isKeyboardFocused: false,
          });
        }}
      >
        <div className="game" style={gameStyles}>
          {!this.state.loading &&
            <>
              <Sights
                ref={this.sights}
                checkGuess={(x, y) => this.findable.current.checkGuess(x, y)}
                height={this.props.imageHeight * this.props.scale}
                onSightsMove={this.onSightsMove}
                show={this.state.isKeyboardFocused}
                width={this.props.imageWidth * this.props.scale}
              />
              {this.state.hint &&
                <Hint
                  height={this.props.imageHeight}
                  width={this.props.imageWidth}
                  object={this.state.hint}
                  scale={this.props.scale}
                />
              }
              <Found
                height={this.props.imageHeight}
                width={this.props.imageWidth}
                found={this.state.found}
                scale={this.props.scale}
              />
              <Findable
                disableTabbing={this.props.disableTabbing}
                onFind={this.onFind}
                objects={this.props.objects}
                ref={this.findable}
                scale={this.props.scale}
                height={this.props.imageHeight}
                width={this.props.imageWidth}
                onMouseDown={this.onMouseDown}
                onTouchStart={this.onTouchStart}
            />
            </>
          }
          <Background
            imageSrc={this.props.imageSrc}
            containerHeight={this.props.containerHeight}
            containerWidth={this.props.containerWidth}
            onReady={() => this.setState({ loading: false })}
            height={this.props.imageHeight}
            width={this.props.imageWidth}
            scale={this.props.scale}
          />
        </div>
        {!this.state.loading &&
          <div className="utilities" style={containerStyles}>

            <div className="instructions-and-hint">
              <button className="instructions" onClick={this.props.openInstructions} tabIndex={this.props.disableTabbing ? '-1' : null}>
                <InstructionsIcon tooltip="How to play" />
              </button>

              {!this.props.gameComplete &&
                <button className="hint" disabled={this.state.hintActive} onClick={this.showHint} tabIndex={this.props.disableTabbing ? '-1' : null}>
                  <LightbulbIcon tooltip="Give me a hint" />
                </button>
              }

              {this.props.gameComplete &&
                <button className="replay" onClick={this.replay} tabIndex={this.props.disableTabbing ? '-1' : null}>
                  <ReplayIcon tooltip="Play again" />
                </button>
              }
            </div>

            <div className="navigation">
              
              <MiniMap
                canvasX={this.state.canvasX}
                canvasY={this.state.canvasY}
                containerHeight={this.props.containerHeight}
                containerWidth={this.props.containerWidth}
                imageHeight={this.props.imageHeight * this.props.scale}
                imageWidth={this.props.imageWidth * this.props.scale}
                moveCanvas={this.moveCanvas}
              />
              
              <button className="zoom-in" onClick={() => {
                this.props.zoomIn((newScale, limitReached) => {
                  if (limitReached) {
                    this.findable.current.focusCanvas();
                  }
                })
              }} disabled={this.props.zoomInLimitReached} tabIndex={this.props.disableTabbing ? '-1' : null}>
                <ZoomInIcon tooltip="Zoom in" />
              </button>

              <button className="zoom-out" onClick={() => {
                this.props.zoomOut((newScale, limitReached) => {
                  if (limitReached) {
                    this.findable.current.focusCanvas();
                  }
                })
              }} disabled={this.props.zoomOutLimitReached} tabIndex={this.props.disableTabbing ? '-1' : null}>
                <ZoomOutIcon tooltip="Zoom out" />
              </button>

              <div style={{ background: '#fff', padding: '5px' }}>
                {Math.round(this.props.scale * 100)}%
              </div>
            </div>
          </div>
        }
      </div>
    );

  }
}

Illustration.defaultProps = {
  disableTabbing: false,
  found: [],
  gameComplete: false,
  scale: 1,
  zoomInLimitReached: false,
  zoomOutLimitReached: false,
};

Illustration.propTypes = {
  containerHeight: PropTypes.number.isRequired,
  containerWidth: PropTypes.number.isRequired,
  disableTabbing: PropTypes.bool,
  found: PropTypes.array,
  foundKeepAlive: PropTypes.number.isRequired,
  gameComplete: PropTypes.bool,
  hintKeepAlive: PropTypes.number.isRequired,
  imageHeight: PropTypes.number.isRequired,
  imageSrc: PropTypes.string.isRequired,
  imageWidth: PropTypes.number.isRequired,
  objects: PropTypes.array,
  openInstructions: PropTypes.func.isRequired,
  onFind: PropTypes.func.isRequired,
  replay: PropTypes.func.isRequired,
  scale: PropTypes.number,
  scaleToFit: PropTypes.func.isRequired,
  zoomIn: PropTypes.func.isRequired,
  zoomInLimitReached: PropTypes.bool,
  zoomOut: PropTypes.func.isRequired,
  zoomOutLimitReached: PropTypes.bool,
};

export default Illustration;
