const CommandCategory = require(`${process.cwd()}/resources/classes/CommandCategory.js`);

module.exports = class EventsCategory extends CommandCategory {
  constructor() {
    super({
      name: 'Events',
      description: 'Test'
    });
  };
};