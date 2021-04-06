const ElasticSearchRestData = require('../../shared/infrastructure/ElasticSearchRESTData');

const logger = console;

const getProducts = async (searchText, page, size = 10) => {
  logger.log('Trying to get data from elasticsearch: ', searchText);
  const query = {
    match_bool_prefix: {
      name: searchText
    },
    match_bool_prefix: {
      categories: searchText
    },
    match_bool_prefix: {
      description: searchText
    }
  };
  const elasticSearchResponse = await ElasticSearchRestData.SearchRequest(
    'products',
    'product',
    { query },
    page,
    size
  );
  logger.log('Request done: ', elasticSearchResponse);

  return elasticSearchResponse.hits;
};

const getProductsByCategory = async (categoryName, page, size = 20) => {
  const query = {
    match_bool_prefix: {
      categories: categoryName
    }
  };
  const elasticSearchResponse = await ElasticSearchRestData.SearchRequest(
    'products',
    'products',
    { query },
    page,
    size
  );
  return elasticSearchResponse.hits;
};

module.exports = {
  getProducts,
  getProductsByCategory
};
