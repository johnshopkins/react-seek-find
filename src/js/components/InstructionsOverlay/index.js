/*global Modernizr*/

import React, { useEffect, useRef } from 'react';
import XMarkIcon from '../Icons/Xmark';
import './style.scss';

require('../../lib/modernizr');

/**
 * The instructions overlay
 */
export default function InstructionsOverlay({ breakpoint, isAutoOpen, onClose, style }) {

  const overlay = useRef(null);
  const closeButton = useRef(null);

  // what had focus before the overlay was opened
  const focused = document.activeElement;

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
          {!isAutoOpen &&
            <button className="close" aria-label="Close instructions" onClick={close} ref={closeButton}>
              <XMarkIcon />
            </button>
          }
          <h1>How to play</h1>
        </div>
        <div className="overlay-content">
          {Modernizr.touchevents ? 
            <ul>
              <li>To move the image, use two fingers.</li>
              <li>When you find an object, click on it. It will light up if you are correct.</li>
            </ul>
            : 
            <>
              <h3>Using a mouse?</h3>
              <ul>
                <li>To move the image, click and drag on the image.</li>
                <li>When you find an object, click on it. It will light up if you are correct.</li>
              </ul>
              <h3>Using a keyboard?</h3>
              <ul>
                <li>Navigate to the game by pressing the Tab key until the game area is active. You will see a magnifying class appear. Use the keyboard's arrow keys to move the magnifying glass around. To move faster, press Shift + arrow keys.</li>
                <li>When you find an object, line up the crosshairs within the magnifying glass on the object and press the Spacebar. It will light up if you are correct.</li>
              </ul>
            </>
          }
          <h2>Need some help?</h2>
          <ul>
            <li>To ask for a hint, click on the lightbulb icon. An area of the image will light up where an object is, but only for 10 seconds.</li>
            <li>To read these instructions again, press the book icon.</li>
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
