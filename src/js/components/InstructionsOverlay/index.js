/*global Modernizr*/

import React, { useEffect, useRef } from 'react';
import XMarkIcon from '../Icons/Xmark';
import './style.scss';

require('../../lib/modernizr');

/**
 * The instructions overlay
 */
export default function InstructionsOverlay({ isAutoOpen, isOpen, onClose, style }) {

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

  const classes = ['overlay-container']
  if (isOpen) {
    classes.push('open');
  }

  useEffect(() => {

    if (isOpen) {
      // scroll it back to the top
      overlay.current.scroll(0, 0)
    }

    if (isOpen && !isAutoOpen) {
      // focus the close button
      closeButton.current.focus();
    }

  }, [isAutoOpen, isOpen]);

  return (
    <div className={classes.join(' ')} style={style}>
      <div className="overlay" ref={overlay}>
        <button className="close-box-x" aria-label="Close modal" onClick={close} ref={closeButton}>
          <XMarkIcon />
        </button>
        <h1>How to play</h1>
        {Modernizr.touchevents ? 
          <ul>
            <li>To move the image, use two fingers.</li>
            <li>To zoom the image in or out, press the zoom buttons just below the minimap on the right side of the game.</li>
            <li>When you find an object, press on it to confirm. The object will light up for a few seconds if you are correct. The object will also be checked off in the legend.</li>
          </ul>
          : 
          <>
            <h3>Using the mouse</h3>
            <ul>
              <li>To move the image, click and drag on the image. You can also click and drag on red highlighted area in the minimap.</li>
              <li>To zoom the image in or out, click the zoom buttons just below the minimap on the right side of the game.</li>
              <li>When you find an object, press on it to confirm. The object will light up for a few seconds if you are correct. The object will also be checked off in the legend.</li>
            </ul>
            <h3>Using the keyboard</h3>
            <ul>
              <li>Navigate to the game by pressing the Tab key until the game area is active. You will see a magnifying class appear. Use the keyboard's arrow keys to move the magnifying glass around. To move faster, press Shift + arrow keys.</li>
              <li>As you move the magnifying glass, the image will automatically pan as you get close to the edge.</li>
              <li>To zoom the image in or out, press Tab until either the zoom in or zoom out button is in focus. Press Return or Enter to press the button to zoom in or out.</li>
              <li>When you find an object, line up the crosshairs within the magnifying glass on the object and press the Spacebar. The object will light up for a few seconds if you are correct. The object will also be checked off in the legend.</li>
            </ul>
          </>
        }
        
        <h2>Need some help?</h2>
        <ul>
          <li>To ask for a hint, click on the lightbulb icon. An area of the image will light up where an object is, but only for 10 seconds.</li>
          <li>To read these instructions again, press the book icon.</li>
        </ul>
        
        <button className="ready" onClick={close}>
          I'm ready to play!
        </button>
      </div>
    </div>
  )
}
