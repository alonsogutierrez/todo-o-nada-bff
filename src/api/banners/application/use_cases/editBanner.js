const MongoDbRepository = require('./../../insfrastructure/bannersRepository/MongoDbRepository');

const logger = console;

class EditBannerUseCase {
  constructor() {
    this.ouput_repository = new MongoDbRepository();
  }

  async edit(filters, newBannerData) {
    try {
      const response = await this.ouput_repository.updateOne(
        filters,
        newBannerData
      );
      return response;
    } catch (err) {
      const message = `Cant edit banner in use case: ${err.message}`;
      logger.error(message);
      throw new Error(message);
    }
  }
}

module.exports = EditBannerUseCase;
