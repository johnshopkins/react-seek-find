import React, { memo } from 'react';
import ThumbnailGroup from './ThumbnailGroup';

export default memo(function ThumbnailGroups({ found, groups, position = 0, width }) {
  return (
    <div className="legend" style={{width: `${width}px` }}>
      <div className="thumbnails" style={{ left: `${position}px` }}>
        {Object.values(groups).map((group, i) => <ThumbnailGroup found={found} group={group} key={i} />)}
      </div>
    </div>
  )
});
