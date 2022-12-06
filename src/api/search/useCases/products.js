const ElasticSearchRestData = require('../../shared/infrastructure/ElasticSearchRESTData');

const logger = console;

const getProducts = async (searchText, page, size = 20) => {
  logger.log('Trying to get data from elasticsearch: ', searchText);
  let multiMatchOptions = {
    query: searchText,
    fields: ['name', 'categories', 'description'],
    type: 'phrase_prefix',
  };
  if (searchText.split(' ').length > 1) {
    multiMatchOptions.type = 'most_fields';
  }
  const query = {
    multi_match: multiMatchOptions,
  };
  const elasticSearchResponse = await ElasticSearchRestData.SearchRequest(
    'products',
    { query },
    page,
    size,
    false
  );

  return elasticSearchResponse.body.hits;
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
  return elasticSearchResponse.body.hits;
};

const getMoreInterestingProducts = async (
  page = 0,
  size = 6,
  type = 'principal'
) => {
  const interestingProductsConfig = {
    principal: [1051, 1052, 23, 15, 9, 19, 30, 331, 21, 22],
    second: [300, 311, 309, 320, 319, 331],
    third: [1001, 1052, 1051],
    four: [35, 36, 31, 28],
  };
  const query = {
    bool: {
      filter: {
        terms: {
          itemNumber: interestingProductsConfig[type],
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

  return elasticSearchResponse.body.hits;
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
  return elasticSearchResponse.body.hits;
};

module.exports = {
  getProducts,
  getProductsByCategory,
  getMoreInterestingProducts,
  getAdminProducts,
};
