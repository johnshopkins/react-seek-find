import React from 'react';
import Modal from '@jenwachter/react-accessible-modal';

import './style.scss';

/**
 * The instructions modal
 */
export default ({ isOpen, onClose }) => {

  console.log('instructions', isOpen, onClose);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
    <h1>How to play</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget augue non nisi congue rutrum et in ligula. Cras nulla elit, sagittis a efficitur sed, pulvinar a mauris. Etiam ut placerat justo. Suspendisse fermentum mi fermentum diam bibendum dapibus. Nam nec felis ut leo hendrerit malesuada. Aliquam semper rhoncus odio, id ultrices nisl aliquet sit amet. Vivamus congue ante nunc, sit amet posuere turpis posuere sed.</p>
    <p>Sed at sapien ligula. Phasellus tincidunt, sapien ut rhoncus aliquet, augue mi scelerisque purus, in luctus orci turpis in erat. Integer sed nisi sit amet eros rhoncus vehicula. Praesent consectetur augue eu risus luctus, vel sodales felis lacinia. Quisque viverra, massa vitae imperdiet sagittis, leo elit consectetur enim, in facilisis massa velit nec est. Sed aliquet id arcu placerat molestie. Quisque et fermentum felis, eu scelerisque felis. Ut semper aliquam erat, ut condimentum neque placerat quis. Duis nulla massa, tempus a nulla non, placerat venenatis justo. Vestibulum lobortis semper felis quis luctus. Quisque magna sapien, viverra at nibh ut, ullamcorper vestibulum velit. Duis rhoncus eros sed nisl porttitor varius. Curabitur lectus velit, eleifend eget aliquam vel, rhoncus vitae lectus.</p>
  </Modal>
  )
}
