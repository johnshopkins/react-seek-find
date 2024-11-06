import React, { memo, useEffect, useRef } from 'react';

export default memo(function Found({ object, height, scale, width }) {

  const ref = useRef(null);
  const classes = useRef(['found']);

  useEffect(() => {

    const context = ref.current.getContext('2d');

    context.clearRect(0, 0, width, height);
    context.resetTransform();
    context.scale(scale, scale);

    // draw found object
    object.create.call(this, context, true);

  }, [classes, height, object, scale, width]);

  return (
    <canvas
      ref={ref}
      className={classes.current.join(' ')}
      height={height}
      width={width}
    />
  )

});
