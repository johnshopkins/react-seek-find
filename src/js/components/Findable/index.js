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

    objects.map(object => {
      object.plotted = object.create.call(this, context);
      return object;
    });

  }, [objects]);

  useImperativeHandle(ref, () => ({
    checkGuess: (positionX, positionY) => {

      const context = canvasRef.current.getContext('2d');

      const x = positionX / scale;
      const y = positionY / scale;

      for (const object of objects) {
        if (context.isPointInPath(object.plotted, x, y)) {
          onFind(object);
          break;
        }
      }

    },
    focusCanvas: () => {
      canvasRef.current.focus();
    }
  }), [objects, onFind, scale]);

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
        touchAction: 'none',
        height: `${height * scale}px`,
        width: `${width * scale}px`
      }}
    />
  )

});
