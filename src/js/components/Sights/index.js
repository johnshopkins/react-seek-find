/*global dataLayer*/
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import MagnifyingGlassIcon from '../Icons/MagnifyingGlass';
import * as settings from '../../../css/utils/shared-variables.scss';
import './style.scss';

/**
 * Manages the keyboard navigation sights.
 */
export default forwardRef(({ checkGuess, height, onSightsMove, show, width }, ref) => {

  const sightsRef = useRef(null);

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
  const [useTransition, setUseTransition] = useState(false);

  useImperativeHandle(ref, () => ({
    moveSights: (e) => {

      if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        return;
      }

      e.stopPropagation();
      e.preventDefault();

      setUseTransition(false);

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
      setUseTransition(false);
      setPositionX(x);
      setPositionY(y);
    },
    calibrateSights(scaleDiff) {

      setUseTransition(true);

      // get position of crosshairs
      const x = positionX + iconOffsetLeft;
      const y = positionY + iconOffsetTop;

      // where the crosshairs are on the newly scale image
      const newX = x * scaleDiff;
      const newY = y * scaleDiff;

      // add offset back
      setPositionX(newX - iconOffsetLeft);
      setPositionY(newY - iconOffsetTop);
    },
    getSightsPosition() {
      const bounds = sightsRef.current.getBoundingClientRect();
      return {
        x: bounds.x + iconOffsetLeft,
        y: bounds.y + iconOffsetTop,
      };
    }
  }), [checkGuess, iconOffsetLeft, iconOffsetTop, maxX, maxY, minX, minY, onSightsMove, positionX, positionY]);

  const containerStyle = {
    display: show ? 'block' : 'none',
    left: `${positionX}px`,
    top: `${positionY}px`,
  };

  const iconStyle = {
    height: `${iconSize}px`,
    width: `${iconSize}px`
  }

  if (useTransition) {
    containerStyle.transition = `all ${settings.canvasTransition}`;
  }

  return (
    <div className="sights" ref={sightsRef} style={containerStyle} >
      <MagnifyingGlassIcon className="magnifying-glass" style={iconStyle} />
    </div>
  )
});
