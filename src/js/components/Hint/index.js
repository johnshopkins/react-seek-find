import React, { useEffect, useRef } from 'react';
import './style.scss';

export default function Hint({ height, object, scale, width }) {

  const ref = useRef(null);

  useEffect(() => {

    if (object) {
      const context = ref.current.getContext('2d');
      object.hint.call(this, context, width, height);
    }

  }, [height, object, width]);

  return (
    <canvas
      ref={ref}
      className="hint"
      height={height}
      width={width}
      style={{
        height: `${height * scale}px`,
        width: `${width * scale}px`
      }}
    />
  )

};
