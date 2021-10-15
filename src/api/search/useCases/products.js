const ElasticSearchRestData = require('../../shared/infrastructure/ElasticSearchRESTData');

const logger = console;

const getProducts = async (searchText, page, size = 20) => {
  logger.log('Trying to get data from elasticsearch: ', searchText);
  const query = {
    multi_match: {
      query: searchText,
      fields: ['name', 'categories', 'description'],
      type: 'phrase_prefix',
    },
  };
  const elasticSearchResponse = await ElasticSearchRestData.SearchRequest(
    'products',
    { query },
    page,
    size,
    false
  );

  return elasticSearchResponse.hits;
};

const getProductsByCategory = async (categoryName, page, size = 20) => {
  const query = {
    multi_match: {
      query: categoryName,
      fields: ['categories'],
      type: 'phrase_prefix',
    },
  };
  const elasticSearchResponse = await ElasticSearchRestData.SearchRequest(
    'products',
    { query },
    page,
    size,
    false
  );
  return elasticSearchResponse.hits;
};

const getMoreInterestingProducts = async (page = 0, size = 6) => {
  const query = {
    bool: {
      filter: {
        terms: {
          itemNumber: [25, 26, 10, 31, 28],
        },
      },
    },
  };
  const elasticSearchResponse = await ElasticSearchRestData.SearchRequest(
    'products',
    { query },
    page,
    size,
    false
  );
  return elasticSearchResponse.hits;
};

const getAdminProducts = async (page = 0, size = 100) => {
  const query = {
    match_all: {},
  };
  const elasticSearchResponse = await ElasticSearchRestData.SearchRequest(
    'products',
    { query },
    page,
    size,
    false
  );
  return elasticSearchResponse.hits;
};

module.exports = {
  getProducts,
  getProductsByCategory,
  getMoreInterestingProducts,
  getAdminProducts,
};
