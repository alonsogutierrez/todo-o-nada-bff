const axios = require('axios');
const HttpStatus = require('http-status-codes');

const logger = console;

async function GETRequest(baseURL, url, query, body, headers) {
  try {
    const response = await axios({
      baseURL,
      headers,
      method: 'GET',
      url,
      params: query,
      data: body
    });
    return response.data;
  } catch (e) {
    logger.error(HttpStatus.getStatusText(HttpStatus.SERVICE_UNAVAILABLE), {
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      baseURL,
      url,
      query,
      errorDescription: e.message
    });
    throw e;
  }
}

async function POSTRequest(baseURL, url, query, body) {
  try {
    console.log('baseurl + url : ', baseURL + url);
    console.log('query: ', query);
    console.log('body: ', body);
    const response = await axios({
      method: 'POST',
      url: baseURL + url,
      //params: query,
      data: body
    });
    return response.data;
  } catch (e) {
    logger.error(HttpStatus.getStatusText(HttpStatus.SERVICE_UNAVAILABLE), {
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      baseURL,
      url,
      query,
      errorDescription: e.message
    });
    throw e;
  }
}

module.exports = {
  GETRequest,
  POSTRequest
};
