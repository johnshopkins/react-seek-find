import React, { useEffect, useRef, useState } from 'react';
import './style.scss';

export default function Found({ alreadyFound, canvasX, canvasY, containerHeight, containerWidth, imageHeight, imageWidth, scale }) {

  const alreadyFoundRef = useRef(null);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);

  useEffect(() => {

    const alreadyFoundBounds = alreadyFoundRef.current.getBoundingClientRect();

    // where to plot the message (top, left anchored to click))
    let newPositionX = (alreadyFound[1] * scale);
    let newPositionY = (alreadyFound[2] * scale);

    // make sure there is enough space; otherwise, move the message.
    // condition 1: if the message goes into buffer
    // condition 2: if the message extends outside viewable area (container)

    if ((newPositionX + alreadyFoundBounds.width > imageWidth) || (newPositionX + canvasX + alreadyFoundBounds.width > containerWidth)) {
      // anchor right to click
      newPositionX = newPositionX - alreadyFoundBounds.width;
    }

    if (newPositionY + alreadyFoundBounds.height > imageHeight || (newPositionY + canvasY + alreadyFoundBounds.height > containerHeight)) {
      // anchor bottom to click
      newPositionY = newPositionY - alreadyFoundBounds.height;
    }

    setPositionX(newPositionX);
    setPositionY(newPositionY);

  }, [alreadyFound, canvasX, canvasY, containerHeight, containerWidth, imageHeight, imageWidth, scale]);

  const style = {
    left: `${positionX}px`,
    top: `${positionY}px`,
  };

  return <div className="already-found" style={style} ref={alreadyFoundRef}>You already found this</div>;
}
