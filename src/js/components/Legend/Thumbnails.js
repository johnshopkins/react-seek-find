import React, { memo } from 'react';
import CheckIcon from '../Icons/Check';

export default memo(function Thumbnails({found, objects }) {
  return (
    <>
    {objects.map((object, i) => {
      const status = found.includes(object.id) ? 'found' : 'not found';
      return (
        <div className="thumbnail" key={i}>
          {status === 'found' && <CheckIcon tooltip="Found" aria-hidden="true" />}
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
