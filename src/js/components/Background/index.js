import React from 'react';
import './style.scss';

/**
 * The background image
 */
export default function Background({ height, imageSrc, scale, width }) {

  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  return (
    <img
      className="game-background"
      alt="Seek and find"
      src={imageSrc}
      width={scaledWidth}
      height={scaledHeight}
    />
  )

};
