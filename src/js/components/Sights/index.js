import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import SightsIcon from '../Icons/Sights';

import './style.scss';

export default forwardRef(({ height, positionX = 0, positionY = 0, width }, ref) => {

  // const [sightsX, setSightsX] = useState(-Math.abs(iconOffset));

  // useImperativeHandle(ref, () => ({
  //   doSomething: (e) => {
  //     console.log('test', e.key);
  //   }
  // }), []);

  const style = {
    height: `${height}px`,
    left: `${positionX}px`,
    top: `${positionY}px`,
    width: `${width}px`,
  };

  return <SightsIcon style={style} />
});
