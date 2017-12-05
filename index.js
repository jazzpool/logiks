'use strict';

var dateFormat = require('dateformat');
var colors = require('colors');

var levelPriorities = [
    'debug',
    'warning',
    'error',
    'special',
    'critical',
];

module.exports = Logger

/**
 * @public
 * @param {object} config
 * @return {Logger}
 */
function Logger(config) {
    var self = this;

    self.config = config
    self.logLevelPriority = levelPriorities.indexOf(config.level);

    if (self.logLevelPriority == -1) {
        throw new Error('There is no such log level: ' + config.level);
    }

    levelPriorities.forEach(function(logType) {
        self[logType] = function(){
            var args = [].slice.call(arguments);
            
            if (self.system) {
                args.unshift(self.system);
            }

            args.unshift(logType);

            return this.log.apply(this, args);
        };
    });
}

/**
 * @public
 * @param {string} system
 * @return {Logger}
 */
Logger.prototype.withSystem = function(system) {
    this.system = system

    var logger = new Logger(this.config)
    logger.system = system

    return logger;
};


Logger.prototype.log = function log(level, system, component, text, subcat){

    var textLogLevel = levelPriorities.indexOf(level);
    var logColors = this.config.colors 

    if (textLogLevel < this.logLevelPriority) {
        return;
    }

    if (subcat){
        var realText = subcat;
        var realSubCat = text;
        text = realText;
        subcat = realSubCat;
    }

    var system = levelToColor(level, [
        dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
        system && '[' + system + ']',
    ].join(' ')) || '';

    var component = component ? [
        '[',
        logColors ? component.italic : component,
        ']',
    ].join('') : '';

    var subcat = subcat ? [
        '(',
        logColors ? subcat.bold.grey : subcat,
        ')',
    ].join('') : '';

    var message = logColors ? text.grey : text

    console.log([
        system,
        component,
        subcat,
        message
    ].join(' '));

    return this
}

/**
 * @private
 * @param {string} level
 * @param {string} text
 * @return {string} colored
 */
function levelToColor(level, text) {
    switch(level) {
        case 'special':
            return text.cyan.underline;
        case 'debug':
            return text.green;
        case 'warning':
            return text.yellow;
        case 'error':
            return text.red;
        case 'info':
            return text.grey.italic
        case 'critical':
            return text.red.bold
        default:
            console.log('Unknown level ' + level);
            return text.italic;
    }
}
