import React, { memo, useEffect, useRef } from 'react';
import * as settings from '../../../css/utils/shared-variables.scss';

export default memo(function Found({ isPinchZooming, object, height, scale, width }) {

  const ref = useRef(null);

  useEffect(() => {

    const context = ref.current.getContext('2d');
    object.create.call(this, context, true);

  }, [object]);

  const canvasStyle = {
    height: `${height * scale}px`,
    width: `${width * scale}px`
  };

  if (!isPinchZooming) {
    canvasStyle.transition = `height ${settings.canvasTransition}, width ${settings.canvasTransition}`;
  }

  return (
    <canvas
      ref={ref}
      className="found"
      height={height}
      width={width}
      style={canvasStyle}
    />
  )

});
