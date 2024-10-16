import CheckIcon from './check';

import './style.scss';

export default ({ objects }) => {
  return (
    <div className="legend" role="region" aria-label="Legend">
      {objects.map((object, i) => {
        const classes = ['thumbnail'];
        if (object.found) {
          classes.push('found')
        }

        const status = object.found ? 'found' : 'not found';
        return (
          <div className={classes.join(' ')} key={i}>
            {object.found && <CheckIcon />}
            <img src={object.thumbnail} alt={`Image to find: ${object.alt_text}; Status: ${status}`} />
          </div>
        )
      })}
    </div>
  )
}
