import { Children } from 'react';

export default ({ children, className, style, tooltip, viewBox = '0 0 512 512' }) =>
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} style={style}>
    {tooltip && <title>{tooltip}</title>}
    {Children.map(children, child => <>{child}</>)}
  </svg>
