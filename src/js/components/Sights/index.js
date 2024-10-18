import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import SightsIcon from '../Icons/Sights';

import './style.scss';

export default forwardRef(({ checkGuess, height, scale, show, width }, ref) => {

  const iconSize = 36 * scale;
  const iconOffset = iconSize / 2;
  const minX = 0 - iconOffset;
  const maxX = width - iconOffset;
  const minY = 0 - iconOffset;
  const maxY = height - iconOffset;

  const getScaledPosition = (coordinate) => coordinate * scale;

  // absolute positioning to full size
  const [positionX, setPositionX] = useState(-Math.abs(iconOffset));
  const [positionY, setPositionY] = useState(-Math.abs(iconOffset));

  // // for testing - start on the superman S
  // const [positionX, setPositionX] = useState(138);
  // const [positionY, setPositionY] = useState(48);

  // scaled positioning
  const [scaledPositionX, setScaledPositionX] = useState(getScaledPosition(positionX));
  const [scaledPositionY, setScaledPositionY] = useState(getScaledPosition(positionY));

  useEffect(() => {
    setScaledPositionX(getScaledPosition(positionX));
    setScaledPositionY(getScaledPosition(positionY));
  }, [scale]);

  useImperativeHandle(ref, () => ({
    moveSights: (e) => {

      if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        return;
      }

      e.stopPropagation();
      e.preventDefault();

      const increment = e.shiftKey ? 20 : 2;

      if (e.key === ' ') {
        
        // spacebar
        checkGuess(positionX + iconOffset, positionY + iconOffset);

      } else if (e.key === 'ArrowRight') {

        let newValue = positionX + increment;
        if (newValue > maxX) {
          // console.log('new value is less than maxX');
          newValue = maxX;
        }

        setPositionX(newValue);
        setScaledPositionX(getScaledPosition(newValue));

      } else if (e.key === 'ArrowLeft') {

        let newValue = positionX - increment;
        if (newValue < minX) {
          newValue = minX;
        }

        setPositionX(newValue);
        setScaledPositionX(getScaledPosition(newValue));

      } else if (e.key === 'ArrowUp') {
        
        let newValue = positionY - increment;
        if (newValue < minY) {
          newValue = minY;
        }

        setPositionY(newValue);
        setScaledPositionY(getScaledPosition(newValue));

      } else if (e.key === 'ArrowDown') {
        
        let newValue = positionY + increment;
        if (newValue > maxY) {
          newValue = maxY;
        }

        setPositionY(newValue);
        setScaledPositionY(getScaledPosition(newValue));
      }
    },
    moveSightsTo({ x, y }) {
      setPositionX(getScaledPosition('x', x - iconOffset));
      setPositionY(getScaledPosition('y', y - iconOffset));
    }
  }), [positionX, positionY, scale]);

  const style = {
    display: show ? 'block' : 'none',
    left: `${scaledPositionX}px`,
    top: `${scaledPositionY}px`,
    height: `${iconSize}px`,
    width: `${iconSize}px`
  };

  return <SightsIcon style={style} />
});
