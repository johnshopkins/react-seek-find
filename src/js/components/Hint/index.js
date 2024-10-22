import React, { useEffect, useRef } from 'react';

import './style.scss';

export default ({ height, object, scale, width }) => {

  const ref = useRef(null);
  let classes = ['hint'];
  if (object) {
    classes.push('show')
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
        classes = ['hint']
      };
    }

  }, [object, scale]);

  return (
    <canvas
      ref={ref}
      className={classes.join(' ')}
      height={height}
      width={width}
    />
  )

};
