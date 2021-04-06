const ElasticSearch = require('elasticsearch');

const logger = console;

const initiateClient = () => {
  try {
    logger.log('Initializing elastic client');
    const elasticSearchClient = new ElasticSearch.Client({
      host: SERVICES.ELASTICSEARCH_API
    });
    return elasticSearchClient;
  } catch {
    throw new Error(`Can't initiate ElasticSeachClient`);
  }
};

const isClientRunning = async elasticSearchClient => {
  logger.log('Checking if elastic client is ready');
  return new Promise((resolve, reject) => {
    try {
      elasticSearchClient.ping(
        {
          requestTimeout: 5 * 1000
        },
        err => {
          if (err) {
            logger.error('ElasticSearch cluster is down');
            reject(false);
          } else {
            logger.log('ElasticSearch is running');
            resolve(true);
          }
        }
      );
    } catch (err) {
      reject(err.message);
    }
  });
};

const SearchRequest = async (index, type, query, from = 0, size = 10) => {
  try {
    logger.log('Begin search request for: ', query);
    const elasticSearchClient = initiateClient();
    const isElasticSearchClientRunning = await isClientRunning(
      elasticSearchClient
    );
    logger.log('isElasticSearchClientRunning: ', isElasticSearchClientRunning);

    if (isElasticSearchClientRunning) {
      const response = await elasticSearchClient.search({
        index,
        type,
        body: query,
        from,
        size
      });
      logger.log('Response: ', response);
      return response;
    }
    throw new Error('ElasticSearch cluster is down');
  } catch (err) {
    throw new Error(`Error trying to search in elasticSearch: ${err.message}`);
  }
};

const SERVICES = {
  ELASTICSEARCH_API: process.env.ELASTIC_SEARCH_URL
};

const RESOURCES = {
  SEARCH_PRODUCTS(searchText) {
    return `/search?query=${searchText}`;
  },

  SEARCH_PRODUCTS_BY_CATEGORY(categoryName) {
    return `/search/${categoryName}`;
  }
};

module.exports = {
  SearchRequest,
  SERVICES,
  RESOURCES
};
