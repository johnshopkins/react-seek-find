export default function getOffsetCoords(e) {

  const bounds = e.target.getBoundingClientRect();
  const targetEvent = typeof e.targetTouches === 'undefined' ? e : e.targetTouches[0];

  return {
    offsetX: targetEvent.clientX - bounds.x,
    offsetY: targetEvent.clientY - bounds.y,
  }
}
