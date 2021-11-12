const axios = require('axios');
const HttpStatus = require('http-status-codes');

const logger = console;

async function GETRequest(baseURL, url, query = {}, body = {}, headers = {}) {
  try {
    const response = await axios({
      baseURL,
      headers,
      method: 'GET',
      url,
      params: query,
      data: body,
    });
    return response.data;
  } catch (e) {
    logger.error(
      HttpStatus.getStatusText(HttpStatus.StatusCodes.SERVICE_UNAVAILABLE),
      {
        statusCode: HttpStatus.StatusCodes.SERVICE_UNAVAILABLE,
        baseURL,
        url,
        query,
        errorDescription: e.message,
      }
    );
    throw e;
  }
}

async function POSTRequest(baseURL, url, query, body) {
  try {
    const response = await axios({
      baseURL,
      headers: body.getHeaders(),
      method: 'POST',
      url,
      params: query,
      data: body,
    });
    return response.data;
  } catch (e) {
    logger.error(
      HttpStatus.getStatusText(HttpStatus.StatusCodes.SERVICE_UNAVAILABLE),
      {
        statusCode: HttpStatus.StatusCodes.SERVICE_UNAVAILABLE,
        baseURL,
        url,
        query,
        errorDescription: e.message,
      }
    );
    throw e;
  }
}

module.exports = {
  GETRequest,
  POSTRequest,
};
