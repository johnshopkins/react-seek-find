import React, { useState } from 'react';

import settings from '../../../settings';

import './style.scss';

export default ({ canvasX, canvasY, containerHeight, containerWidth, imageHeight, imageWidth, moveCanvas }) => {

  // note: minimap click+drag works only for mouse users...
  // the minimap is too small to be usable for click+drag purposes on mobile.

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragStartY, setDragStartY] = useState(null);

  const sizeDown = settings.miniMap / imageWidth;
  const sizeUp = imageWidth/ settings.miniMap;

  const onMouseDown = (e) => {

    setIsMouseDown(true);
    setDragStartX(e.nativeEvent.offsetX);
    setDragStartY(e.nativeEvent.offsetY);

    window.addEventListener('mouseup', e => {
      setIsMouseDown(false);
    }, { once: true });
  }

  const onMouseMove = (e) => {

    if (isMouseDown) {

      const diffX = (dragStartX - e.nativeEvent.offsetX);
      const diffY = (dragStartY - e.nativeEvent.offsetY);

      let newX = canvasX + (diffX * sizeUp);
      let newY = canvasY + (diffY * sizeUp);

      moveCanvas(newX, newY);
    }
    
  }

  const mapHeight = imageHeight * sizeDown
  const mapWidth = settings.miniMap;

  const mapStyle = {
    height: `${mapHeight}px`,
    width: `${mapWidth}px`,
  }

  const shownHeight = sizeDown * containerHeight;
  const shownWidth = sizeDown * containerWidth;

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
