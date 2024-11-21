class FakeMouseEvent extends MouseEvent {
  constructor(type, values) {
    const { offsetX, offsetY, ...mouseValues } = values;
    super(type, (mouseValues));

    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }
}

export default function getMouseEvent(type, values = {}) {
  values = {
    clientX: 0,
    clientY: 0,
    bubbles: true,
    cancelable: true,
    offsetX: 0,
    offsetY: 0,
    ...values,
  };
  return new FakeMouseEvent(type, values);
}

