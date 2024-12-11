class OneToManyFindableObject {
  /**
   * Creates a findable object group
   * @param {*} id       Unique name
   * @param {*} alt_text Legend label
   * @param {*} objects  Array of FindableObjects
   */
  constructor(id, alt_text, thumbnail, objects = [], group = null) {
    this.id = id;
    this.alt_text = alt_text;
    this.thumbnail = thumbnail;
    this.objects = objects;
    this.group = group;
  }

  getType() {
    return '1:many';
  }
}

export default OneToManyFindableObject;
