import MiniMap from '../MiniMap';
import QuestionIcon from '../Icons/Question';
import ZoomInIcon from '../Icons/ZoomIn';
import ZoomOutIcon from '../Icons/ZoomOut';

import './style.scss';

export default ({ gameStyles, hintActive, showHint, zoomIn, zoomOut }) => 
  <div className="utilities" style={gameStyles}>

    <button className="hint" disabled={hintActive} onClick={showHint}>
      <QuestionIcon tooltip="Give me a hint" />
    </button>

    <div className="navigation">
      
      <MiniMap
      
      />
      
      <button onClick={zoomIn}>
        <ZoomInIcon tooltip="Zoom in" />
      </button>

      <button onClick={zoomOut}>
        <ZoomOutIcon tooltip="Zoom out" />
      </button>
    </div>

  </div>
