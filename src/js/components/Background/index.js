import React from 'react';

import './style.scss';

/**
 * The background image
 */
export default ({ height, imageSrc, scale, width }) => {

  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  return <img className="game-background" src={imageSrc} width={scaledWidth} height={scaledHeight} />

};
