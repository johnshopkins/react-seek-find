import React, { useEffect, useState, useRef } from 'react';
import Hint from '../Hint';
import Sights from '../Sights';

import './style.scss';

export default ({ height, hint, imageSrc, objects, width, onFind }) => {

  // testing click+drag to pan image within smaller container
  const containerWidth = 300;
  const containerHeight = 500;

  // const containerWidth = width;
  // const containerHeight = height;

  // canvas
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [isClick, setIsClick] = useState(null);
  const [isKeyboardFocused, setIsKeyboardFocused] = useState(false);

  const iconSize = 36;
  const iconOffset = iconSize / 2;
  const minX = 0 - iconOffset;
  const maxX = width - iconOffset;
  const minY = 0 - iconOffset;
  const maxY = height - iconOffset;

  const [sightsX, setSightsX] = useState(-Math.abs(iconOffset));
  const [sightsY, setSightsY] = useState(-Math.abs(iconOffset));

  const [canvasX, setCanvasX] = useState(0);
  const [canvasY, setCanvasY] = useState(0);

  const [mouseDown, setMouseDown] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(false);
  const [dragStartY, setDragStartY] = useState(false);

  useEffect(() => {

    window.addEventListener('mouseup', e => {
      setDragging(false)
      setMouseDown(false);
    });

    const context = canvasRef.current.getContext('2d');
    setContext(context);

    const image = new Image();
    image.src = imageSrc;
    
    image.onload = () => {
      context.globalCompositeOperation = 'destination-over';
      context.drawImage(image, 0, 0, width, height);
      context.globalCompositeOperation = 'source-over';
    };

    // plot findable objects
    objects = objects.map(object => {
      object.plotted = object.create.call(this, context, object.found);
      return object;
    })

  }, [objects]);

  const onMouseUp = e => {

    if (dragging) {
      setDragging(false);
      return;
    }

    checkGuess(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  }

  const checkGuess = (positionX, positionY) => {
    objects.forEach(object => {
      if (context.isPointInPath(object.plotted, positionX, positionY)) {
        onFind(object);
      }
    });
  }

  const onKeyDown = e => {

    e.stopPropagation();
    
    setIsClick(false);

    if (isKeyboardFocused) {

      if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        return;
      }

      e.preventDefault();

      const increment = e.shiftKey ? 20 : 2;

      if (e.key === ' ') {
        
        // spacebar
        checkGuess(sightsX + iconOffset, sightsY + iconOffset);

      } else if (e.key === 'ArrowRight') {

        let newValue = sightsX + increment;
        if (newValue > maxX) {
          newValue = maxX;
        }
        setSightsX(newValue);

      } else if (e.key === 'ArrowLeft') {

        let newValue = sightsX - increment;
        if (newValue < minX) {
          newValue = minX;
        }
        setSightsX(newValue);

      } else if (e.key === 'ArrowUp') {
        
        let newValue = sightsY - increment;
        if (newValue < minY) {
          newValue = minY;
        }
        setSightsY(newValue);

      } else if (e.key === 'ArrowDown') {
        
        let newValue = sightsY + increment;
        if (newValue > maxY) {
          newValue = maxY;
        }
        setSightsY(newValue);

      }
    }
  }

  const onFocus = e => {
    setIsKeyboardFocused(!isClick);
  }

  const onBlur = e => {
    setIsKeyboardFocused(false);
  }

  const moveSights = ({ x, y }) => {

    // console.log('move sights', x, y, typeof x);
    setSightsX(x - iconOffset);
    setSightsY(y - iconOffset);
  }

  const onMouseDown = e => {

    // https://javascript.info/mouse-drag-and-drop

    setMouseDown(true);
    setIsClick(true)

    setDragStartX(e.nativeEvent.offsetX)
    setDragStartY(e.nativeEvent.offsetY);
  }

  const onMouseMove = e => {

    if (mouseDown) {
      setDragging(true);
    }

    if (!dragging) {
      return;
    }

    const diffX = dragStartX - e.nativeEvent.offsetX;
    const diffY = dragStartY - e.nativeEvent.offsetY;

    // set min/max drag values

    let newX = canvasX - diffX;
    let newY = canvasY - diffY;
    
    if (newX > 0) {
      newX = 0
    } else if (newX < -Math.abs(width - containerWidth)) {
      newX = -Math.abs(width - containerWidth);
    }

    if (newY > 0) {
      newY = 0
    } else if (newY < -Math.abs(height - containerHeight)) {
      newY = -Math.abs(height - containerHeight);
    }

    setCanvasX(newX);
    setCanvasY(newY);

  }

  const containerStyles = {
    height: `${containerHeight}px`,
    width: `${containerWidth}px`,
  };

  const styles = {
    height: `${height}px`,
    width: `${width}px`,
    left: canvasX,
    top: canvasY,
  };

  if (dragging) {
    styles.cursor = 'grabbing';
  }

  return (
    <div className="game-container" role="region" aria-label="Seek and Find" style={containerStyles}>
      <div
        className="game"
        style={styles}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onDragStart={() => false}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        tabIndex="0" // makes keyboard focusable
      >
        <Sights
          activated={isKeyboardFocused}
          reference={reference}
          positionX={sightsX}
          positionY={sightsY}
          height={iconSize}
          width={iconSize}
        />
        <Hint
          height={height}
          width={width}
          object={hint}
          onShowHint={moveSights}
        />
        <canvas
          aria-label="Seek and Find image"
          role="region"
          ref={canvasRef}
          height={height}
          width={width}
        />
      </div>
    </div>
  );

};
