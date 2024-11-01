import React, { useState } from 'react';
import getOffsetCoords from '../../lib/get-offset-coords';
import settings from '../../../settings';
import './style.scss';

const throttle = require('lodash.throttle');

/**
 * Manages the mini-map utility.
 */
export default function MiniMap({ canvasX, canvasY, containerHeight, containerWidth, emToPixel, imageHeight, imageWidth, moveCanvas }) {

  // note: minimap click+drag works only for mouse users...
  // the minimap is too small to be usable for click+drag purposes on mobile.

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragStartY, setDragStartY] = useState(null);

  const miniMapWidth = settings.miniMap * emToPixel;

  const sizeDown = miniMapWidth / imageWidth;
  const sizeUp = imageWidth/ miniMapWidth;

  const onMouseDown = (e) => {

    setIsMouseDown(true);

    const { offsetX, offsetY } = getOffsetCoords(e);

    setDragStartX(offsetX);
    setDragStartY(offsetY);

    window.addEventListener('mouseup', e => {
      onMouseMove.cancel();
      setIsMouseDown(false);
      setIsDragging(false);
    }, { once: true });
  }
  
  const onMouseMove = throttle((e) => {

    if (isMouseDown) {

      setIsDragging(true);

      const { offsetX, offsetY } = getOffsetCoords(e);

      const diffX = (dragStartX - offsetX);
      const diffY = (dragStartY - offsetY);

      let newX = canvasX + (diffX * sizeUp);
      let newY = canvasY + (diffY * sizeUp);

      moveCanvas(newX, newY);
    }
    
  }, 15); // set to 15 to keep up with mousemove in a smaller space

  const mapHeight = imageHeight * sizeDown
  const mapWidth = miniMapWidth;

  const mapStyle = {
    height: `${mapHeight}px`,
    width: `${mapWidth}px`,
  }

  const shownHeight = (sizeDown * containerHeight);
  const shownWidth = (sizeDown * containerWidth);

  // adjustments for CSS absolute positioning
  let left = Math.abs(canvasX * sizeDown);
  if (canvasX > 0) {
    left = -Math.abs(left);
  }

  let top = Math.abs(canvasY * sizeDown);
  if (canvasY > 0) {
    top = -Math.abs(top);
  }

  // border offset for absolute positioning
  left = left - 2;
  top = top - 2;

  const cursor = isDragging ? 'grabbing' : 'grab';

  const shownStyle = {
    cursor: cursor,
    left: `${left}px`,
    height: `${shownHeight}px`,
    top: `${top}px`,
    width: `${shownWidth}px`,
  }

  return (
    <div
      className="mini-map"
      style={mapStyle}
      // enables clicks within minimap to still register as focused within game container
      tabIndex="-1"
    >
      <div
        className="shown"
        style={shownStyle}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
      ></div>
    </div>
  )
};
