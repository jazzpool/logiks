'use strict';

var dateFormat = require('dateformat');
var colors = require('colors');

var LEVELS = [
    ['silly', colors.white],
    ['debug', colors.green],
    ['warning', colors.yellow],
    ['error', colors.red],
    ['special', colors.cyan.underline],
    ['critical', colors.red.bold],
];

module.exports = Logger;

/**
 * @public
 * @param {object} config
 * @return {Logger}
 */
function Logger(config) {
    var self = this;

    this.config = config
    this.levels = config.levels || LEVELS;
    this.level = config.level;
    this.system = this.config.system;
    this.component = this.config.component;

    this.write = config.log || console.log.bind(console);

    this.logLevelPriority = -1;
    this.levelPriorities = {};

    this.levels.forEach(function(logDef, i) {
        var levelName = logDef[0];
        var levelColorFn = logDef[1];

        if (levelName === self.level) {
            self.logLevelPriority = i;
        }

        self.levelPriorities[levelName] = i;
        var colorFn = typeof levelColorFn === 'function'
            ? levelColorFn
            : function (text) {
                return text[levelColorFn];
            };

        self[levelName] = function() {
            var args = [].slice.call(arguments);
            
            if (self.component) {
                args.unshift(self.component);
            }

            if (self.system) {
                args.unshift(self.system);
            }

            args.unshift(levelName);

            return this.log.call(this, colorFn, args);
        };
    });

    if (self.logLevelPriority == -1) {
        throw new Error('There is no such log level: ' + config.level);
    }
}

/**
 * @public
 * @param {string} system
 * @return {Logger}
 */
Logger.prototype.withSystem = function(system) {
    var logger = new Logger(this.config);
    logger.system = system;

    return logger;
};

/**
 * @public
 * @param {string} component
 * @return {Logger}
 */
Logger.prototype.withComponent = function(component) {
    if (!this.system) {
        throw new Error('Choose system first');
    }

    var logger = new Logger(this.config);
    logger.system = this.system;
    logger.component = component;

    return logger;
};

/**
 * @public
 * @param {function} colorFn
 * @param {array} logArgs
 * @param {string} logArgs[0] level
 * @param {string} logArgs[1] system
 * @param {string} logArgs[2] component
 * @param {string} logArgs[3] text
 * @param {string} logArgs[4] [subcat]
 * @return {Logger}
 */
Logger.prototype.log = function log(colorFn, logArgs){
    var level = logArgs[0];
    var system = logArgs[1];
    var component = logArgs[2];
    var text = logArgs[3];
    var subcat = logArgs[4];

    var textLogLevel = this.levelPriorities[level];
    var useColors = this.config.colors;

    if (textLogLevel < this.logLevelPriority) {
        return;
    }

    if (subcat) {
        var realText = subcat;
        var realSubCat = text;
        text = realText;
        subcat = realSubCat;
    }

    var systemText = [
        dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
        system && '[' + system + ']',
    ].join(' ') || '';

    var system = colorFn(systemText);

    var component = component ? [
        '[',
        useColors ? component.italic : component,
        ']',
    ].join('') : '';

    var subcat = subcat ? [
        '(',
        useColors ? subcat.bold.grey : subcat,
        ')',
    ].join('') : '';

    var message = useColors ? text.grey : text

    this.write([
        system,
        component,
        subcat,
        message
    ].join(' '));

    return this
}
