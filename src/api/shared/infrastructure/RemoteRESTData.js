import axios from 'axios';
import HttpStatus from 'http-status-codes';

export async function GETRequest(baseURL, url, query, body, headers) {
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

export async function POSTRequest(baseURL, url, query, body) {
  try {
    const response = await axios({
      baseURL,
      method: 'POST',
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

export const SERVICES = {
  BFF_TODO_NADA: config.get('api.elasticsearch_todo_nada')
};

export const RESOURCES = {
  SEARCH_PRODUCTS: '/search',

  SEARCH_PRODUCTS_BY_CATEGORY(categoryName) {
    return `/search/${categoryName}`;
  }
};
