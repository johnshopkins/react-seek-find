class FakeTouch {
  constructor(values = {}) {
    this.clientX = values.clientX || 0;
    this.clientY = values.clientY || 0;
    this.offsetX = values.offsetX || 0;
    this.offsetY = values.offsetY || 0;
  }
}

export default function getTouchEvent(type, values = {}) {

  const targetTouches = values.targetTouches || [];
  const touches = targetTouches.map(v => new FakeTouch(v));

  values = {
    bubbles: true,
    cancelable: true,
    targetTouches: touches,
    changedTouches: touches,
    ...values,
  };

  return new TouchEvent(type, values);
}

