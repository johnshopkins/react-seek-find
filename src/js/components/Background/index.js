import React, { useEffect, useRef } from 'react';

import './style.scss';

export default ({ height, imageSrc, scale, width }) => {

  const ref = useRef(null);

  useEffect(() => {

    const context = ref.current.getContext('2d');

    context.clearRect(0, 0, width, height);
    context.resetTransform();
    context.scale(scale, scale);

    const image = new Image();
    image.src = imageSrc;
    
    image.onload = () => {
      context.globalCompositeOperation = 'destination-over';
      context.drawImage(image, 0, 0, width, height);
      context.globalCompositeOperation = 'source-over';
    };

  }, [scale]);

  return (
    <canvas
      ref={ref}
      className="background"
      height={height}
      width={width}
    />
  )

};
