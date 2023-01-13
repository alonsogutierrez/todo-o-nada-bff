const Banner = require('../../../../db/models/banner');

class MongoDbRepository {
  async save(bannerData) {
    try {
      const banner = new Banner(bannerData);
      return await banner.save();
    } catch (err) {
      throw new Error(`Can't save banner in repository: ${err.message}`);
    }
  }

  async findAll() {
    try {
      const filters = {};
      const bannersList = await Banner.find(filters);
      return bannersList;
    } catch (err) {
      throw new Error(`Can't get all banners in repository: ${err.message}`);
    }
  }

  async findOne(filters) {
    try {
      const banner = await Banner.findOne(filters);
      return banner;
    } catch (err) {
      throw new Error(
        `Can't get banner by banner number in repository: ${err.message}`
      );
    }
  }

  async updateOne(filters, newData) {
    try {
      const bannerUpdated = await Banner.updateOne(filters, newData);
      return bannerUpdated;
    } catch (err) {
      throw new Error(`Can't update one banner in repository: ${err.message}`);
    }
  }

  async deleteOne(filters) {
    try {
      const bannerDeletedResponse = await Banner.deleteOne(filters);
      return bannerDeletedResponse;
    } catch (err) {
      throw new Error(`Can't delete one banner in repository: ${err.message}`);
    }
  }
}

module.exports = MongoDbRepository;
