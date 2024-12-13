import React from 'react';
import LegendNoScroll from './LegendNoScroll';
import LegendScroll from './LegendScroll';
import * as settings from '../../../css/utils/shared-variables.scss';
import './style.scss';

/**
 * Manages the legend.
 * 
 * Note: for reasons I cannot figure out, the legend container kept getting
 * tabbed to when tabbing was disabled (due to instructions overlay
 * being opened), so I had to specify a tabIndex value to prevent that.
 */
export default function Legend({ breakpoint, found, groups, objects, width }) {

  const thumbnailSize = parseInt(settings[`legendThumbnailHeight_${breakpoint}`]);

  // sort objects into groups
  const sorted = {};
  groups.forEach(group => {
    sorted[group.id] = {
      objects: [],
      found: 0,
      ...group
    };
  });
  
  objects.forEach(object => {

    sorted[object.group].objects.push(object);

    if (object.getType() === '1:1') {

      if (found.includes(object.id)) {
        sorted[object.group].found++;
      }
    } else {
      object.objects.forEach(o => {
        if (found.includes(o.id)) {
          sorted[object.group].found++;
        }
      })
    }
  });

  const legendWidth = (
    // thumbnails themselves
    (objects.length * thumbnailSize) +

    // gap between thumbnails
    ((objects.length -1) * parseInt(settings[`legendGap_${breakpoint}`])) +

    // padding around groups - subtract 1 to not include the padding-right of the last group
    ((groups.length * 2 - 1) * parseInt(settings[`legendPadding_${breakpoint}`]))
  );

  return (
    <div className="legend-container" tabIndex="-1">
      {legendWidth > width ?
        <LegendScroll
          breakpoint={breakpoint}
          found={found}
          groups={sorted}
          width={width}
          legendWidth={legendWidth}
          thumbnailSize={thumbnailSize}
        /> :
        <LegendNoScroll
          found={found}
          groups={sorted}
          width={width}
        />
      }
    </div>
  )
}
