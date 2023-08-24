const Carrousels = require('./../../../db/models/carrousels');

const logger = console;

const findOne = async () => {
  try {
    const carrouselsConfigList = await Carrousels.find({});
    return carrouselsConfigList[0];
  } catch (err) {
    throw new Error(`Can't find one carrousels in repository: ${err.message}`);
  }
};

const save = async (carrouselsData) => {
  try {
    const carrousels = new Carrousels(carrouselsData);
    return await carrousels.save();
  } catch (err) {
    throw new Error(`Can't save carrousels in repository: ${err.message}`);
  }
};

module.exports = { findOne, save };
