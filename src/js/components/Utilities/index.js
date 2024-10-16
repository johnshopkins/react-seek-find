import LightbulbIcon from '../Icons/Lightbulb';

import './style.scss';

export default ({ hintActive, showHint }) => {

  return (
    <div className="utilties">
      <button
        disabled={hintActive}
        onClick={showHint}
      >
        <LightbulbIcon label="Give me a hint" />
      </button>
    </div>
  )

}
