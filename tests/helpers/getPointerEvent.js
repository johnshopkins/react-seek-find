// define class. PointerEvent is undefined in JSDOM
class PointerEvent extends Event {
  constructor(type, props) {
    super(type, props);

    this.pointerId = props?.pointerId || 1;
    this.clientX = props.clientX;
    this.clientY = props.clientY;
  }
}

export default function getPointerEvent(type, values = {}) {
  values = {
    clientX: 0,
    clientY: 0,
    bubbles: true,
    cancelable: true,
    ...values,
  };
  return new PointerEvent(type, values);
}

