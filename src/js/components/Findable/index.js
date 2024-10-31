import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import './style.scss';

/**
 * A canvas element that has the findable objects plotted, though
 * not visible to the user. When a user initiates a guess, this canvas
 * is used to validate whether an object was found or not.
 */
export default forwardRef(({
  disableTabbing,
  height,
  objects,
  onFind,
  onMouseDown,
  onTouchStart,
  scale,
  width,
}, ref) => {

  const canvasRef = useRef(null);

  useEffect(() => {
    
    const context = canvasRef.current.getContext('2d');

    context.clearRect(0, 0, width, height);
    context.resetTransform();
    context.scale(scale, scale);

    objects.map(object => {
      object.plotted = object.create.call(this, context);
      return object;
    });

  }, [height, objects, scale, width]);

  useImperativeHandle(ref, () => ({
    checkGuess: (positionX, positionY) => {

      const context = canvasRef.current.getContext('2d');

      for (const object of objects) {
        if (context.isPointInPath(object.plotted, positionX, positionY)) {
          onFind(object);
          break;
        }
      }

    },
    focusCanvas: () => {
      canvasRef.current.focus();
    }
  }), [objects, onFind]);

  return (
    <canvas
      className="findable"
      ref={canvasRef}
      height={height}
      width={width}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      tabIndex={disableTabbing ? '-1' : '0'}
      style={{
        // stops the browser from its scrolling on the element
        touchAction: 'none'
      }}
    />
  )

});
