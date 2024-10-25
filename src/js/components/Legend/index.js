import CheckIcon from '../Icons/Check';
import './style.scss';

/**
 * Manages the legend.
 * For reasons I cannot figure out, the legend container kept getting
 * tabbed to when tabbing was disable (due to instructions overlay
 * being opened), so I had to specify a tabIndex value to prevent that.
 */
export default function Legend({ found, objects }) {
  return (
    <div className="legend-container" tabIndex="-1">
      <div className="legend">
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
