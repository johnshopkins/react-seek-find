import React, { memo, useEffect, useRef } from 'react';

export default memo(function Found({ object, height, scale, width }) {

  const ref = useRef(null);

  useEffect(() => {

    const context = ref.current.getContext('2d');
    object.create.call(this, context, true);

  }, [object]);

  return (
    <canvas
      ref={ref}
      className="found"
      height={height}
      width={width}
      style={{
        height: `${height * scale}px`,
        width: `${width * scale}px`
      }}
    />
  )

});
