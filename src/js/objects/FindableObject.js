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
      context.fillStyle = 'rgb(255, 255, 255, 50%)';
      context.fill(path);
    }

    // // for testing
    // context.fillStyle = "rgb(0, 0, 0, 50%)";
    // context.fill(path);

    return path;
  }

  hint (context, width, height) {
    context.fillStyle = 'rgb(0, 0, 0, 50%)';
    context.fillRect(0, 0, width, height);
    context.clearRect(this.hintCoords.x, this.hintCoords.y, this.hintSize, this.hintSize);
  }
}

export default FindableObject;
