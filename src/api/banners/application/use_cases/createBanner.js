const MongoDbRepository = require('./../../insfrastructure/bannersRepository/MongoDbRepository');

const logger = console;

class CreateBannerUseCase {
  constructor() {
    this.ouput_repository = new MongoDbRepository();
  }

  async create(bannerData) {
    try {
      const response = await this.ouput_repository.save(bannerData);
      return response;
    } catch (err) {
      const message = `Cant create banner in use case: ${err.message}`;
      logger.error(message);
      throw new Error(message);
    }
  }
}

module.exports = CreateBannerUseCase;
