import React, { useEffect, useState } from 'react';
import ArrowIcon from '../Icons/Arrow';
import ThumbnailGroup from './ThumbnailGroup';
import * as settings from '../../../css/utils/shared-variables.scss';
import './style.scss';

/**
 * Manages the legend.
 * 
 * Note: for reasons I cannot figure out, the legend container kept getting
 * tabbed to when tabbing was disabled (due to instructions overlay
 * being opened), so I had to specify a tabIndex value to prevent that.
 */
export default function Legend({ bonusObjects, breakpoint, found, gameComplete, groups, objects, width }) {

  const [isPointerDown, setIsPointerDown] = useState(false);
  const [direction, setDirection] = useState(null);
  const [positionX, setPositionX] = useState(0);

  const thumbnailSize = parseInt(settings[`legendThumbnailHeight_${breakpoint}`]);

  const findableObjects = !gameComplete ? objects : [...bonusObjects, ...objects];

  // sort objects into groups
  const sorted = {};
  groups.forEach(group => {
    sorted[group.id] = {
      objects: [],
      found: 0,
      ...group
    };
  });
  objects.forEach(object => {
    sorted[object.group].objects.push(object);
    if (found.includes(object.id)) {
      sorted[object.group].found++;
    }
  });

  const buttonWidth = parseInt(settings.utilitiesIconHeight) + (parseInt(settings.buttonPadding) * 2);
  const availableSpace = width - (buttonWidth * 2) - (parseInt(settings[`legendPadding_${breakpoint}`]) * 4);
  const legendWidth = findableObjects.length * thumbnailSize + (findableObjects.length -1) * parseInt(settings[`legendGap_${breakpoint}`]);

  const needsPagination = legendWidth > availableSpace;

  const minPositionX = 0;
  const maxPositionX = -Math.abs(legendWidth - availableSpace);

  useEffect(() => {

    if (!needsPagination) {
      return;
    }

    let intervalId;

    if (isPointerDown) {
      intervalId = setInterval(function () {
        setPositionX((prevPositionX) => {

          const newValue = direction === 'left' ? prevPositionX + thumbnailSize : prevPositionX - thumbnailSize;

          if (direction === 'left' && newValue >= minPositionX) {
            setIsPointerDown(false);
            return minPositionX;
          } else if (direction === 'right' && newValue <= maxPositionX) {
            setIsPointerDown(false);
            return maxPositionX;
          }

          return newValue;
        });
      }, 100);
    }

    return () => clearInterval(intervalId);

  }, [direction, isPointerDown, maxPositionX, needsPagination, thumbnailSize]);

  const handlePointerDown = direction => {
    setIsPointerDown(true);
    setDirection(direction);
    window.addEventListener('pointerup', handlePointerUp, { once: true });
  };

  const handlePointerUp = () => {
    setIsPointerDown(false);
  }

  const handleKeyDown = (e, direction) => {
    if (e.key !== 'Enter') {
      return;
    }
    handlePointerDown(direction)
  }

  return (
    <div className="legend-container" tabIndex="-1">
        <div className="legend-scroll">
          {needsPagination &&
            <button
              onKeyDown={(e) => handleKeyDown(e, 'left')}
              onKeyUp={handlePointerUp}
              onPointerDown={e => handlePointerDown('left')}
              onPointerCancel={handlePointerUp}
              disabled={positionX === minPositionX}
            >
              <ArrowIcon className="left" tooltip="Scroll left" />
            </button>
          }
          <div className="legend" style={{width: `${availableSpace}px` }}>
            <div className="thumbnails" style={{ left: `${positionX}px` }}>
              {Object.values(sorted).map((group, i) => {
                return (
                  <ThumbnailGroup
                    found={found}
                    group={group}
                    key={i}
                  />
                )
              })}
            </div>
          </div>
          {needsPagination &&
            <button
              onKeyDown={(e) => handleKeyDown(e, 'right')}
              onKeyUp={handlePointerUp}
              onPointerDown={e => handlePointerDown('right')}
              onPointerCancel={handlePointerUp}
              disabled={positionX === maxPositionX}
            >
              <ArrowIcon className="right" tooltip="Scroll right" />
            </button>
          }
      </div>
    </div>
  )
}
