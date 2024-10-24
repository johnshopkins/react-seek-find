class FindableObject {
  /**
   * Create a findable object
   * @param {*} id             Unique name
   * @param {*} alt_text       Legend label
   * @param {*} thumbnail      Thumbnail URL
   * @param {*} createFunction Function that creates the path
   * @param {*} hintCoords     Top-left coordinate of hint area { x: 123, y: 123 }
   */
  constructor(id, alt_text, thumbnail, createFunction = () => {}, hintCoords = {}) {
    this.id = id;
    this.alt_text = alt_text;
    this.thumbnail = thumbnail;
    this.createFunction = createFunction;
    this.hintCoords = hintCoords;
    this.hintSize = 746;

    this.create = this.create.bind(this);
    this.hint = this.hint.bind(this);
  }

  create (context, fill = false) {

    const path = this.createFunction();

    if (fill) {
      context.fillStyle = "rgb(255, 255, 255, 50%)";
      context.fill(path);
    }

    // // for testing
    // context.fillStyle = "rgb(0, 0, 0, 50%)";
    // context.fill(path);

    return path;
  }

  hint (context, width, height) {

    let path = new Path2D();

    context.fillStyle = "rgb(0, 0, 0, 50%)";

    path.moveTo(0, 0);
    path.lineTo(0, height);
    path.lineTo(width, height);
    path.lineTo(width, 0);
    path.lineTo(0, 0);
    path.closePath();

    // add hint area
    const hintStart = this.hintCoords;

    const bottom = hintStart.x + this.hintSize;
    const right = hintStart.y + this.hintSize;

    path.moveTo(hintStart.x, hintStart.y);
    path.lineTo(bottom, hintStart.y);
    path.lineTo(bottom, right);
    path.lineTo(hintStart.x, right);
    path.lineTo(hintStart.x, hintStart.y);
    path.closePath();

    context.fill(path);
  }
}

export default FindableObject;
