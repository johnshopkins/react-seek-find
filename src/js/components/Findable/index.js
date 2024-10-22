import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import './style.scss';

export default forwardRef(({
  found,
  height,
  objects,
  onBlur,
  onFind,
  onFocus,
  onKeyDown,
  onMouseDown,
  onTouchStart,
  scale,
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
      object.plotted = object.create.call(this, context, found.includes(object.id));
      return object;
    });

  }, [found, objects, scale]);

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

  return (
    <canvas
      className="findable"
      ref={canvasRef}
      height={height}
      width={width}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      tabIndex="0"
      style={{
        // stops the browser from its scrolling on the element
        touchAction: 'none'
      }}
    />
  )

});
