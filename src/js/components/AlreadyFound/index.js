import React, { useEffect, useRef, useState } from 'react';
import './style.scss';

export default function Found({ alreadyFound, canvasX, canvasY, containerHeight, containerWidth, imageHeight, imageWidth, scale }) {

  const alreadyFoundRef = useRef(null);
  const [className, setClassName] = useState(null);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);

  useEffect(() => {

    const alreadyFoundBounds = alreadyFoundRef.current.getBoundingClientRect();

    // where to plot the message, start with quadrant 4
    let className = 'q4';
    let newPositionX = (alreadyFound[1] * scale);
    let newPositionY = (alreadyFound[2] * scale);

    // make sure there is enough space; otherwise, move the message.
    // condition 1: if the message goes into buffer
    // condition 2: if the message extends outside viewable area (container)

    if ((newPositionX + alreadyFoundBounds.width > imageWidth) || (newPositionX + canvasX + alreadyFoundBounds.width > containerWidth)) {
      className = 'q3';
      newPositionX = newPositionX - alreadyFoundBounds.width;
    }

    if (newPositionY + alreadyFoundBounds.height > imageHeight || (newPositionY + canvasY + alreadyFoundBounds.height > containerHeight)) {
      className = className === 'q4' ? 'q1' : 'q2';
      newPositionY = newPositionY - alreadyFoundBounds.height;
    }

    setClassName(className);
    setPositionX(newPositionX);
    setPositionY(newPositionY);

  }, [alreadyFound, canvasX, canvasY, containerHeight, containerWidth, imageHeight, imageWidth, scale]);

  const style = {
    left: `${positionX}px`,
    top: `${positionY}px`,
  };

  return (
    <div className={`already-found ${className}`} style={style} ref={alreadyFoundRef}>
      You already<br/>found this
    </div>
  );
}
