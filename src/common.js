'use strict';

const _ = require('lodash');

/**
 * @param {String} filePath
 * @param {Object} replaces
 * @return {Promise}
 */
function replace(data, replaces) {
    if (!_.isString(data)) return null;

    for (const [key, value] of Object.entries(replaces)) {
        const re = new RegExp('{' + key + '}', "g");
        data = data.replace(re, value);
    }
    return data;
}

module.exports.replace = replace;
