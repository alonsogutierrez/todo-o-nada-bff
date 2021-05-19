const ElasticSearch = require('elasticsearch');

const logger = console;

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

const elasticSearchClient = new ElasticSearch.Client({
  host: SERVICES.ELASTICSEARCH_API
});

const isClientRunning = async () => {
  return new Promise((resolve, reject) => {
    try {
      elasticSearchClient.ping(
        {
          requestTimeout: 10 * 1000
        },
        err => {
          if (err) {
            logger.error('ElasticSearch cluster is down');
            reject(false);
          } else {
            logger.info('ElasticSearch is running well');
            resolve(true);
          }
        }
      );
    } catch (err) {
      reject(err.message);
    }
  });
};

const SearchRequest = async (index, query, from = 0, size = 10) => {
  try {
    logger.log('Begin search request for: ', JSON.stringify(query));
    const isElasticSearchClientRunning = await isClientRunning();

    const elasticProductIndex = await elasticSearchClient.indices.exists({
      index: 'products'
    });
    if (!elasticProductIndex) {
      logger.log('Trying to create elasticSearch index');
      await elasticSearchClient.indices.create({
        index: 'products',
        includeTypeName: true
      });
      logger.log('Index created');
    }

    if (isElasticSearchClientRunning) {
      const response = await elasticSearchClient.search({
        index,
        body: query,
        from,
        size
      });
      return response;
    }
    throw new Error('ElasticSearch cluster is down');
  } catch (err) {
    throw new Error(`Error trying to search in elasticSearch: ${err.message}`);
  }
};

const UpdateRequest = async (index, id, body) => {
  try {
    logger.log('Begin update request for id: ', id);
    const isElasticSearchClientRunning = await isClientRunning();

    if (isElasticSearchClientRunning) {
      const response = await elasticSearchClient.update({
        index,
        id,
        body: {
          doc: body
        }
      });
      return response;
    }
    throw new Error('ElasticSearch cluster is down');
  } catch (err) {
    throw new Error(`Error trying to update in elasticSearch: ${err.message}`);
  }
};

const CreateRequest = async (index, body) => {
  try {
    logger.log('Begin create request for body: ', body);
    const isElasticSearchClientRunning = await isClientRunning();

    const elasticProductIndex = await elasticSearchClient.indices.exists({
      index: 'products'
    });
    if (!elasticProductIndex) {
      logger.log('Trying to create elasticSearch index');
      await elasticSearchClient.indices.create({
        index: 'products',
        includeTypeName: true
      });
      logger.log('Index created');
    }

    if (isElasticSearchClientRunning) {
      const response = await elasticSearchClient.index({
        index,
        body
      });
      logger.log('Product well indexed: ', response);
      return response;
    }
    throw new Error('ElasticSearch cluster is down');
  } catch (err) {
    throw new Error(`Error trying to create in elasticSearch: ${err.message}`);
  }
};

module.exports = {
  CreateRequest,
  SearchRequest,
  UpdateRequest,
  SERVICES,
  RESOURCES
};
