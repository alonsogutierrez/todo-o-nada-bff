const MongoDbRepository = require('./../../insfrastructure/bannersRepository/MongoDbRepository');

const logger = console;

class EraseBannerUseCase {
  constructor() {
    this.ouput_repository = new MongoDbRepository();
  }

  async erase(filters) {
    try {
      const response = await this.ouput_repository.deleteOne(filters);
      return response;
    } catch (err) {
      const message = `Cant erase banner in use case: ${err.message}`;
      logger.error(message);
      throw new Error(message);
    }
  }
}

module.exports = EraseBannerUseCase;
