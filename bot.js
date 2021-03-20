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
          const file = require(metadata);
          if (!file || typeof file !== 'function') return reject(new Error('Expected type "constructor" from metadata.js but got type ' + typeof file + ' instead!'));
          const MetadataClass = new file();
          if (!MetadataClass.getMetadata || typeof MetadataClass.getMetadata !== 'function') return reject(new Error('Missing property "metadata" from metadata class.'));
          resolve(MetadataClass.getMetadata());
        } catch (err) {
          reject(err);
        };
      });

      return Promise.all(categories.map(async (category) => {
        const metadata = await getCategoryMetadata(category);
        return [ category, metadata.description ];
      }));
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
      if (!name) return;
      const fn = client.registry[name];
      if (typeof fn !== 'function') return;
      if (!args) return fn();
      console.log(...args);
      fn(...args);
    });
  })();
};