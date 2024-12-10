import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as settings from '../../../css/utils/shared-variables.scss';
import './style.scss';

/**
 * A canvas element that has the findable objects plotted, though
 * not visible to the user. When a user initiates a guess, this canvas
 * is used to validate whether an object was found or not.
 */
export default forwardRef(({
  disableTabbing,
  height,
  isPinchZooming,
  needsManualScroll,
  objects,
  onFind,
  onMouseDown,
  onTouchCancel,
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
      if (object.getType() === 'single') {
        object.plotted = object.create.call(this, context);
      } else {
        // group
        object.objects.map(childObject => {
          childObject.plotted = childObject.create.call(this, context);
          return childObject;
        });
      }
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
    canvas.addEventListener('touchcancel', onTouchCancel);

    return () => {
      canvas.removeEventListener('touchmove', onTouchMove, { passive: false });
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('toucheancel', onTouchCancel);
    }

  }, [onTouchCancel, onTouchEnd, onTouchMove]);

  useImperativeHandle(ref, () => ({
    checkGuess: (positionX, positionY) => {

      const context = canvasRef.current.getContext('2d');

      const x = positionX / scale;
      const y = positionY / scale;

      for (const object of objects) {

        let found = false;
        
        if (object.getType() === 'single') {
          if (context.isPointInPath(object.plotted, x, y)) {
            onFind(object, x, y);
            found = true
          }
        } else {
          // group
          for (const childObject of object.objects) {
            if (context.isPointInPath(childObject.plotted, x, y)) {
              onFind(childObject, x, y);
              found = true;
              break;
            }
          }
        }

        if (found) {
          break;
        }
      }
    }
  }), [objects, onFind, scale]);

  const canvasStyle = {
    touchAction: !needsManualScroll ? 'pan-y' : 'none',
    height: `${height * scale}px`,
    width: `${width * scale}px`
  }

  if (!isPinchZooming) {
    canvasStyle.transition = `height ${settings.canvasTransition}, width ${settings.canvasTransition}`;
  }

  return (
    <canvas
      className="findable"
      ref={canvasRef}
      height={height}
      width={width}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      tabIndex={disableTabbing ? '-1' : '0'}
      style={canvasStyle}
    />
  )

});
