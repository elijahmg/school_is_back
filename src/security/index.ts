import { includes } from 'lodash';

/**
 * Check if user has right to call API
 * @param {function} func
 * @param {String} role
 * **/
export function checkRight(func: Function, role: String) {
  return function () {
    const currentUser = arguments[2].user;
    if (!currentUser || !includes(currentUser.roles, role)) throw new Error('Request is not allowed');

    return func.apply(this, arguments);
  }
}