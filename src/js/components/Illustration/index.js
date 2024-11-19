/*global logger*/
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
import SlashIcon from '../Icons/Slash';
import ZoomInIcon from '../Icons/ZoomIn';
import ZoomOutIcon from '../Icons/ZoomOut';
import getOffsetCoords from '../../lib/get-offset-coords';
import roundToThousandth from '../../lib/roundToThousandth';
import * as settings from '../../../css/utils/shared-variables.scss';
import './style.scss';

const throttle = require('lodash.throttle');

/**
 * Manages all the elements within the illustration portion
 * of the game (everything except the legend).
 */
class Illustration extends Component {

  constructor(props) {
    super(props);

    this.containerRef = createRef();
    this.gameRef = createRef();
    this.sightsRef = createRef();
    this.findableRef = createRef();
    this.zoomInRef = createRef();
    this.zoomOutRef = createRef();

    this.hintTimeout = null;

    const canvasX = 0;
    const canvasY = 0;

    this.scaledImageHeight = this.props.imageHeight * this.props.scale;
    this.scaledImageWidth = this.props.imageWidth * this.props.scale;

    this.bufferSize = parseInt(settings.miniMap) + (parseInt(settings.utilitiesEdgeSpace) * 2);

    this.loggedTouchMoveFailure = false;
    this.needsManualScroll = navigator.userAgent.includes('SamsungBrowser');

    const { anchorX, anchorY } = this.getCenterAnchor(canvasX, canvasY);
    const { gamePlacementX, gamePlacementY } = this.getGameOffset();

    this.state = {

      // image coords that correspond to the origin (0, 0) of the game container
      // used for css positioning
      canvasX,
      canvasY,

      // image coords that correspond to center of the game container
      // used to anchor scaling to the center of the image
      anchorX,
      anchorY,

      gamePlacementX,
      gamePlacementY,

      loading: true,
      isDragging: false,
      dragStartX: null,
      dragStartY: null,
      found: [],
      hint: null,
      hintActive: false,
    };

    this.getGameOffset = this.getGameOffset.bind(this);
    this.moveCanvas = this.moveCanvas.bind(this);
    this.onContainerMouseDown = this.onContainerMouseDown.bind(this);
    this.onFind = this.onFind.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMoveNotThrottled = this.onMouseMove.bind(this);
    this.onMouseMoveThrottled = throttle(this.onMouseMove.bind(this), 30);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onSightsMove = this.onSightsMove.bind(this);
    this.showFound = this.showFound.bind(this);
    this.showHint = this.showHint.bind(this);
    this.toggleHint = this.toggleHint.bind(this);
    this.onNewlyFocusedViaKeyboard = this.onNewlyFocusedViaKeyboard.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchMove = throttle(this.onTouchMove.bind(this), 30);
    this.onTouchMoveNotThrottled = this.onTouchMove.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.removeHint = this.removeHint.bind(this);
    this.replay = this.replay.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
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

    let anchorX;
    let anchorY;

    if (this.containerWidth >= this.scaledImageWidth) {
      anchorX = x - (this.scaledImageWidth / 2);
    } else {
      anchorX = x - (this.props.containerWidth / 2);
    }

    if (this.containerHeight >= this.scaledImageHeight) {
      anchorY = y - (this.scaledImageHeight / 2);
    } else {
      anchorY = y - (this.props.containerHeight / 2);
    }

    return { anchorX, anchorY };
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

    let originX;
    let originY;

    if (this.containerWidth >= this.scaledImageWidth) {
      originX = x + (this.scaledImageWidth / 2);
    } else {
      originX = x + (this.props.containerWidth / 2);
    }

    if (this.containerHeight >= this.scaledImageHeight) {
      originY = y + (this.scaledImageHeight / 2);
    } else {
      originY = y + (this.props.containerHeight / 2);
    }

    return { originX, originY };
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
      'gamePlacementX',
      'gamePlacementY',
      'hint',
      'hintActive',
      'isDragging',
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
      'isKeyboardFocused',
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

      this.scaledImageHeight = this.props.imageHeight * this.props.scale;
      this.scaledImageWidth = this.props.imageWidth * this.props.scale;

      // calibrate the sights
      this.sightsRef.current.calibrateSights(scaleDiff);

      // new (x, y) coordinates to the center of the canvas' current location
      let newX = this.state.anchorX * scaleDiff;
      let newY = this.state.anchorY * scaleDiff;

      if (this.props.isKeyboardFocused) {
        const containerBounds = this.containerRef.current.getBoundingClientRect();
        const gameBounds = this.gameRef.current.getBoundingClientRect();
        const sightsPosition = this.sightsRef.current.getSightsPosition(scaleDiff);

        if (this.containerWidth >= this.scaledImageWidth) {
          newX = (containerBounds.x - sightsPosition.x) * scaleDiff;
        } else {
          newX = (gameBounds.x - sightsPosition.x) * scaleDiff;
        }

        if (this.containerHeight >= this.scaledImageHeight) {
          newY = (containerBounds.y - sightsPosition.y) * scaleDiff;
        } else {
          newY = (gameBounds.y - sightsPosition.y) * scaleDiff;
        }
      }

      // translate to coordinates that moveCanvas can use (expects (x, y) to be origin)
      const originCoordinates = this.getOriginFromCenterAnchor(newX, newY);

      this.moveCanvas(originCoordinates.originX, originCoordinates.originY);
    }
  }

  getGameOffset() {

    // both sides
    const bufferSize = this.bufferSize * 2;

    let gameOffsetLeft = 0;
    let gameOffsetTop = 0;

    if (this.props.containerWidth > this.scaledImageWidth + bufferSize) {
      gameOffsetLeft = roundToThousandth((this.props.containerWidth - this.scaledImageWidth) / 2);
    }

    if (this.props.containerHeight > this.scaledImageHeight) {
      gameOffsetTop = roundToThousandth((this.props.containerHeight - this.scaledImageHeight) / 2);
    }

    return {
      gamePlacementX: gameOffsetLeft,
      gamePlacementY: gameOffsetTop,
    };
  }

  /**
   * Reset the game so the user can play again
   */
  replay() {
    this.props.replay();
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

    if (e.key === 'Tab' && !this.props.isKeyboardFocused) {
      return this.onNewlyFocusedViaKeyboard(e);
    }

    if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
      return;
    }

    if (!this.props.isKeyboardFocused) {
      this.onNewlyFocusedViaKeyboard(e);
    } else {
      this.sightsRef.current.moveSights(e);
    }
  }

  onNewlyFocusedViaKeyboard(e = false) {

    this.props.onKeyboardFocusChange(true);

    const x = this.state.canvasX > 0 ? 0 : Math.abs(this.state.canvasX);
    const y = this.state.canvasY > 0 ? 0 : Math.abs(this.state.canvasY);

    this.sightsRef.current.moveSightsTo(x, y, e);
  }

  onMouseUp(e) {
    if (this.state.isDragging) {
      this.setState({ isDragging: false });
      return;
    }

    this.findableRef.current.checkGuess(e.offsetX, e.offsetY);
  }

  onContainerMouseDown() {
    this.props.onKeyboardFocusChange(false);
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
      const newX = this.state.canvasX - diffX;
      const newY = this.state.canvasY - diffY;
      this.moveCanvas(newX, newY);
    } else if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
      this.setState({ isDragging: true}, () => {
        this.onMouseMoveNotThrottled(e);
      });
    }
  }

  onTouchMove(e) {

    if (e.targetTouches.length !== 2 && !this.needsManualScroll) {
      return;
    }

    if (e.cancelable) {
      // prevent browser default handling of 2-touch scroll
      // check first to make sure the event is cancelable as
      // samsung browser makes touchmove events not cancelable
      // after a second or two
      e.preventDefault();
    } else {
      if (!this.loggedTouchMoveFailure) {
        // track any other browsers that do this
        logger.log('touchmove event is not cancelable');
        this.loggedTouchMoveFailure = true;
      }
    }

    const { offsetX, offsetY } = getOffsetCoords(e);

    const diffX = this.state.dragStartX - offsetX;
    const diffY = this.state.dragStartY - offsetY;

    if (e.targetTouches.length === 1 && this.needsManualScroll) {
      // manually scroll the user
      return window.scroll({
        top: window.scrollY + diffY,
        behavior: 'auto',
      });
    }

    if (this.state.isDragging) {
      const newX = this.state.canvasX - diffX;
      const newY = this.state.canvasY - diffY;
      this.moveCanvas(newX, newY);
    } else if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
      this.setState({ isDragging: true}, () => {
        this.onTouchMoveNotThrottled(e);
      });
    }
  }

  onTouchStart(e) {

    // do not limit this event to 2-touch events because, in some browsers,
    // an event can go from 1-touch to 2-touch without triggering touchstart again
    // if (e.targetTouches.length !== 2) {
    //   return;
    // }

    const { offsetX, offsetY } = getOffsetCoords(e);

    this.setState({
      dragStartX: offsetX,
      dragStartY: offsetY,
      isDragging: true,
    });

    this.props.onKeyboardFocusChange(false);
  }

  onTouchEnd() {
    this.onTouchMove.cancel();
    this.setState({ isDragging: false });
  }

  /**
   * Move the image canvas to a new location. newX and newY correspond
   * to the coordinates of the image at its currently scaled size and will
   * be placed at the origin of the game container.
   * @param {number} newX 
   * @param {number} newY
   */
  moveCanvas(newX, newY) {

    // should the game be offset?
    // centers the image within the game space when the height or width
    // is smaller than the container height or width
    let { gamePlacementX, gamePlacementY } = this.getGameOffset();

    if (gamePlacementX <= this.bufferSize) {
      gamePlacementX = 0;
    }

    if (gamePlacementY <= this.bufferSize) {
      gamePlacementY = 0;
    }

    if (gamePlacementX > 0 ) {
      newX = 0
    } else if (gamePlacementX === 0 && this.state.gamePlacementX > 0 && !this.state.hintActive) {

      // game was previous placed. adjust newX to move the canvas to the center
      newX = roundToThousandth((this.props.containerWidth - this.scaledImageWidth) / 2);

    } else {

      const xMin = this.bufferSize;

      const xMaxCalc = this.props.containerWidth - (this.scaledImageWidth + this.bufferSize);
      const xMax = this.props.containerWidth < this.scaledImageWidth ? -Math.abs(xMaxCalc) : xMaxCalc;

      if (newX > xMin) {
        newX = xMin;
      } else if (newX < xMax) {
        newX = xMax;
      }
    }

    if (gamePlacementY > 0 ) {
      newY = 0

    } else if (gamePlacementY === 0 && this.state.gamePlacementY > 0 && !this.state.hintActive) {

      // game was previous placed. adjust newX to move the canvas to the center
      newY = roundToThousandth((this.props.containerHeight - this.scaledImageHeight) / 2);

    } else {

      const yMin = this.bufferSize;

      const yMaxCalc = this.props.containerHeight - (this.scaledImageHeight + this.bufferSize);
      const yMax = this.props.containerHeight < this.scaledImageHeight ? -Math.abs(yMaxCalc) : yMaxCalc;

       if (newY > yMin) {
        newY = yMin;
      } else if (newY < yMax) {
        newY = yMax;
      }
    }

    const { anchorX, anchorY } = this.getCenterAnchor(newX, newY);

    this.setState({
      anchorX,
      anchorY,
      canvasX: newX,
      canvasY: newY,
      gamePlacementX,
      gamePlacementY
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
    const threshold = parseInt(settings.miniMap) + (parseInt(settings.utilitiesEdgeSpace) * 2);
    
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

  toggleHint() {
    !this.state.hintActive ?  this.showHint() : this.removeHint();
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
      hint, // get the hint in the DOM
    }, () => {

      this.props.scaleToFit(hint.hintSize, hint.hintSize, (scale) => {
        this.sightsRef.current.moveSightsTo(coords.x * scale, coords.y * scale);
        this.setState({ hintActive: true }, () => {
          this.sightsRef.current.moveSightsTo(coords.x * scale, coords.y * scale);
        })
      });
      
      this.hintTimeout = setTimeout(() => this.removeHint(), 15000);

    });
  }

  removeHint() {

    clearTimeout(this.hintTimeout);

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

  zoomIn () {
    this.props.zoomIn((newScale, limitReached) => {
      if (limitReached) {
        this.zoomOutRef.current.focus();
      }
    })
  }

  zoomOut() {
    this.props.zoomOut((newScale, limitReached) => {
      if (limitReached) {
        this.zoomInRef.current.focus();
      }
    })
  }

  render() {

    const containerStyles = {
      height: `${this.props.containerHeight}px`,
      width: `${this.props.containerWidth}px`,
    };

    const gameStyles = {
      // height: `${this.props.imageHeight}px`,
      // width: `${this.props.imageWidth}px`,
      left: roundToThousandth(this.state.canvasX),
      top: roundToThousandth(this.state.canvasY),
      // left: this.state.canvasX,
      // top: this.state.canvasY,
    };

    const gamePlacementStyles = {
      left: `${this.state.gamePlacementX}px`,
      top: `${this.state.gamePlacementY}px`,
    }

    const gameClasses = ['game'];

    if (this.state.isDragging) {
      gameClasses.push('grabbing');
    } else {
      gameStyles.transition = `all ${settings.canvasTransition}`;
      gamePlacementStyles.transition = `all ${settings.canvasTransition}`;
    }

    return (
      <div
        className="game-container"
        role="region"
        aria-label="Seek and Find"
        style={containerStyles}
        ref={this.containerRef}
        onKeyDown={this.onKeyDown}
        onMouseDown={this.onContainerMouseDown}
      >
        <div className="game-placement" style={gamePlacementStyles}>
          <div className={gameClasses.join(' ')} style={gameStyles} ref={this.gameRef}>
            {!this.state.loading &&
              <>
                <Sights
                  ref={this.sightsRef}
                  checkGuess={(x, y) => this.findableRef.current.checkGuess(x, y)}
                  height={this.scaledImageHeight}
                  onSightsMove={this.onSightsMove}
                  show={this.props.isKeyboardFocused}
                  width={this.scaledImageWidth}
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
                  ref={this.findableRef}
                  scale={this.props.scale}
                  height={this.props.imageHeight}
                  width={this.props.imageWidth}
                  needsManualScroll={this.needsManualScroll}
                  onMouseDown={this.onMouseDown}
                  onTouchStart={this.onTouchStart}
                  onTouchMove={this.onTouchMove}
                  onTouchEnd={this.onTouchEnd}
              />
              </>
            }
            <Background
              imageSrc={this.props.imageSrc}
              containerHeight={this.props.containerHeight}
              containerWidth={this.props.containerWidth}
              gamePlacementX={this.state.gamePlacementX}
              gamePlacementY={this.state.gamePlacementY}
              onReady={() => this.setState({ loading: false })}
              height={this.props.imageHeight}
              width={this.props.imageWidth}
              scale={this.props.scale}
            />
          </div>
        </div>
        {!this.state.loading &&
          <div className="utilities" style={containerStyles}>

            <div className="instructions-and-hint">
              <button className="instructions" onClick={this.props.openInstructions} tabIndex={this.props.disableTabbing ? '-1' : null}>
                <InstructionsIcon tooltip="How to play" />
              </button>

              {!this.props.gameComplete &&
                <button className="hint" onClick={this.toggleHint} tabIndex={this.props.disableTabbing ? '-1' : null}>
                  {this.state.hintActive && <SlashIcon className="slash" aria-hidden="true" />}
                  <LightbulbIcon className="lightbulb" tooltip={!this.state.hintActive ? 'Give me a hint' : 'Remove hint'} />
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
                imageHeight={this.scaledImageHeight}
                imageWidth={this.scaledImageWidth}
                moveCanvas={this.moveCanvas}
              />
              
              <button className="zoom-in" ref={this.zoomInRef} onClick={this.zoomIn} disabled={this.props.zoomInLimitReached} tabIndex={this.props.disableTabbing ? '-1' : null}>
                <ZoomInIcon tooltip="Zoom in" />
              </button>

              <button className="zoom-out" ref={this.zoomOutRef} onClick={this.zoomOut} disabled={this.props.zoomOutLimitReached} tabIndex={this.props.disableTabbing ? '-1' : null}>
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
  onKeyboardFocusChange: PropTypes.func.isRequired,
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
