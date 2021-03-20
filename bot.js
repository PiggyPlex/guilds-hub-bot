const fs = require('fs');

module.exports = (client) => {
  // Get Registries
  const getRegistries = async () => {
    const getCategories = () => (
      new Promise((resolve, reject) => {
        fs.readdir(`${__dirname}/commands`, (err, files) => {
          if (err) return reject();
          resolve(files);
        });
      })
    );
    
    const getCategoryData = async () => {
      const categories = await getCategories();
      const getCategoryMetadata = (category) => new Promise((resolve, reject) => {
        const metadata = `${__dirname}/commands/${category}/metadata.js`;
        try {
          resolve(require(metadata));
        } catch (err) {
          reject(err);
        };
      });
      return categories.map(async (category) => {
        const metadata = await getCategoryMetadata(category);
        return [category, metadata.description];
      });
    };

    return [
      {
        name: 'registerDefaultTypes'
      },
      {
        name: 'registerGroups',
        args: [
          await getCategoryData()
        ]
      },
      {
        name: 'registerDefaultGroups'
      },
      {
        name: 'registerCommandsIn',
        args: [
          `${__dirname}/commands`
        ]
      }
    ];
  };

  (async () => {
    const registries = await getRegistries();
    registries.forEach(({ name, args }) => {
      const fn = client.registry[name];
      if (typeof name !== 'function') return;
      if (!args) return fn();
      fn(...args);
    });
  })();
};