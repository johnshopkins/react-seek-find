import React from 'react';

import './style.scss';

export default ({ height, imageSrc, scale, width }) => {

  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  return <img src={imageSrc} width={scaledWidth} height={scaledHeight} />

};
