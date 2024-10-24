import React, { useEffect, useRef } from 'react';
import './style.scss';

export default function Hint({ height, object, scale, width }) {

  const ref = useRef(null);
  const classes = useRef(['hint']);
  
  if (object) {
    classes.current.push('show')
  }

  useEffect(() => {

    if (object) {
      const context = ref.current.getContext('2d');

      context.clearRect(0, 0, width, height);
      context.resetTransform();
      context.scale(scale, scale);

      // draw hint
      object.hint.call(this, context, width, height);

      return () => {
        classes.current = ['hint']
      };
    }

  }, [height, object, scale, width]);

  return (
    <canvas
      ref={ref}
      className={classes.current.join(' ')}
      height={height}
      width={width}
    />
  )

};
