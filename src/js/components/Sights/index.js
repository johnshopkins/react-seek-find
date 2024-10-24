import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';

import SightsIcon from '../Icons/Sights';

import './style.scss';

/**
 * Manages the keyboard navigation sights.
 */
export default forwardRef(({ checkGuess, height, onSightsMove, scale, show, width }, ref) => {

  const iconSize = 26;
  const iconOffset = (iconSize / 2) + 2;
  const minX = 0 - iconOffset;
  const maxX = width - iconOffset;
  const minY = 0 - iconOffset;
  const maxY = height - iconOffset;

  const getScaledPosition = useCallback((coordinate) => coordinate * scale, [scale]);
  const getUnscaledPosition = useCallback((coordinate) => coordinate / scale, [scale]);

  // absolute positioning to full size
  // add iconOffset so the full sights are visible at first
  const [positionX, setPositionX] = useState(Math.abs(iconOffset));
  const [positionY, setPositionY] = useState(Math.abs(iconOffset));

  // scaled positioning
  const [scaledPositionX, setScaledPositionX] = useState(getScaledPosition(positionX));
  const [scaledPositionY, setScaledPositionY] = useState(getScaledPosition(positionY));

  // sets the scaled position after positionX or positionY changes
  useEffect(() => {
    setScaledPositionX(getScaledPosition(positionX));
    setScaledPositionY(getScaledPosition(positionY));
  }, [getScaledPosition, positionX, positionY, scale]);

  useImperativeHandle(ref, () => ({
    moveSights: (e) => {

      if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        return;
      }

      e.stopPropagation();
      e.preventDefault();

      const increment = e.shiftKey ? 20 : 2;

      let newPositionX = positionX;
      let newPositionY = positionY;

      let direction;

      if (e.key === ' ') {
        
        // spacebar
        checkGuess(getScaledPosition(positionX + iconOffset), getScaledPosition(positionY + iconOffset));

      } else if (e.key === 'ArrowRight') {

        direction = 'right'

        newPositionX = positionX + increment;
        if (newPositionX > maxX) {
          // console.log('new value is less than maxX');
          newPositionX = maxX;
        }

        setPositionX(newPositionX);

      } else if (e.key === 'ArrowLeft') {

        direction = 'left'

        newPositionX = positionX - increment;
        if (newPositionX < minX) {
          newPositionX = minX;
        }

        setPositionX(newPositionX);

      } else if (e.key === 'ArrowUp') {

        direction = 'up'
        
        let newPositionY = positionY - increment;
        if (newPositionY < minY) {
          newPositionY = minY;
        }

        setPositionY(newPositionY);

      } else if (e.key === 'ArrowDown') {

        direction = 'down'
        
        let newPositionY = positionY + increment;
        if (newPositionY > maxY) {
          newPositionY = maxY;
        }

        setPositionY(newPositionY);
      }

      // pan the background, if necessary
      onSightsMove(
        getScaledPosition(newPositionX + iconOffset),
        getScaledPosition(newPositionY + iconOffset), direction
      );
    },
    moveSightsTo(x, y, alreadyScaled = false) {

      if (alreadyScaled) {
        x = getUnscaledPosition(x)
        y = getUnscaledPosition(y)
      }

      setPositionX(x);
      setPositionY(y);
    }
  }), [checkGuess, getScaledPosition, getUnscaledPosition, iconOffset, maxX, maxY, minX, minY, onSightsMove, positionX, positionY]);

  const style = {
    display: show ? 'block' : 'none',
    left: `${scaledPositionX}px`,
    top: `${scaledPositionY}px`,
    height: `${iconSize}px`,
    width: `${iconSize}px`
  };

  return <SightsIcon className="sights" style={style} />
});
