import React, { Children } from 'react';
import './style.scss';

export default function Container({ children, className, style, tooltip, viewBox = '0 0 512 512' }) {

  const classes = ['jhu-icon']
  if (className) {
    classes.push(className);
  }

  return (
    <svg className={classes.join(' ')} xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} style={style}>
      {tooltip && <title>{tooltip}</title>}
      {Children.map(children, child => <>{child}</>)}
    </svg>
  )
}
