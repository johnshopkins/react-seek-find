import React, { useState } from 'react';
const throttle = require('lodash.throttle');

import settings from '../../../settings';

import './style.scss';

/**
 * Manages the mini-map utility.
 */
export default ({ breakpoint, canvasX, canvasY, containerHeight, containerWidth, imageHeight, imageWidth, moveCanvas }) => {

  // note: minimap click+drag works only for mouse users...
  // the minimap is too small to be usable for click+drag purposes on mobile.

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragStartY, setDragStartY] = useState(null);

  const miniMapWidth = settings[`miniMap_${breakpoint}`];

  const sizeDown = miniMapWidth / imageWidth;
  const sizeUp = imageWidth/ miniMapWidth;

  const onMouseDown = (e) => {

    setIsMouseDown(true);
    setDragStartX(e.nativeEvent.offsetX);
    setDragStartY(e.nativeEvent.offsetY);

    window.addEventListener('mouseup', e => {
      setIsMouseDown(false);
    }, { once: true });
  }
  
  const onMouseMove = throttle((e) => {

    if (isMouseDown) {

      const diffX = (dragStartX - e.nativeEvent.offsetX);
      const diffY = (dragStartY - e.nativeEvent.offsetY);

      let newX = canvasX + (diffX * sizeUp);
      let newY = canvasY + (diffY * sizeUp);

      moveCanvas(newX, newY);
    }
    
  }, 30);

  const mapHeight = imageHeight * sizeDown
  const mapWidth = miniMapWidth;

  const mapStyle = {
    height: `${mapHeight}px`,
    width: `${mapWidth}px`,
  }

  // subtract 4 to allow space for the border
  const shownHeight = (sizeDown * containerHeight) - 4;
  const shownWidth = (sizeDown * containerWidth) - 4;

  const shownStyle = {
    left: `${Math.abs(canvasX) * sizeDown}px`,
    height: `${shownHeight <= mapHeight ? shownHeight : mapHeight}px`,
    top: `${Math.abs(canvasY) * sizeDown}px`,
    width: `${shownWidth <= mapWidth ? shownWidth : mapWidth}px`,
  }

  return (
    <div className="mini-map" style={mapStyle}>
      <div
        className="shown"
        style={shownStyle}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
      ></div>
    </div>
  )
};
