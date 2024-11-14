import React, { useEffect, useState } from 'react';
import ArrowIcon from '../Icons/Arrow';
import Thumbnails from './Thumbnails';
import * as settings from '../../../css/utils/shared-variables.scss';
import './style.scss';

/**
 * Manages the legend.
 * 
 * Note: for reasons I cannot figure out, the legend container kept getting
 * tabbed to when tabbing was disabled (due to instructions overlay
 * being opened), so I had to specify a tabIndex value to prevent that.
 */
export default function Legend({ breakpoint, found, objects, width }) {

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [direction, setDirection] = useState(null);
  const [positionX, setPositionX] = useState(0);

  const thumbnailSize = parseInt(settings[`legendThumbnailHeight_${breakpoint}`]);

  const buttonWidth = parseInt(settings.utilitiesIconHeight) + (parseInt(settings.buttonPadding) * 2);
  const availableSpace = width - (buttonWidth * 2) - (parseInt(settings[`legendPadding_${breakpoint}`]) * 4);
  const legendWidth = objects.length * thumbnailSize + (objects.length -1) * parseInt(settings[`legendGap_${breakpoint}`]);

  const needsPagination = legendWidth > availableSpace;

  const minPositionX = 0;
  const maxPositionX = -Math.abs(legendWidth - availableSpace);

  useEffect(() => {

    if (!needsPagination) {
      return;
    }

    let intervalId;

    if (isMouseDown) {
      intervalId = setInterval(function () {
        setPositionX((prevPositionX) => {

          const newValue = direction === 'left' ? prevPositionX + thumbnailSize : prevPositionX - thumbnailSize;

          if (direction === 'left' && newValue >= minPositionX) {
            setIsMouseDown(false);
            return minPositionX;
          } else if (direction === 'right' && newValue <= maxPositionX) {
            setIsMouseDown(false);
            return maxPositionX;
          }

          return newValue;
        });
      }, 100);
    }

    return () => clearInterval(intervalId);

  }, [direction, isMouseDown, maxPositionX, needsPagination, thumbnailSize]);

  const handleMouseDown = (direction) => {
    setIsMouseDown(true);
    setDirection(direction);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  }

  return (
    <div className="legend-container" tabIndex="-1">
      <div className="label">Can you find us all? {found.length}/{objects.length}</div>
        <div className="legend-scroll">
          {needsPagination &&
            <button onMouseDown={() => handleMouseDown('left')} onMouseUp={handleMouseUp} disabled={positionX === minPositionX}>
              <ArrowIcon className="left" tooltip="Scroll left" />
            </button>
          }
          <div className="legend" style={{width: `${availableSpace}px` }}>
            <div className="thumbnails" style={{ left: `${positionX}px` }}>
              <Thumbnails
                found={found}
                objects={objects}
              />
            </div>
          </div>
          {needsPagination &&
            <button onMouseDown={() => handleMouseDown('right')} onMouseUp={handleMouseUp} disabled={positionX === maxPositionX}>
              <ArrowIcon className="right" tooltip="Scroll right" />
            </button>
          }
      </div>
    </div>
  )
}
