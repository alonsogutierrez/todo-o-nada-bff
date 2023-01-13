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

  async getByBannerNumber(bannerNumberFilter) {
    let bannerData = {};
    try {
      const filters = {
        bannerNumber: bannerNumberFilter,
      };
      const bannerDataResponse = await this.bannersRepository.findOne(filters);
      const { bannerNumber, position, isActive, images } = bannerDataResponse;
      bannerData = {
        bannerNumber,
        position,
        isActive,
        images,
      };
    } catch (err) {
      logger.error(
        'Cant get banner by bannernumber errors in use case: ',
        err.message
      );
    }
    return bannerData;
  }
}

module.exports = GETBannersUseCases;
