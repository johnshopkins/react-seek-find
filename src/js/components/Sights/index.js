import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

import SightsIcon from '../Icons/Sights';

import './style.scss';

/**
 * Manages the keyboard navigation sights.
 */
export default forwardRef(({ checkGuess, height, onSightsMove, scale, show, width }, ref) => {

  const iconSize = 170;

  // where the sights are located from the top-left
  const iconOffsetLeft = 67;
  const iconOffsetTop = 67;

  const minX = 0 - iconOffsetLeft;
  const maxX = width - iconOffsetLeft;
  const minY = 0 - iconOffsetTop;
  const maxY = height - iconOffsetTop;

  const getScaledPosition = useCallback((coordinate) => coordinate * scale, [scale]);
  const getUnscaledPosition = useCallback((coordinate) => coordinate / scale, [scale]);

  const [positionX, setPositionX] = useState(-Math.abs(iconOffsetLeft));
  const [positionY, setPositionY] = useState(-Math.abs(iconOffsetTop));

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

        checkGuess(positionX + iconOffsetLeft, positionY + iconOffsetTop);

      } else if (e.key === 'ArrowRight') {

        direction = 'right'

        newPositionX = positionX + increment;
        if (newPositionX > maxX) {
          newPositionX = maxX;
        }

        setPositionX(newPositionX);

      } else if (e.key === 'ArrowLeft') {

        direction = 'left'

        newPositionX = positionX - increment;
        console.log('x', newPositionX, minX);

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
      // if going up, we need to be aware of where the TOP of the icon is
      // if going down, we need to be aware of where the BOTTOM of the icon is
      onSightsMove(
        getScaledPosition(newPositionX + (iconSize + iconOffsetLeft)), // where the left side of the icon is
        getScaledPosition(newPositionY + (iconSize + iconOffsetTop)), // where the bottom of the icon is
        direction
      );
    },
    moveSightsTo(x, y, alreadyScaled = false, addIconOffset = true) {

      if (alreadyScaled) {
        x = getUnscaledPosition(x)
        y = getUnscaledPosition(y)
      }

      if (addIconOffset) {
        x = x + iconOffsetLeft;
        y = y + iconOffsetTop;
      }

      setPositionX(x);
      setPositionY(y);
    }
  }), [checkGuess, getScaledPosition, getUnscaledPosition, iconOffsetLeft, iconOffsetTop, maxX, maxY, minX, minY, onSightsMove, positionX, positionY]);

  const style = {
    display: show ? 'block' : 'none',
    left: `${positionX}px`,
    top: `${positionY}px`,
    height: `${iconSize}px`,
    width: `${iconSize}px`
  };

  return <SightsIcon className="sights" style={style} />
});
