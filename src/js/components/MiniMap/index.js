import React, { useState } from 'react';
import getOffsetCoords from '../../lib/get-offset-coords';
import roundToThousandth from '../../lib/roundToThousandth';
import settings from '../../../settings';
import './style.scss';

const throttle = require('lodash.throttle');

/**
 * Manages the mini-map utility.
 */
export default function MiniMap({ canvasX, canvasY, containerHeight, containerWidth, imageHeight, imageWidth, moveCanvas }) {

  // note: minimap click+drag works only for mouse users...
  // the minimap is too small to be usable for click+drag purposes on mobile.

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragStartY, setDragStartY] = useState(null);

  const miniMapSize = settings.miniMap - 8;

  const sizeDown = miniMapSize / imageWidth;
  const sizeUp = imageWidth / miniMapSize;

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
  const mapWidth = miniMapSize;

  const mapStyle = {
    height: `${mapHeight}px`,
    width: `${mapWidth}px`,
  }

  const shownHeight = roundToThousandth(Math.min(sizeDown * containerHeight, mapHeight));
  const shownWidth = roundToThousandth(Math.min(sizeDown * containerWidth, mapWidth));

  // adjustments for CSS absolute positioning
  const left = canvasX <= 0 ? roundToThousandth(Math.min(Math.abs(canvasX * sizeDown), mapWidth - shownWidth)) : 0;
  const top = canvasY <= 0 ? roundToThousandth(Math.min(Math.abs(canvasY * sizeDown), mapHeight - shownHeight)) : 0;

  const shownStyle = {
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
