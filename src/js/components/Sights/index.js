import React from 'react';

import SightsIcon from '../Icons/Sights';

import './style.scss';

export default ({ height, positionX = 0, positionY = 0, width }) => {

  const style = {
    height: `${height}px`,
    left: `${positionX}px`,
    top: `${positionY}px`,
    width: `${width}px`,
  };

  return <SightsIcon style={style} />
}
