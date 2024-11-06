import React from 'react';
import FoundCanvas from './canvas';
import './style.scss';

export default function Found({ found, height, scale, width }) {
  return (
    <div className="found-container">
      {found.map((object, i) => 
        <FoundCanvas
          height={height}
          width={width}
          object={object}
          scale={scale}
          key={i}
        />
      )}
    </div>
  )
}
