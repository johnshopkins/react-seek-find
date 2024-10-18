
import settings from '../../../settings';

import './style.scss';

export default ({ canvasX, canvasY, containerHeight, containerWidth, imageHeight, imageWidth }) => {

  const sizeDown = settings.miniMap / imageWidth;

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
      <div className="shown" style={shownStyle}></div>
    </div>
  )
};
