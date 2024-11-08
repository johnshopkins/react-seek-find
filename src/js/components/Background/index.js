import React, { useState } from 'react';
import LoadingIcon from '../Icons/Loading'
import roundToThousandth from '../../lib/roundToThousandth';
import './style.scss';

/**
 * The background image
 */
export default function Background({ containerHeight, containerWidth, height, imageSrc, onReady, scale, width }) {

  const [isLoading, setIsLoading] = useState(true);

  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  // const scaledWidth = roundToThousandth(width * scale);
  // const scaledHeight = roundToThousandth(height * scale);

  const loadingIconSize = 30;

  const loadingStyle = {
    height: `${loadingIconSize}px`,
    left: (containerWidth / 2) - (loadingIconSize / 2),
    top: (containerHeight / 2) - (loadingIconSize / 2),
    width: `${loadingIconSize}px`,
  }

  return (
    <>
      {isLoading && <LoadingIcon className="loading" style={loadingStyle} tooltip="Loading" />}
      <img
        className="game-background"
        alt="Seek and find"
        src={imageSrc}
        width={scaledWidth}
        height={scaledHeight}
        style={{ display: isLoading ? 'none' : 'block' }}
        onLoad={() => {
          onReady();
          setIsLoading(false);
        }}
      />
    </>
  )

};
