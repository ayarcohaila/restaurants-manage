import 'whatwg-fetch';
import moment from 'moment';
import {
  setAPILoading,
  setGlobalNotification,
} from 'containers/App/redux/actions';
import { logout } from 'modules/auth/redux/actions';
import { getStore } from '../configureStore';
/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default function request(
  url,
  method = 'GET',
  body = null,
  includeToken = false,
  isAPI = true,
) {
  let requestUrl = url;
  const options = { method };
  const headers = { 'content-type': 'application/json' };
  const store = getStore();

  store.dispatch(setAPILoading(true));

  if (isAPI) {
    requestUrl = `/api/${url}`;
  }
  if (body) {
    options.body = JSON.stringify(body);
  }

  if (includeToken) {
    const currentUser = store.getState().getIn(['auth', 'currentUser']);
    const token = currentUser && currentUser.get('token');
    const exp = currentUser
      ? moment(currentUser.get('exp'), 'X')
      : moment().subtract(1, 'day');
    if (moment().diff(exp) > 0) {
      store.dispatch(setGlobalNotification('API Error', 'Token is expired'));
      store.dispatch(logout());
      return Promise.reject(new Error('Token is expired'));
    }
    headers.Authorization = `Bearer ${token}`;
  }

  store.dispatch(setAPILoading(true));
  return fetch(requestUrl, {
    ...options,
    headers,
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(resp => {
      store.dispatch(setAPILoading(false));
      return resp;
    })
    .catch(err => {
      if (err.response) {
        err.response.json().then(json => {
          store.dispatch(
            setGlobalNotification(
              'Error',
              json && json.message ? json.message : 'Unknown error',
            ),
          );
        });
      } else {
        store.dispatch(
          setGlobalNotification(
            'API Error',
            err && err.message ? err.message : 'Unknown error',
          ),
        );
      }
      store.dispatch(setAPILoading(false));
      throw err;
    });
}
