import React, { useEffect, useRef } from 'react';
import * as settings from '../../../css/utils/shared-variables.scss';
import './style.scss';

export default function Hint({ height, isPinchZooming, object, scale, test, width }) {

  const ref = useRef(null);

  useEffect(() => {
    const context = ref.current.getContext('2d');
    object.hint.call(this, context, width, height);
  }, [height, object, width]);

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
      className="hint"
      height={height}
      width={width}
      style={canvasStyle}
      data-id={test ? object.id : null}
    />
  )

};
