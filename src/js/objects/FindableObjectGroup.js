class FindableObjectGroup {
  /**
   * Creates a findable object group
   * @param {*} id       Unique name
   * @param {*} alt_text Legend label
   * @param {*} objects  Array of FindableObjects
   */
  constructor(id, alt_text, thumbnail, objects = []) {
    this.id = id;
    this.alt_text = alt_text;
    this.thumbnail = thumbnail;
    this.objects = objects;
  }

  getType() {
    return 'group';
  }
}

export default FindableObjectGroup;
