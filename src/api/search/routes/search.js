const express = require('express');
const elasticSearch = require('elasticsearch');

const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      throw new Error('Invalid request parameters');
    }
    const elasticSearchClient = elasticSearch.Client({
      host: 'localhost:9200'
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
      body: {
        query: {
          bool: {
            should: [
              {
                match: {
                  productName: query //Product name
                }
              }
            ]
          }
        }
      }
    });
    const { hits } = resp.hits;
    console.log('hits: ', hits);
    res.status(201).send({
      status: 201,
      data: hits
    });
  } catch (err) {
    res.status(500).send({
      status: 500,
      message: `Can't search correctly: ${err.message}`
    });
  }
});

module.exports = router;
