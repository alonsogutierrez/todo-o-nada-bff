const Carrousels = require('./../../../db/models/carrousels');

const logger = console;

const save = async (carrouselsData) => {
  try {
    const carrousels = new Carrousels(carrouselsData);
    return await carrousels.save();
  } catch (err) {
    throw new Error(`Can't save carrousels in repository: ${err.message}`);
  }
};

module.exports = { save };
