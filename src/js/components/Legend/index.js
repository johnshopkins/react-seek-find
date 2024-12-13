/*global Modernizr*/
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

  // padding around groups - subtract 1 (if not touch events) to not include the padding-right
  // of the last group - the padding around the button takes care of that 
  const paddingAroundGroups = Modernizr.touchevents ? 
    ((groups.length * 2) * parseInt(settings[`legendPadding_${breakpoint}`])) :
    ((groups.length * 2 - 1) * parseInt(settings[`legendPadding_${breakpoint}`]));

  const legendWidth = (
    // thumbnails themselves
    (objects.length * thumbnailSize) +

    // gap between thumbnails
    ((objects.length -1) * parseInt(settings[`legendGap_${breakpoint}`])) +

    paddingAroundGroups
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
