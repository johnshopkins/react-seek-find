/*global dataLayer*/
import React, { forwardRef, useImperativeHandle, useState } from 'react';

import MagnifyingGlassIcon from '../Icons/MagnifyingGlass';

import './style.scss';

/**
 * Manages the keyboard navigation sights.
 */
export default forwardRef(({ checkGuess, height, onSightsMove, show, width }, ref) => {

  const iconSize = 128;

  // where the sights are located from the top-left of icon SVG
  const iconOffsetLeft = 50;
  const iconOffsetTop = 50;

  const minX = 0 - iconOffsetLeft;
  const minY = 0 - iconOffsetTop;
  const maxX = width - iconOffsetLeft;
  const maxY = height - iconOffsetTop;

  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);

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

        dataLayer.push({
          event: 'keyboard_interaction',
          type: 'guess_submitted',
        });

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

        if (newPositionX < minX) {
          newPositionX = minX;
        }

        setPositionX(newPositionX);

      } else if (e.key === 'ArrowUp') {

        direction = 'up'
        
        newPositionY = positionY - increment;
        if (newPositionY < minY) {
          newPositionY = minY;
        }

        setPositionY(newPositionY);

      } else if (e.key === 'ArrowDown') {

        direction = 'down'
        
        newPositionY = positionY + increment;
        if (newPositionY > maxY) {
          newPositionY = maxY;
        }

        setPositionY(newPositionY);
      }

      // pan the background, if necessary
      onSightsMove(newPositionX, newPositionY, iconSize, direction);
    },
    moveSightsTo(x, y) {
      setPositionX(x);
      setPositionY(y);
    },
    resetSights() {
      setPositionX(0);
      setPositionY(0);
    }
  }), [checkGuess, iconOffsetLeft, iconOffsetTop, maxX, maxY, minX, minY, onSightsMove, positionX, positionY]);

  const style = {
    display: show ? 'block' : 'none',
    left: `${positionX}px`,
    top: `${positionY}px`,
    height: `${iconSize}px`,
    width: `${iconSize}px`
  };

  return <MagnifyingGlassIcon className="magnifying-glass" style={style} />
});
