const express = require('express');
const elasticSearch = require('elasticsearch');

const router = express.Router();

const elasticSearchUrl = process.env.ELASTIC_SEARCH_URL;

router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      throw new Error('Invalid request parameters');
    }
    const elasticSearchClient = elasticSearch.Client({
      host: elasticSearchUrl
    });
    await elasticSearchClient.ping(
      {
        requestTimeout: 3 * 1000
      },
      err => {
        if (err) {
          console.error('ElasticSearch cluster is down');
        } else {
          console.log('ElasticSearch is running');
        }
      }
    );
    const resp = await elasticSearchClient.search({
      index: 'products',
      type: 'product',
      size: 10,
      body: {
        query: {
          multi_match: {
            query,
            fields: ['name', 'categories', 'description']
          }
        }
      }
    });
    res.status(201).send({
      status: 201,
      data: resp
    });
  } catch (err) {
    res.status(500).send({
      status: 500,
      message: `Can't search correctly: ${err.message}`
    });
  }
});

module.exports = router;
