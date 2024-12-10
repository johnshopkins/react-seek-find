import React, { memo } from 'react';
import CheckIcon from '../Icons/Check';
import CircleIcon from '../Icons/Circle';

export default memo(function Thumbnails({ found, objects }) {
  return (
    <>
    {objects.map((object, i) => {

      const type = object.getType();
      let leftToFind = 0;
      let status = 'not found';

      if (type === 'single') {
        status = found.includes(object.id) ? 'found' : 'not found';
      } else {
        // group
        const toFind = object.objects.map(o => o.id);
        const numFound = found.filter(value => toFind.includes(value)).length;
        const numToFindLength = toFind.length

        status = numFound === numToFindLength ? 'found' : `${numFound}/${numToFindLength} found`;

        if (numFound !== numToFindLength) {
          leftToFind = numToFindLength - numFound;
        }

      }
      
      return (
        <div className="thumbnail" key={i}>
          {status === 'found' && 
          <div className="badge found">
            <CheckIcon tooltip="Found" aria-hidden="true" />
          </div>
          }
          {leftToFind > 0 &&
            <div className="badge not-found">
              <span>{leftToFind}</span>
              <CircleIcon tooltip={`${leftToFind} left to find`} />
            </div>
          }
          <img
            src={object.thumbnail}
            alt={`Object to find: ${object.alt_text}; Status: ${status}`}
          />
        </div>
      )
    })}
    </>
  )
});
