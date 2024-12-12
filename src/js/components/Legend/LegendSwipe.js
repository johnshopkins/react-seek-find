import React from 'react';
import ThumbnailGroup from './ThumbnailGroup';

export default function LegendScroll({ found, groups, width }) {
  return (
    <div className="legend-scroll">
      <div className="legend" style={{width: `${width}px`, overflowX: 'auto' }}>
        <div className="thumbnails">
          {Object.values(groups).map((group, i) => <ThumbnailGroup found={found} group={group} key={i} />)}
        </div>
      </div>
    </div>
  )
}
