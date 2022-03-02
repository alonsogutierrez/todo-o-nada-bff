const { Client } = require('@elastic/elasticsearch');

const logger = console;

const SERVICES = {
  ELASTICSEARCH_API: process.env.ELASTIC_SEARCH_URL,
};

const USER_CREDENTIALS = {
  ELASTIC_SEARCH_USERNAME: process.env.ELASTIC_SEARCH_USER,
  ELASTIC_SEARCH_PASSWORD: process.env.ELASTIC_SEARCH_PASSWORD,
};

const RESOURCES = {
  SEARCH_PRODUCTS(searchText) {
    return `/search?query=${searchText}`;
  },

  SEARCH_PRODUCTS_BY_CATEGORY(categoryName) {
    return `/search/${categoryName}`;
  },
};

const elasticSearchClient = new Client({
  node: SERVICES.ELASTICSEARCH_API,
  /*auth: {
    username: USER_CREDENTIALS.ELASTIC_SEARCH_USERNAME,
    password: USER_CREDENTIALS.ELASTIC_SEARCH_PASSWORD,
  },*/
  maxRetries: 8,
  requestTimeout: 30 * 1000,
});

const isClientRunning = () => {
  return new Promise((resolve, reject) => {
    try {
      elasticSearchClient.ping({}, (err, response) => {
        if (err) {
          reject(`ElasticSearch cluster is down: ${err.message}`);
        }
        resolve(response);
      });
    } catch (err) {
      reject(`ElasticSearch cluster is down: ${err.message}`);
    }
  });
};

const SearchRequest = (index, query, from = 0, size = 10, bulk = false) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isElasticSearchClientRunning = await isClientRunning();
      const elasticProductIndex = await elasticSearchClient.indices.exists({
        index,
      });

      if (!elasticProductIndex) {
        logger.info('Trying to create elasticSearch index');
        await elasticSearchClient.indices.create({
          index,
          includeTypeName: true,
        });
        logger.info('Index created');
      }

      if (isElasticSearchClientRunning) {
        if (bulk) {
          logger.info('bulk search');
          setTimeout(() => {
            logger.info('search after 1 second');
            elasticSearchClient.search(
              {
                index,
                body: query,
                from,
                size,
              },
              (err, response) => {
                if (err) {
                  reject(err);
                }
                resolve(response);
              }
            );
          }, 1 * 1000);
        } else {
          logger.info('not bulk search');
          elasticSearchClient.search(
            {
              index,
              body: query,
              from,
              size,
            },
            (err, response) => {
              if (err) {
                reject(err);
              }
              resolve(response);
            }
          );
        }
      }
    } catch (err) {
      logger.error(`Error trying to search in elasticSearch: ${err.message}`);
      reject(`Error trying to search in elasticSearch: ${err.message}`);
    }
  });
};

const UpdateRequest = (index, id, body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isElasticSearchClientRunning = await isClientRunning();

      if (isElasticSearchClientRunning) {
        elasticSearchClient.index(
          {
            id,
            index,
            body,
          },
          (err, response) => {
            if (err) {
              logger.error(
                `Can't update product in elastic search ${err.message}`
              );
              reject({
                message: `Can't update product in elastic search ${err.message}`,
              });
            }
            resolve(response);
          }
        );
      }
    } catch (err) {
      logger.error(`Error trying to update in elasticSearch: ${err.message}`);
      reject({
        message: `Error trying to update in elasticSearch: ${err.message}`,
      });
    }
  });
};

const CreateRequest = (index, body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isElasticSearchClientRunning = await isClientRunning();

      const elasticProductIndex = await elasticSearchClient.indices.exists({
        index,
      });
      if (!elasticProductIndex) {
        logger.info('Trying to create elasticSearch index');
        await elasticSearchClient.indices.create({
          index,
          includeTypeName: true,
        });
        logger.info('Index created');
      }

      if (isElasticSearchClientRunning) {
        elasticSearchClient.index(
          {
            index,
            body,
          },
          (err, response) => {
            if (err) {
              logger.error(`Error trying to create document: ${err.message}`);
              reject({
                message: `Error trying to create document: ${err.message}`,
              });
            }
            logger.info('Product well saved into elasticSearch');
            resolve(response);
          }
        );
      }
    } catch (err) {
      reject(`Error trying to create in elasticSearch: ${err.message}`);
    }
  });
};

const ExistProductDocumentRequest = (index, itemNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isElasticSearchClientRunning = await isClientRunning();

      const elasticProductIndex = await elasticSearchClient.indices.exists({
        index,
      });
      if (!elasticProductIndex) {
        logger.info('Trying to create elasticSearch index');
        await elasticSearchClient.indices.create({
          index,
          includeTypeName: true,
        });
        logger.info('Index created');
      }

      if (isElasticSearchClientRunning) {
        elasticSearchClient.exists(
          {
            index,
            itemNumber,
          },
          (err, response) => {
            if (err) {
              reject(err);
            }
            resolve(response);
          }
        );
      }
    } catch (err) {
      logger.error(`Error trying to verify if document exists: ${err.message}`);
      reject(`Error trying to verify if document exists: ${err.message}`);
    }
  });
};

module.exports = {
  CreateRequest,
  SearchRequest,
  UpdateRequest,
  ExistProductDocumentRequest,
  SERVICES,
  RESOURCES,
};
