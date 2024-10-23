import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import './style.scss';

/**
 * A canvas element that has the findable objects plotted, though
 * not visible to the user. When a user initiates a guess, this canvas
 * is used to validate whether an object was found or not.
 */
export default forwardRef(({
  height,
  objects,
  onFind,
  onMouseDown,
  onTouchStart,
  scale,
  showTouchInstruction,
  touchInstructionStyle,
  width,
}, ref) => {

  const canvasRef = useRef(null);

  let plottedObjects = [];

  useEffect(() => {
    
    const context = canvasRef.current.getContext('2d');

    context.clearRect(0, 0, width, height);
    context.resetTransform();
    context.scale(scale, scale);

    plottedObjects = objects.map(object => {
      object.plotted = object.create.call(this, context);
      return object;
    });

  }, [objects, scale]);

  useImperativeHandle(ref, () => ({
    checkGuess: (positionX, positionY) => {

      const context = canvasRef.current.getContext('2d');

      for (const object of objects) {
        if (context.isPointInPath(object.plotted, positionX, positionY)) {
          onFind(object);
          break;
        }
      }

    }
  }), []);

  const touchevents = Modernizr.touchevents;

  return (
    <>
      {touchevents && showTouchInstruction &&
        <div className="touch-instructions show" style={{
          pointerEvents: 'none',
          ...touchInstructionStyle,
        }}>
          <p>Use two fingers to move the image.</p>
        </div>
      }
      <canvas
        className="findable"
        ref={canvasRef}
        height={height}
        width={width}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        tabIndex="0"
        style={{
          // stops the browser from its scrolling on the element
          touchAction: 'none'
        }}
      />
    </>
  )

});
