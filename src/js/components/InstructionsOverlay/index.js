/*global Modernizr*/

import React, { useEffect, useRef, useState } from 'react';
import XMarkIcon from '../Icons/Xmark';
import './style.scss';

require('../../lib/modernizr');

/**
 * The instructions overlay
 */
export default function InstructionsOverlay({ breakpoint, isAutoOpen, onClose, style }) {

  const [focused] = useState(document.activeElement);
  const overlay = useRef(null);
  const closeButton = useRef(null);

  const close = () => {
    
    // put focus back on right element
    focused.focus();

    // close the overlay
    onClose();
  }

  useEffect(() => {

    overlay.current.scroll(0, 0)

    if (!isAutoOpen) {
      // focus the close button
      closeButton.current.focus();
    }

  }, [isAutoOpen]);

  return (
    <div className={`overlay-container ${breakpoint}`} style={style}>
      <div className="overlay" ref={overlay}>
        <div className="overlay-header">
          {/* {!isAutoOpen && */}
            <button className="close" aria-label="Close instructions" onClick={close} ref={closeButton}>
              <XMarkIcon />
            </button>
          {/* } */}
          <h1>Discover the hidden items</h1>
        </div>
        <div className="overlay-content">
          {Modernizr.touchevents ? 
            <ul>
              <li>Use two fingers to move the image.</li>
              <li>Found a hidden object? Click it; it will light up if you are correct.</li>
            </ul>
            : 
            <>
              <h3>Using a mouse?</h3>
              <ul>
                <li>Click and drag to move the image.</li>
                <li>Found a hidden object? Click it; it will light up if you are correct. </li>
              </ul>
              <h3>Using a keyboard?</h3>
              <ul>
                <li>Press the Tab key until the game area is active, then use the arrow keys to move the magnifying glass. To move faster, press Shift + arrow keys.</li>
                <li>Found a hidden object? Center the magnifying glass on the object and press the Spacebar; it will light up if you are correct.</li>
              </ul>
            </>
          }
          <h2>Need some help?</h2>
          <ul>
            <li>Click on the lightbulb icon to temporarily highlight an area of the image that contains an unfound hidden object.</li>
            <li>Press the book icon to read these instructions again.</li>
          </ul>
        </div>
        <div className="overlay-footer">
          <button className="ready" onClick={close}>
            I'm ready to play!
          </button>
        </div>
      </div>
    </div>
  )
}
