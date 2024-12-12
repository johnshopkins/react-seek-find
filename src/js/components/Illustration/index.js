/*global logger*/
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import AlreadyFound from '../AlreadyFound';
import Background from '../Background';
import Findable from '../Findable';
import Found from '../Found';
import Hint from '../Hint';
import MiniMap from '../MiniMap';
import Sights from '../Sights';
import MaximizeIcon from '../Icons/Maximize';
import MinimizeIcon from '../Icons/Minimize';
import InstructionsIcon from '../Icons/Instructions';
import LightbulbIcon from '../Icons/Lightbulb';
import ReplayIcon from '../Icons/Replay';
import SlashIcon from '../Icons/Slash';
import ZoomInIcon from '../Icons/ZoomIn';
import ZoomOutIcon from '../Icons/ZoomOut';
import distanceBetweenTouch from '../../lib/distance-between-touch';
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

    this.alreadyFoundTimeout = null;
    this.hintTimeout = null;

    const canvasX = 0;
    const canvasY = 0;

    this.scaledImageHeight = this.props.imageHeight * this.props.scale;
    this.scaledImageWidth = this.props.imageWidth * this.props.scale;

    this.bufferSize = parseInt(settings.miniMap) + (parseInt(settings.utilitiesEdgeSpace) * 2);

    this.touchMoveFailures = 0;
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

      anchorToCenter: true,
      zoomAnchorX: null,
      zoomAnchorY: null,

      gamePlacementX,
      gamePlacementY,

      // touchmove event
      // used to detect zoom in/out pinch motions
      prevTouchEvent: null,

      // distance between touches
      // used to detect zoom in/out pinch motions
      prevTouchDistance: null,

      // pan or zoom
      prevTouchEventType: null,

      loading: true,
      isDragging: false,
      isPinchZooming: false,
      dragStartX: null,
      dragStartY: null,
      alreadyFound: null,
      found: [],
      hint: null,
      hintActive: false,
      hintsGiven: [],
    };

    this.evaluateTouchMove = this.evaluateTouchMove.bind(this);
    this.getGameOffset = this.getGameOffset.bind(this);
    this.removeAlreadyFound = this.removeAlreadyFound.bind(this);
    this.moveCanvas = this.moveCanvas.bind(this);
    this.getOriginFromZoomAnchor = this.getOriginFromZoomAnchor.bind(this);
    this.getRandomHint = this.getRandomHint.bind(this);
    this.handleContainerMouseDown = this.handleContainerMouseDown.bind(this);
    this.handleFoundObject = this.handleFoundObject.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMoveNotThrottled = this.handleMouseMove.bind(this);
    this.handleMouseMoveThrottled = throttle(this.handleMouseMove.bind(this), 30);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleSightsMove = this.handleSightsMove.bind(this);
    this.showAlreadyFound = this.showAlreadyFound.bind(this);
    this.showFound = this.showFound.bind(this);
    this.showHint = this.showHint.bind(this);
    this.stopTouchMove = this.stopTouchMove.bind(this);
    this.toggleHint = this.toggleHint.bind(this);
    this.handleNewlyFocusedViaKeyboard = this.handleNewlyFocusedViaKeyboard.bind(this);
    this.handleTouchCancel = this.handleTouchCancel.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleTouchMoveThrottled = throttle(this.handleTouchMove.bind(this), 30);
    this.handleTouchMoveNotThrottled = this.handleTouchMove.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
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

    // let anchorX;
    // let anchorY;

    // if (this.containerWidth >= this.scaledImageWidth) {
    //   anchorX = x - (this.scaledImageWidth / 2);
    // } else {
    //   anchorX = x - (this.props.containerWidth / 2);
    // }

    // if (this.containerHeight >= this.scaledImageHeight) {
    //   anchorY = y - (this.scaledImageHeight / 2);
    // } else {
    //   anchorY = y - (this.props.containerHeight / 2);
    // }

    // return { anchorX, anchorY };

    return {
      anchorX: x - (this.props.containerWidth / 2),
      anchorY: y - (this.props.containerHeight / 2)
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

    // let originX;
    // let originY;

    // if (this.containerWidth >= this.scaledImageWidth) {
    //   originX = x + (this.scaledImageWidth / 2);
    // } else {
    //   originX = x + (this.props.containerWidth / 2);
    // }

    // if (this.containerHeight >= this.scaledImageHeight) {
    //   originY = y + (this.scaledImageHeight / 2);
    // } else {
    //   originY = y + (this.props.containerHeight / 2);
    // }

    // return { originX, originY };

    return {
      originX: x + (this.props.containerWidth / 2),
      originY: y + (this.props.containerHeight / 2),
    };
  }

  getOriginFromZoomAnchor(x, y) {

    let originX;
    let originY;

    // this point needs to be this many pixels from the container origin to maintain
    // correct percentage
    const fromContainerOriginX = this.props.containerWidth * this.state.zoomAnchorPercentageX;
    const fromContainerOriginY = this.props.containerHeight * this.state.zoomAnchorPercentageY;

    originX = x + fromContainerOriginX;
    originY = y + fromContainerOriginY;

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

    if (this.props.objects.length !== nextProps.objects.length) {
      return true;
    }

    const stateVars = [
      'alreadyFound',
      'canvasX',
      'canvasY',
      'found',
      'gamePlacementX',
      'gamePlacementY',
      'hint',
      'hintActive',
      'isDragging',
      'isPinchZooming',
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
      'isFullscreen',
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
      // this.sightsRef.current is undefined when the image hasn't loaded yet
      if (this.sightsRef.current) {
        this.sightsRef.current.calibrateSights(scaleDiff);
      }

      // new (x, y) coordinates to the center of the canvas' current location
      let newX = this.state.anchorX * scaleDiff;
      let newY = this.state.anchorY * scaleDiff;

      if (this.props.isKeyboardFocused) {
        // use sights as the zoom anchor
        // const containerBounds = this.containerRef.current.getBoundingClientRect();
        const gameBounds = this.gameRef.current.getBoundingClientRect();
        const sightsPosition = this.sightsRef.current.getSightsPosition(scaleDiff);

        // if (this.containerWidth >= this.scaledImageWidth) {
        //   newX = (containerBounds.x - sightsPosition.x) * scaleDiff;
        // } else {
        //   newX = (gameBounds.x - sightsPosition.x) * scaleDiff;
        // }

        // if (this.containerHeight >= this.scaledImageHeight) {
        //   newY = (containerBounds.y - sightsPosition.y) * scaleDiff;
        // } else {
        //   newY = (gameBounds.y - sightsPosition.y) * scaleDiff;
        // }

        newX = (gameBounds.x - sightsPosition.x) * scaleDiff;
        newY = (gameBounds.y - sightsPosition.y) * scaleDiff;
      }

      // translate to coordinates that moveCanvas can use (expects (x, y) to be origin)
      const originCoordinates = this.state.anchorToCenter ?
        this.getOriginFromCenterAnchor(newX, newY) :
        this.getOriginFromZoomAnchor(newX, newY);

      this.moveCanvas(originCoordinates.originX, originCoordinates.originY);
    }
  }

  getGameOffset() {

    let gameOffsetLeft = 0;
    let gameOffsetTop = 0;

    if (this.props.containerWidth > this.scaledImageWidth) {
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
  handleFoundObject(object, x, y) {
    const newlyFound = this.props.onFind(object);
    if (newlyFound) {
      this.showFound(object);
      this.removeHint();
    } else {
      this.showAlreadyFound(object, x, y);
    }
  }

  /**
   * A key was pressed while the game is in focus.
   * @param {event} e 
   */
  handleKeyDown(e) {

    if (e.key === 'Tab' && !this.props.isKeyboardFocused) {
      return this.handleNewlyFocusedViaKeyboard(e);
    }

    if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
      return;
    }

    if (!this.props.isKeyboardFocused) {
      this.handleNewlyFocusedViaKeyboard(e);
    } else {
      this.sightsRef.current.moveSights(e);
    }
  }

  handleNewlyFocusedViaKeyboard(e = false) {

    this.props.onKeyboardFocusChange(true);

    const x = this.state.canvasX > 0 ? 0 : Math.abs(this.state.canvasX);
    const y = this.state.canvasY > 0 ? 0 : Math.abs(this.state.canvasY);

    this.sightsRef.current.moveSightsTo(x, y, e);
  }

  handleMouseUp(e) {
    if (this.state.isDragging) {
      this.setState({ isDragging: false });
      return;
    }

    this.findableRef.current.checkGuess(e.offsetX, e.offsetY);
  }

  handleContainerMouseDown() {
    this.props.onKeyboardFocusChange(false);
  }

  handleMouseDown(e) {

    const { offsetX, offsetY } = getOffsetCoords(e);
    
    this.setState({
      dragStartX: offsetX,
      dragStartY: offsetY,
    });

    const target = e.target;
    target.addEventListener('mousemove', this.handleMouseMoveThrottled);

    window.addEventListener('mouseup', e => {
      this.handleMouseMoveThrottled.cancel();
      target.removeEventListener('mousemove', this.handleMouseMoveThrottled);
      this.handleMouseUp(e);
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
  handleMouseMove(e) {

    const { offsetX, offsetY } = getOffsetCoords(e);
    const diffX = this.state.dragStartX - offsetX;
    const diffY = this.state.dragStartY - offsetY;

    if (this.state.isDragging) {
      const newX = this.state.canvasX - diffX;
      const newY = this.state.canvasY - diffY;
      this.moveCanvas(newX, newY);
    } else if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
      this.setState({ isDragging: true}, () => {
        this.handleMouseMoveNotThrottled(e);
      });
    }
  }

  evaluateTouchMove(e) {

    const numTouches = e.targetTouches.length;

    if (numTouches === 1) {
      // the only 1-touch event we allow is panning (in fullscreen)
      return { isDragging: true };
    }

    let prevTouchEvent = this.state.prevTouchEvent;

    if (!prevTouchEvent) {
      // this should not happen anymore, but if it does, log for further debugging
      logger.log('No previous touch event', { event: e });
      prevTouchEvent = e;
    }

    // going from 1 to 2 touches: prevTouch2 will be undefined.
    // record this as a 1-touch event. next time around, both touches
    // will be present in this.state.prevTouchEvent.
    if (numTouches === 2 && prevTouchEvent.targetTouches.length < 2) {
      return { isDragging: true };
    }

    const prevTouch1 = prevTouchEvent.targetTouches[0];
    const prevTouch2 = prevTouchEvent.targetTouches[1];
    const currentTouch1 = e.targetTouches[0];
    const currentTouch2 = e.targetTouches[1];

    const diffs = [
      Math.abs(prevTouch1.clientX - currentTouch1.clientX),
      Math.abs(prevTouch1.clientY - currentTouch1.clientY),
      Math.abs(prevTouch2.clientX - currentTouch2.clientX),
      Math.abs(prevTouch2.clientY - currentTouch2.clientY),
    ]

    // make sure all the touches have moved more than 1/3 of a pixel before proceeding
    if (Math.max(...diffs) < 0.3) {
      return { dismiss: true };
    }

    // the distance between the two current touches
    const touchDistance = distanceBetweenTouch(e.targetTouches[0], e.targetTouches[1]);

    // how far the touches have moved since the previous touch
    const distanceDiff = this.state.prevTouchDistance ? touchDistance - this.state.prevTouchDistance : 0;

    // direction each touch is moving on the x and y axis
    const touch1DirectionX = prevTouch1.clientX > currentTouch1.clientX ? 'left' : 'right';
    const touch2DirectionX = prevTouch2.clientX > currentTouch2.clientX ? 'left' : 'right';
    const touch1DirectionY = prevTouch1.clientY > currentTouch1.clientY ? 'up' : 'down';
    const touch2DirectionY = prevTouch2.clientY > currentTouch2.clientY ? 'up' : 'down';

    const isDragging = touch1DirectionX === touch2DirectionX && touch1DirectionY === touch2DirectionY;
    const isPinchZooming = touch1DirectionX !== touch2DirectionX || touch1DirectionY !== touch2DirectionY;
    
    return { distanceDiff, isDragging, isPinchZooming, touchDistance };
  }

  handleTouchMove(e) {

    // for embedded game: return unless 2 touches or the browser needs a manual scroll
    const embeddedAllowTouchMove = !this.props.isFullscreen && (e.targetTouches.length === 2 || this.needsManualScroll);

    // for fullscreen game: return if there are more than 2 touches
    const fullscreenAllowTouchMove = this.props.isFullscreen && e.targetTouches.length <= 2;

    if (!embeddedAllowTouchMove && !fullscreenAllowTouchMove) {
      return;
    }

    if (e.cancelable) {
      // prevent the browser default handling of a 2-touch scroll. check first to make
      // sure the event is cancelable, as samsung browser makes touchmove events not
      // cancelable after a second or two (requiring a manual 1-touch scroll).
      e.preventDefault();

    } else if (this.touchMoveFailures < 10) {
      this.touchMoveFailures++;
      if (this.touchMoveFailures === 10) {
        // track any other browsers that do this. note: this also pops up from
        // time-to-time on browsers that do allow touchmove events to be cancelable,
        // but it has always occurred at the proper time, which isn't the case with
        // samsung internet. make sure 10 failures occur before logging.
        logger.log('touchmove event is not cancelable', { event: e });
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

    // now that we know we can proceed with acting on the touchmove event, evaluate the data
    const { dismiss, distanceDiff, isDragging, isPinchZooming, touchDistance } = this.evaluateTouchMove(e);

    if (dismiss) {
      return;
    }

    const newState = { prevTouchEvent: e };

    if (isDragging) {

      newState.prevTouchEventType = 'pan';

      if (this.state.isDragging) {
        // drag gesture already initiated
        newState.prevTouchDistance = touchDistance;
        const newX = this.state.canvasX - diffX;
        const newY = this.state.canvasY - diffY;
        this.moveCanvas(newX, newY);
      } else {
        // initialize the drag gesture
        newState.anchorToCenter = true;
        newState.isDragging = true;
        newState.isPinchZooming = false;
        newState.prevTouchDistance = null;

        if (this.state.prevTouchEventType === 'zoom') {
          // reset dragStart
          newState.dragStartX = offsetX;
          newState.dragStartY = offsetY;
        }

        return this.setState(newState, () => {
          this.handleTouchMoveNotThrottled(e);
        });
      }

    } else if (isPinchZooming) {

      newState.prevTouchEventType = 'zoom';

      if (this.state.isPinchZooming) {
        // pinch gesture already initiated
        newState.prevTouchDistance = touchDistance;
        const zoomAmount = (distanceDiff / 3) / 100;
        const newZoom = this.props.scale + zoomAmount;

        // get center of two touches
        const offsetTouch1 = getOffsetCoords(e, e.targetTouches[0]);
        const offsetTouch2 = getOffsetCoords(e, e.targetTouches[1]);

        const midX = -Math.abs((offsetTouch2.offsetX + offsetTouch1.offsetX) / 2);
        const midY = -Math.abs((offsetTouch2.offsetY + offsetTouch1.offsetY) / 2);

        newState.anchorX = midX;
        newState.anchorY = midY;

        // center of pinch (x, y) coords within the container
        const xWithinContainer = this.state.canvasX - midX;
        const yWithinContainer = this.state.canvasY - midY;

        newState.zoomAnchorPercentageX = xWithinContainer / this.props.containerWidth;
        newState.zoomAnchorPercentageY = yWithinContainer / this.props.containerHeight;

        return this.setState(newState, () => {
          this.props.zoomTo(newZoom * 100);
        });

      } else {
        // initialize the pinch gesture
        newState.anchorToCenter = false;
        newState.isDragging = false;
        newState.isPinchZooming = true;
        newState.prevTouchDistance = null;

        // get center of two touches
        const offsetTouch1 = getOffsetCoords(e, e.targetTouches[0]);
        const offsetTouch2 = getOffsetCoords(e, e.targetTouches[1]);

        const midX = -Math.abs((offsetTouch2.offsetX + offsetTouch1.offsetX) / 2);
        const midY = -Math.abs((offsetTouch2.offsetY + offsetTouch1.offsetY) / 2);

        newState.anchorX = midX;
        newState.anchorY = midY;

        // center of pinch (x, y) coords within the container
        const xWithinContainer = this.state.canvasX - midX;
        const yWithinContainer = this.state.canvasY - midY;

        newState.zoomAnchorPercentageX = xWithinContainer / this.props.containerWidth;
        newState.zoomAnchorPercentageY = yWithinContainer / this.props.containerHeight;

        return this.setState(newState, () => {
          this.handleTouchMoveNotThrottled(e);
        });
      }
    }

    this.setState(newState);
  }

  handleTouchStart(e) {

    const { offsetX, offsetY } = getOffsetCoords(e);

    const newState = {
      dragStartX: offsetX,
      dragStartY: offsetY,
      prevTouchEvent: e,
    }

    if (e.targetTouches.length === 2) {
      newState.prevTouchDistance = distanceBetweenTouch(e.targetTouches[0], e.targetTouches[1]);
    }

    this.setState(newState);

    this.props.onKeyboardFocusChange(false);
  }

  stopTouchMove() {
    this.handleTouchMoveThrottled.cancel();


    // reset center anchor
    const { anchorX, anchorY } = this.getCenterAnchor(this.state.canvasX, this.state.canvasY);

    // reset other state vars
    this.setState({
      anchorToCenter: true,
      anchorX,
      anchorY,
      dragStartX: null,
      dragStartY: null,
      isDragging: false,
      isPinchZooming: false,
      prevTouchDistance: null,
      prevTouchEvent: null,
      prevTouchEventType: null,
    });
  }

  handleTouchEnd(e) {

    if (this.props.isFullscreen && e.touches.length >= 1) {
      // still 1+ touches. do not trigger state change
      return;
    }

    if (!this.props.isFullscreen && e.touches.length >= 2) {
      // still 2 touches. do not trigger state change
      return;
    }

    this.stopTouchMove();
  }

  handleTouchCancel() {
    this.stopTouchMove();
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
      alreadyFound: null,
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
  handleSightsMove(x, y, size, direction) {

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

  /**
   * Gets a random hint, but ensures all objects used as hints
   * before any duplicates can occur
   * @returns Findable  object
   */
  getRandomHint(objects) {

    const availableObjects = objects.filter(object => {
      // not found and not already given as a hint (until all objects are given as a hint)
      return !this.props.found.includes(object.id) && !this.state.hintsGiven.includes(object.id);
    });

    const random = Math.floor(Math.random() * availableObjects.length);

    return availableObjects[random];
  }

  showHint() {

    // extract out 1:many into separate objects
    const objects = []
    Object.values(this.props.objects).forEach(object => {
      if (object.getType() === '1:1') {
        objects.push(object);
      } else {
        objects.push(...object.objects);
      }
    })

    const hint = this.getRandomHint(objects);

    // const hint = notFound[random];
    const coords = hint.hintCoords;
    const hintSize = hint.hintSize;

    const hintOffset = (hintSize * this.props.scale) / 2;
    const newX = coords.x * this.props.scale;
    const newY = coords.y * this.props.scale;

    this.setState(state => {

      const newState = {
        // set the center anchor to be the center of the hint
        // on componentDidUpdate, the new canvas position will be based on that
        anchorX: -Math.abs(newX + hintOffset),
        anchorY: -Math.abs(newY + hintOffset),

        // get the hint in the DOM
        hint,
      }

      let hintsGiven = [...state.hintsGiven]; // handle immutably to prevent bugs
      hintsGiven.push(hint.id);

      // reset hintsGiven, if all objects have been hinted
      const notFound = objects.length - this.props.found.length;
      if (hintsGiven.length === notFound) {
        hintsGiven = [];
      }

      newState.hintsGiven = hintsGiven;

      return newState;

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

      const newState = {};

      // remove found object from hintsGiven, if present
      const hintsGiven = [...state.hintsGiven]; // handle immutably to prevent bugs
      const index = hintsGiven.indexOf(object.id);

      if (index > -1) {
        hintsGiven.splice(index, 1);
        newState.hintsGiven = hintsGiven;
      }

      // add the object to the list of found objects
      const found = [...state.found]; // handle immutably to prevent bugs
      found.push(object);
      newState.found = found;

      return newState;
    });
  }

  showAlreadyFound(object, x, y) {
    // clear out any previous messages
    this.removeAlreadyFound(() => {
      this.setState({ alreadyFound: [object, x, y] }, () => {
        this.alreadyFoundTimeout = setTimeout(() => this.removeAlreadyFound(), settings.alreadyFoundKeepAlive);
      });
    });
  }

  removeAlreadyFound(callback = () => {}) {
    clearTimeout(this.alreadyFoundTimeout);
    this.setState({ alreadyFound: null }, callback);
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
      left: roundToThousandth(this.state.canvasX),
      top: roundToThousandth(this.state.canvasY),
    };

    const gamePlacementStyles = {
      left: `${this.state.gamePlacementX}px`,
      top: `${this.state.gamePlacementY}px`,
    }

    const gameClasses = ['game'];

    if (this.state.isDragging) {
      gameClasses.push('grabbing');
    } else if (!this.state.isPinchZooming) {
      gameStyles.transition = `left ${settings.canvasTransition}, top ${settings.canvasTransition}`;
      gamePlacementStyles.transition = `left ${settings.canvasTransition}, top ${settings.canvasTransition}`;
    }

    return (
      <div
        className="game-container"
        role="region"
        aria-label="Seek and Find"
        style={containerStyles}
        ref={this.containerRef}
        onKeyDown={this.handleKeyDown}
        onMouseDown={this.handleContainerMouseDown}
      >
        <div className="game-placement" style={gamePlacementStyles}>
          <div className={gameClasses.join(' ')} style={gameStyles} ref={this.gameRef}>
            {!this.state.loading &&
              <>
                <Sights
                  ref={this.sightsRef}
                  checkGuess={(x, y) => this.findableRef.current.checkGuess(x, y)}
                  height={this.scaledImageHeight}
                  onSightsMove={this.handleSightsMove}
                  show={this.props.isKeyboardFocused}
                  width={this.scaledImageWidth}
                />
                {this.state.hint &&
                  <Hint
                    height={this.props.imageHeight}
                    width={this.props.imageWidth}
                    object={this.state.hint}
                    scale={this.props.scale}
                    test={this.props.test}
                    isPinchZooming={this.state.isPinchZooming}
                  />
                }
                {this.state.alreadyFound &&
                  <AlreadyFound
                    canvasX={roundToThousandth(this.state.canvasX)}
                    canvasY={roundToThousandth(this.state.canvasY)}
                    containerHeight={this.props.containerHeight}
                    containerWidth={this.props.containerWidth}
                    imageHeight={this.scaledImageHeight}
                    imageWidth={this.scaledImageWidth}
                    alreadyFound={this.state.alreadyFound}
                    scale={this.props.scale}
                  />
                }
                <Found
                  height={this.props.imageHeight}
                  width={this.props.imageWidth}
                  found={this.state.found}
                  scale={this.props.scale}
                  isPinchZooming={this.state.isPinchZooming}
                />
                <Findable
                  disableTabbing={this.props.disableTabbing}
                  onFind={this.handleFoundObject}
                  objects={this.props.objects}
                  ref={this.findableRef}
                  scale={this.props.scale}
                  height={this.props.imageHeight}
                  width={this.props.imageWidth}
                  needsManualScroll={this.needsManualScroll}
                  onMouseDown={this.handleMouseDown}
                  onTouchCancel={this.handleTouchCancel}
                  onTouchStart={this.handleTouchStart}
                  onTouchMove={this.handleTouchMoveThrottled}
                  onTouchEnd={this.handleTouchEnd}
                  isPinchZooming={this.state.isPinchZooming}
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
              isPinchZooming={this.state.isPinchZooming}
            />
          </div>
        </div>
        {!this.state.loading &&
          <div className="utilities" style={containerStyles}>

            <div className="instructions-and-hint">
              <button className="fullscreen" onClick={this.props.toggleFullscreen} tabIndex={this.props.disableTabbing ? '-1' : null}>
                {!this.props.isFullscreen ? <MaximizeIcon tooltip="Enter fullscreen" /> : <MinimizeIcon tooltip="Exit fullscreen" />}
              </button>

              <button className="instructions" onClick={this.props.openInstructions} tabIndex={this.props.disableTabbing ? '-1' : null}>
                <InstructionsIcon tooltip="How to play" />
              </button>

              {((this.props.isBonus && !this.props.bonusComplete) || (!this.props.isBonus && !this.props.gameComplete)) &&
                <button className="hint" onClick={this.toggleHint} tabIndex={this.props.disableTabbing ? '-1' : null}>
                  {this.state.hintActive && <SlashIcon className="slash" aria-hidden="true" />}
                  <LightbulbIcon className="lightbulb" tooltip={!this.state.hintActive ? 'Give me a hint' : 'Remove hint'} />
                </button>
              }

              {((this.props.isBonus && this.props.bonusComplete) || (!this.props.isBonus && this.props.gameComplete)) &&
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
  groups: [],
  scale: 1,
  test: false,
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
  groups: PropTypes.array,
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
  test: PropTypes.bool,
  toggleFullscreen: PropTypes.func.isRequired,
  zoomIn: PropTypes.func.isRequired,
  zoomInLimitReached: PropTypes.bool,
  zoomTo: PropTypes.func.isRequired,
  zoomOut: PropTypes.func.isRequired,
  zoomOutLimitReached: PropTypes.bool,
};

export default Illustration;
