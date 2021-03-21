const fs = require('fs'),
      register = require('./resources/register.js');

module.exports = async (client) => {
  // Get Registries
  await register(__dirname, client);
};