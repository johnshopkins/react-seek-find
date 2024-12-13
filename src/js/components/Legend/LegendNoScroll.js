import React from 'react';
import ThumbnailGroups from './ThumbnailGroups';

export default function LegendNoScroll({ found, groups, width }) {
  return (
    <div className="legend-scroll">
      <ThumbnailGroups
        found={found}
        groups={groups}
        width={width}
      />
    </div>
  )
}
