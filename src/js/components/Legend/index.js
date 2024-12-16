import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
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
export default forwardRef(({ breakpoint, found, groups, objects, width }, ref) => {

  const legendRef = useRef(null);
  const [legendWidth, setLegendWidth] = useState(0);
  const [legendPositionX, setLegendPositionX] = useState(0);

  const thumbnailSize = parseInt(settings[`legendThumbnailHeight_${breakpoint}`]);

  useEffect(() => {

    setLegendWidth((
      // thumbnails themselves
      (objects.length * thumbnailSize) +

      // gap between thumbnails
      ((objects.length -1) * parseInt(settings[`legendGap_${breakpoint}`])) +

      // padding around groups
      ((groups.length * 2) * parseInt(settings[`legendPadding_${breakpoint}`]))
    ));

  }, [breakpoint, groups.length, objects.length, thumbnailSize, width]);

  useImperativeHandle(ref, () => ({
    scrollToGroup(group) {
      
      if (legendWidth < width) {
        // scroll not needed
        return;
      }

      const groupElem = legendRef.current.querySelector(`.legend-group.${group}`);
      const legendThumbnails = legendRef.current.querySelector('.thumbnails');
      const legendThumbnailsRect = legendThumbnails.getBoundingClientRect();
      const groupRect = groupElem.getBoundingClientRect();

      setLegendPositionX(-Math.abs(groupRect.x - legendThumbnailsRect.x));

    }
  }), [legendWidth, width]);

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

  return (
    <div className="legend-container" tabIndex="-1" ref={legendRef}>
      {legendWidth > width ?
        <LegendScroll
          breakpoint={breakpoint}
          found={found}
          groups={sorted}
          width={width}
          legendWidth={legendWidth}
          thumbnailSize={thumbnailSize}
          positionX={legendPositionX}
        /> :
        <LegendNoScroll
          found={found}
          groups={sorted}
          width={width}
        />
      }
    </div>
  )
});
