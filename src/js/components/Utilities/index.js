import LightbulbIcon from '../Icons/Lightbulb';
import ZoomInIcon from '../Icons/ZoomIn';
import ZoomOutIcon from '../Icons/ZoomOut';
import MaximizeIcon from '../Icons/Maximize';
import MinimizeIcon from '../Icons/Minimize';

import './style.scss';

export default ({ enterFullScreen, exitFullScreen, hintActive, mode, scale, showHint, zoomIn, zoomOut }) => {

  return (
    <div className="utilities">

      <button disabled={hintActive} onClick={showHint}>
        <LightbulbIcon tooltip="Give me a hint" />
      </button>

      <button onClick={zoomIn}>
        <ZoomInIcon tooltip="Zoom in" />
      </button>

      <button onClick={zoomOut}>
        <ZoomOutIcon tooltip="Zoom out" />
      </button>

      {mode === 'normal' && scale < 1 &&
        <button onClick={enterFullScreen}>
          <MaximizeIcon tooltip="Enter full screen" />
        </button>
      }

      {mode === 'fullscreen' &&
        <button onClick={exitFullScreen}>
          <MinimizeIcon tooltip="Exit full screen" />
        </button>
      }

    </div>
  )
}
