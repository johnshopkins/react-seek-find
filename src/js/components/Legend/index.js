import CheckIcon from '../Icons/Check';
import './style.scss';

/**
 * Manages the legend.
 */
export default function Legend({ found, objects }) {
  return (
    <div className="legend-container">
      <div className="legend" role="region" aria-label="Legend">
        {/* {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => {
          return objects.map((object, i) => {
            const classes = ['thumbnail'];
            if (object.found) {
              classes.push('found')
            }

            const status = found.includes(object.id) ? 'found' : 'not found';
            return (
              <div className={classes.join(' ')} key={i}>
                {status === 'found' && <CheckIcon />}
                <img
                  src={object.thumbnail}
                  alt={`Object to find: ${object.alt_text}; Status: ${status}`}
                />
              </div>
            )
          })
        })} */}
        {objects.map((object, i) => {
          const classes = ['thumbnail'];
          if (object.found) {
            classes.push('found')
          }

          const status = found.includes(object.id) ? 'found' : 'not found';
          return (
            <div className={classes.join(' ')} key={i}>
              {status === 'found' && <CheckIcon />}
              <img
                src={object.thumbnail}
                alt={`Object to find: ${object.alt_text}; Status: ${status}`}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
