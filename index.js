'use strict';

const cmn = require('./src/common');

const pluginName = 'pattern-lab-global-variables';
const hookName = 'patternlab-pattern-write-begin';
let variables = {};

/**
 * @param patternlab - global data store which has the handle to hooks
 * @return {void}
 */
function registerHooks(patternlab) {
    if (!Array.isArray(patternlab.hooks[hookName])) {
        patternlab.hooks[hookName] = [];
    }
    patternlab.hooks[hookName].push(onReplaceVariablesInPattern);
}

/**
 * @param {Object} params
 * @return {Promise<void>}
 */
async function onReplaceVariablesInPattern(params) {
    const [patternlab, pattern] = params;

    ['template', 'extendedTemplate', 'patternData', 'patternPartialCode'].forEach((key) => {
        if (pattern.hasOwnProperty(key)) {
            pattern[key] = cmn.replace(pattern[key], variables);
        }
    })
}

/**
 * @return {Object}
 */
function getPluginFrontendConfig() {
    return {
        name:        pluginName,
        templates:   [],
        stylesheets: [],
        javascripts: [],
        onready:     'PluginTab.init()',
        callback:    '',
    };
}

/**
 * The entry point for the plugin. You should not have to alter this code much under many circumstances.
 * Instead, alter getPluginFrontendConfig() and registerEvents() methods
 */
function pluginInit(patternlab) {
    if (!patternlab) {
        console.error('patternlab object not provided to pluginInit');
        process.exit(1);
    }

    const pluginConfig = getPluginFrontendConfig();

    if (!patternlab.plugins) {
        patternlab.plugins = [];
    }
    patternlab.plugins.push(pluginConfig);

    if (!patternlab.config.plugins) {
        patternlab.config.plugins = {};
    }

    cmn.isFileExists(process.cwd() + '/' + patternlab.config.plugins[pluginName]['fileWithVariables']).catch(() => {
        console.error('variable file is not defined');
        process.exit(1);
    });

    cmn.getContentOfFile(process.cwd() + '/' + patternlab.config.plugins[pluginName]['fileWithVariables'])
        .then((content) => variables = JSON.parse(content));

    //attempt to only register hooks once
    if (
        patternlab.config.plugins[pluginName] !== undefined &&
        patternlab.config.plugins[pluginName].enabled &&
        !patternlab.config.plugins[pluginName].initialized
    ) {
        //register hooks
        registerHooks(patternlab);

        //set the plugin initialized flag to true to indicate it is installed and ready
        patternlab.config.plugins[pluginName].initialized = true;
    }
}

module.exports = pluginInit;
