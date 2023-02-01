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
    bool: {
      must: {
        multi_match: multiMatchOptions,
      },
      filter: {
        bool: {
          must: [
            {
              match: {
                is_active: true,
              },
            },
          ],
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

const getProductsByCategory = async (categoryName, page, size = 20) => {
  const query = {
    bool: {
      must: {
        multi_match: {
          query: categoryName,
          fields: ['categories'],
          type: 'phrase_prefix',
        },
      },
      filter: {
        bool: {
          must: [
            {
              match: {
                is_active: true,
              },
            },
          ],
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

const getMoreInterestingProducts = async (
  page = 0,
  size = 6,
  type = 'principal'
) => {
  // TODO: Move thi values to database
  const interestingProductsConfig = {
    principal: [6661312, 1312, 1033, 1666, 1040, 1039],
    second: [19, 15, 4, 10, 16, 2, 400],
    third: [300, 311, 309, 320, 319, 331],
    four: [35, 36, 31, 28, 33, 25],
  };
  const query = {
    bool: {
      must: {
        terms: {
          itemNumber: interestingProductsConfig[type],
        },
      },
      filter: {
        term: {
          is_active: true,
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
