import React, { useEffect, useRef } from 'react';

import './style.scss';

export default ({ object, height, scale, width }) => {

  const ref = useRef(null);
  let classes = ['found'];
  if (object) {
    classes.push('show')
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
        classes = ['found']
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
