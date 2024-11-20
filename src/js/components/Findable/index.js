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
  needsManualScroll,
  objects,
  onFind,
  onMouseDown,
  onTouchEnd,
  onTouchStart,
  onTouchMove,
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

  useEffect(() => {

    const canvas = canvasRef.current;

    // this event must be listened for at all times (not just after onTouchStart)
    // to ensure it is being listened for actively (instead of passively, which is the
    // default for many mobile browsers). Allows e.preventDefault() to run within
    // touchmove callback, which we need to facilitate both 1- (use browser default) 
    // and 2-touch events (use our callback)
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);

    return () => {
      canvas.removeEventListener('touchmove', onTouchMove, { passive: false });
      canvas.removeEventListener('touchend', onTouchEnd);
    }

  }, [onTouchEnd, onTouchMove]);

  useImperativeHandle(ref, () => ({
    checkGuess: (positionX, positionY) => {

      const context = canvasRef.current.getContext('2d');

      const x = positionX / scale;
      const y = positionY / scale;

      for (const object of objects) {
        if (context.isPointInPath(object.plotted, x, y)) {
          onFind(object, x, y);
          break;
        }
      }

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
        touchAction: !needsManualScroll ? 'pan-y' : 'none',
        height: `${height * scale}px`,
        width: `${width * scale}px`
      }}
    />
  )

});
