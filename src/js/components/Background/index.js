import React, { useEffect, useRef } from 'react';

import './style.scss';

export default ({ height, imageSrc, width }) => {

  const ref = useRef(null);

  useEffect(() => {

    const context = ref.current.getContext('2d');

    const image = new Image();
    image.src = imageSrc;
    
    image.onload = () => {
      context.globalCompositeOperation = 'destination-over';
      context.drawImage(image, 0, 0, width, height);
      context.globalCompositeOperation = 'source-over';
    };

  });

  return (
    <canvas
      ref={ref}
      className="background"
      height={height}
      width={width}
    />
  )

};
