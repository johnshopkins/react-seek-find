/*global Modernizr*/
import React from 'react';
import LegendScroll from './LegendScroll';
import LegendSwipe from './LegendSwipe';
import * as settings from '../../../css/utils/shared-variables.scss';
import './style.scss';

require('../../lib/modernizr');

/**
 * Manages the legend.
 * 
 * Note: for reasons I cannot figure out, the legend container kept getting
 * tabbed to when tabbing was disabled (due to instructions overlay
 * being opened), so I had to specify a tabIndex value to prevent that.
 */
export default function Legend({ breakpoint, found, groups, objects, width }) {

  const isTouchDevice = Modernizr.touchevents;

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

  const buttonWidth = parseInt(settings.utilitiesIconHeight) + (parseInt(settings.buttonPadding) * 2);
  const availableSpace = width - (buttonWidth * 2) - (parseInt(settings[`legendPadding_${breakpoint}`]) * 4);
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
      {/* {isTouchDevice ? */}
        <LegendSwipe
          width={width}
          found={found}
          groups={sorted}
        /> :
        {/* <LegendScroll
          availableSpace={availableSpace}
          found={found}
          groups={sorted}
          legendWidth={legendWidth}
          thumbnailSize={thumbnailSize}
        />
      } */}
    </div>
  )
}
