'use strict';

const _ = require('lodash');
const fs = require('fs')

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

/**
 * @param {String} filePath
 * @return {Promise<Any>}
 */
function getContentOfFile(filePath) {
    const getContent = function () {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', function (err, data) {
                if (err) reject(err);
                else resolve(data)
            });
        });
    }
    return isFileExists(filePath)
        .then(getContent);
}

/**
 * @param {String} filePath
 * @return {Promise}
 */
function isFileExists(filePath) {
    return new Promise((resolve, reject) => {
        fs.access(filePath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}


module.exports.replace = replace;
module.exports.isFileExists = isFileExists;
module.exports.getContentOfFile = getContentOfFile;
