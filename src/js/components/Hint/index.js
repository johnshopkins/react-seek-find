import React, { useEffect, useRef } from 'react';

import './style.scss';

export default ({ height, object, onShowHint, width }) => {

  const ref = useRef(null);
  let classes = ['hint'];
  if (object) {
    classes.push('show')
  }

  useEffect(() => {

    if (object) {
      const context = ref.current.getContext('2d');
      // clear canvas
      context.clearRect(0, 0, width, height);

      // draw hint
      const hintStart = object.hint.call(this, context, width, height);

      // move keyboard navigation to the hint area
      onShowHint(hintStart);

      return () => {
        classes = ['hint']
      };
    }

  }, [object]);

  return (
    <canvas
      ref={ref}
      className={classes.join(' ')}
      height={height}
      width={width}
    />
  )

};
