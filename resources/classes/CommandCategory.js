module.exports = class CommandCategory {
  constructor(data) {
    this.data = data;
  };

  getMetadata() {
    return this.data;
  };

  get metadata() {
    return this.getMetadata();
  };
};