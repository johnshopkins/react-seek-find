import React, { useEffect, useState } from 'react';
import Hint from '../Hint';
import Sights from '../Sights';

import './style.scss';

export default ({ height, hint, imageSrc, objects, reference, width, onFind }) => {

  console.log('canvas render', hint);

  const [context, setContext] = useState(null);
  const [isClick, setIsClick] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const iconSize = 36;
  const iconOffset = iconSize / 2;
  const minX = 0 - iconOffset;
  const maxX = width - iconOffset;
  const minY = 0 - iconOffset;
  const maxY = height - iconOffset;

  const [sightsX, setSightsX] = useState(-Math.abs(iconOffset));
  const [sightsY, setSightsY] = useState(-Math.abs(iconOffset));

  useEffect(() => {

    const context = reference.current.getContext('2d');
    setContext(context);

    const image = new Image();
    image.src = imageSrc;
    
    image.onload = () => {
      context.globalCompositeOperation = 'destination-over';
      context.drawImage(image, 0, 0, width, height);
      context.globalCompositeOperation = 'source-over';
    };

    // plot findable objects
    objects = objects.map(object => {
      object.plotted = object.create.call(this, context, object.found);
      return object;
    })

  }, [objects]);

  const onMouseUp = e => {
    checkGuess(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  }

  const checkGuess = (positionX, positionY) => {
    objects.forEach(object => {
      if (context.isPointInPath(object.plotted, positionX, positionY)) {
        onFind(object);
      }
    });
  }
  
  if (hint) {
    console.log('move sights to top left of hint area');
  }

  const onKeyDown = e => {

    e.stopPropagation();
    
    setIsClick(false);

    console.log(e);

    if (isFocused) {

      if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        return;
      }

      e.preventDefault();

      const increment = e.shiftKey ? 20 : 2;

      if (e.key === ' ') {
        
        // spacebar
        checkGuess(sightsX + iconOffset, sightsY + iconOffset);

      } else if (e.key === 'ArrowRight') {

        let newValue = sightsX + increment;
        if (newValue > maxX) {
          newValue = maxX;
        }
        setSightsX(newValue);

      } else if (e.key === 'ArrowLeft') {

        let newValue = sightsX - increment;
        if (newValue < minX) {
          newValue = minX;
        }
        setSightsX(newValue);

      } else if (e.key === 'ArrowUp') {
        
        let newValue = sightsY - increment;
        if (newValue < minY) {
          newValue = minY;
        }
        setSightsY(newValue);

      } else if (e.key === 'ArrowDown') {
        
        let newValue = sightsY + increment;
        if (newValue > maxY) {
          newValue = maxY;
        }
        setSightsY(newValue);

      }
    }
  }

  const onFocus = e => {
    console.log('isClick', isClick);
    if (!isClick) {
      // activate keyboard navigation
      console.log('keyboard activated');
      setIsFocused(true);
    } else {
      console.log('keyboard deactivated');
      setIsFocused(false);
    }
  }

  const onBlur = e => {
    setIsFocused(false);
  }

  const moveSights = ({ x, y }) => {

    console.log('move sights', x, y, typeof x);
    setSightsX(x - iconOffset);
    setSightsY(y - iconOffset);
  }

  const styles = {
    height: `${height}px`,
    width: `${width}px`,
  };

  return (
    <div className="game" style={styles} role="region" aria-label="Seek and Find">
      <Sights
        activated={isFocused}
        reference={reference}
        positionX={sightsX}
        positionY={sightsY}
        height={iconSize}
        width={iconSize}
      />
      <Hint
        height={height}
        width={width}
        object={hint}
        onShowHint={moveSights}
      />
      <canvas
        aria-label="Seek and Find image"
        role="region"
        ref={reference}
        height={height}
        width={width}
        onFocus={onFocus}
        onMouseUp={onMouseUp}
        onKeyDown={onKeyDown}
        onMouseDown={() => {
          console.log('set clicked');
          setIsClick(true)
        }}
        onBlur={onBlur}
        tabIndex="0" // makes keyboard focusable
      />
    </div>
  );

};
