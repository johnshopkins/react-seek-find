import React, { useEffect, useState } from 'react';
import ArrowIcon from '../Icons/Arrow';
import ThumbnailGroups from './ThumbnailGroups';
import * as settings from '../../../css/utils/shared-variables.scss';

export default function LegendScroll({ breakpoint, found, groups, legendWidth, thumbnailSize, width }) {

  const [isPointerDown, setIsPointerDown] = useState(false);
  const [direction, setDirection] = useState(null);
  const [positionX, setPositionX] = useState(0);

  const buttonWidth = parseInt(settings.utilitiesIconHeight) + (parseInt(settings.buttonPadding) * 2);
  const availableSpace = width - (buttonWidth * 2) - (parseInt(settings[`legendPadding_${breakpoint}`]) * 4);

  const minPositionX = 0;
  const maxPositionX = -Math.abs(legendWidth - availableSpace);

  if (positionX < maxPositionX) {
    // on screen resize
    setPositionX(maxPositionX);
  }

  useEffect(() => {

    let intervalId;

    const scroll = () => {
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
    }

    if (isPointerDown) {
      scroll();
      intervalId = setInterval(scroll, 100);
    }

    return () => clearInterval(intervalId);

  }, [direction, isPointerDown, maxPositionX, thumbnailSize]);

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

  const scrollLeftDisabled = positionX === minPositionX;
  const scrollRightDisabled = positionX === maxPositionX;

  return (
    <div className="legend-scroll">
      <button
        onKeyDown={(e) => handleKeyDown(e, 'left')}
        onKeyUp={handlePointerUp}
        onPointerDown={e => {
          if (!scrollLeftDisabled) {
            handlePointerDown('left')
          }
        }}
        onPointerCancel={handlePointerUp}
        disabled={scrollLeftDisabled}
      >
        <ArrowIcon className="left" tooltip="Scroll left" />
      </button>
      <ThumbnailGroups
        found={found}
        groups={groups}
        position={positionX}
        width={availableSpace}
      />
      <button
        onKeyDown={(e) => handleKeyDown(e, 'right')}
        onKeyUp={handlePointerUp}
        onPointerDown={e => {
          if (!scrollRightDisabled) {
            handlePointerDown('right')
          }
        }}
        onPointerCancel={handlePointerUp}
        disabled={scrollRightDisabled}
      >
        <ArrowIcon className="right" tooltip="Scroll right" />
      </button>
    </div>
  )
}
