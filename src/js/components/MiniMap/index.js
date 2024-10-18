
import settings from '../../../settings';

import './style.scss';

export default ({ canvasX, canvasY, containerHeight, containerWidth, imageHeight, imageWidth }) => {

  const sizeDown = settings.miniMap / imageWidth;

  const mapStyle = {
    height: `${imageHeight * sizeDown}px`,
    width: `${settings.miniMap}px`,
  }

  const shownStyle = {
    left: `${Math.abs(canvasX) * sizeDown}px`,
    height: `${sizeDown * containerHeight}px`,
    top: `${Math.abs(canvasY) * sizeDown}px`,
    width: `${sizeDown * containerWidth}px`,
  }

  return (
    <div className="mini-map" style={mapStyle}>
      <div className="shown" style={shownStyle}></div>
    </div>
  )
};
