const MongoDbRepository = require('./../../insfrastructure/bannersRepository/MongoDbRepository');

const logger = console;

class GETBannersUseCases {
  constructor() {
    this.bannersRepository = new MongoDbRepository();
  }

  async getBanners() {
    let bannersData = {};
    try {
      bannersData = await this.bannersRepository.findAll();
      const bannersDataParsed = bannersData.map((bannerData) => {
        const { bannerNumber, position, isActive, images } = bannerData;
        return {
          bannerNumber,
          position,
          isActive,
          images,
        };
      });
      bannersData = bannersDataParsed.sort((a, b) => a.position < b.position);
    } catch (err) {
      logger.error('Cant get banners errors in use case: ', err.message);
    }
    return bannersData;
  }
}

module.exports = GETBannersUseCases;
