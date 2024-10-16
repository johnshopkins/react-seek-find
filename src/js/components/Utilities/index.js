import LightbulbIcon from '../Icons/Lightbulb';
import ZoomInIcon from '../Icons/ZoomIn';
import ZoomOutIcon from '../Icons/ZoomOut';

import './style.scss';

export default ({ hintActive, showHint, zoomIn, zoomOut }) => {

  return (
    <div className="utilities">

      <button disabled={hintActive} onClick={showHint}>
        <LightbulbIcon tooltip="Give me a hint" />
      </button>

      <button onClick={zoomIn}>
        <ZoomInIcon />
      </button>

      <button onClick={zoomOut}>
        <ZoomOutIcon />
      </button>

    </div>
  )

}
