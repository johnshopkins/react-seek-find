export default function gettOffsetCoords(e, touch = false) {
  const bounds = e.target.getBoundingClientRect();
  const target = !touch ? e : e.targetTouches[0];

  return {
    offsetX: target.clientX - bounds.x,
    offsetY: target.clientY - bounds.y,
  }
}
