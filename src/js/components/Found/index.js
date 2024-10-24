import React, { useEffect, useRef } from 'react';
import './style.scss';

/**
 * A canvas that plots and highlights the found object for a time.
 */
export default function Found({ object, height, scale, width }) {

  const ref = useRef(null);
  const classes = useRef(['found']);

  if (object) {
    classes.current.push('show')
  }

  useEffect(() => {

    if (object) {

      const context = ref.current.getContext('2d');

      context.clearRect(0, 0, width, height);
      context.resetTransform();
      context.scale(scale, scale);

      // draw found object
      object.create.call(this, context, true);

      return () => {
        classes.current = ['found']
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
