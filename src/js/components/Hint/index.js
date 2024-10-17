import React, { useEffect, useRef } from 'react';

import './style.scss';

export default ({ height, object, onShowHint, scale, width }) => {

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
      const hintStart = object.hint.call(this, context, width, height);

      // move keyboard navigation to the hint area
      onShowHint(hintStart);

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
