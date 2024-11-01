export default function getMouseEvent(type, values = {}) {
  values = {
    clientX: 0,
    clientY: 0,
    bubbles: true,
    cancelable: true,
    ...values,
  };
  return new MouseEvent(type, values);
}

