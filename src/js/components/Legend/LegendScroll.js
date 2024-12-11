import React, { useEffect, useState } from 'react';
import ArrowIcon from '../Icons/Arrow';
import ThumbnailGroup from './ThumbnailGroup';
import './style.scss';

export default function LegendScroll({ availableSpace, found, groups, legendWidth, thumbnailSize }) {

  const [isPointerDown, setIsPointerDown] = useState(false);
  const [direction, setDirection] = useState(null);
  const [positionX, setPositionX] = useState(0);

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

  const scrollLeftDisabled = positionX === minPositionX;
  const scrollRightDisabled = positionX === maxPositionX;

  return (
      <div className="legend-scroll">
        {needsPagination &&
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
        }
        <div className="legend" style={{width: `${availableSpace}px` }}>
          <div className="thumbnails" style={{ left: `${positionX}px` }}>
            {Object.values(groups).map((group, i) => <ThumbnailGroup found={found} group={group} key={i} />)}
          </div>
        </div>
        {needsPagination &&
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
        }
    </div>
  )
}
