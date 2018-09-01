'use strict';

const dateFormat = require('dateformat');
const chalk = require('chalk');

const printJson = require('./json');

const LEVELS = [
    ['silly', chalk.white],
    ['debug', chalk.green],
    ['info', chalk.magenta],
    ['warning', chalk.yellow],
    ['error', chalk.red],
    ['special', chalk.cyan.underline],
    ['critical', chalk.red.underline.bold],
];

function formatMsg(value) {
    return value;
}

class LogX {
    constructor(config) {
        this.config = {colors: false, level: 'info', ...config};

        if (!this.config.json) {
            this.config.json = {
                maxLength: 120,
                inputColor: chalk.rgb(167, 101, 121),
                outputColor: chalk.rgb(95, 96, 169),
            };
        }

        this.levels = config.levels || LEVELS;

        this.logFn = config.logger || console.log;

        let logLevelPriority = -1;
        const levelPriorities = {};

        this.levels.forEach(([levelName, levelColorFn], i) => {
            if (levelName === this.config.level) {
                logLevelPriority = i;
            }

            levelPriorities[levelName] = i;

            this[levelName] = (...args) => {
                if (levelPriorities[levelName] > logLevelPriority) {
                    return;
                }

                return this.log(levelColorFn, ...args);
            };

            this[levelName].json = (...args) => {
                if (levelPriorities[levelName] > logLevelPriority) {
                    return;
                }

                const json = args.pop();

                if (args.length) {
                    this.log(levelColorFn, ...args.concat(''));
                    this.json(json, false);
                } else {
                    const header = this.getMessage(levelColorFn, args.concat('')); // TODO
                    this.json(json, header);
                }
                return;
            };
        });
    }

    withSystem(system) {
        return new LogX({...this.config, system});
    }

    withComponent(component) {
        if (!this.config.system) {
            throw new Error('At first specify system');
        }

        return new LogX({...this.config, component});
    }

    withSubCat(subCat) {
        if (!this.config.system || !this.config.component) {
            throw new Error('At first specify system and component');
        }

        return new LogX({...this.config, subCat});
    }

    getMessage(colorFn, ...args) {
        let msgFn = chalk.dim;

        if (!this.config.colors) {
            colorFn = identity => identity;
            msgFn = identity => identity;
        }

        const datePrefix = colorFn(dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'));

        let message = [];

        switch (args.length) {
        case 1: /* log(message) */
            message = [
                msgFn(formatMsg(args[0])),
            ];
            break;
        case 2: /* log(system, message) */
            message = [
                colorFn(`[${this.config.system || args[0]}]`),
                msgFn(formatMsg(args[1])),
            ];
            break;
        case 3: /* log(system, component, message) */
            message = [
                colorFn(`[${this.config.system || args[0]}]`),
                colorFn(chalk.dim(`[${this.config.component || args[1]}]`)),
                msgFn(formatMsg(args[2])),
            ];
            break;
        case 4:
        default: /* log(system. component, subcat, message) */
            message = [
                colorFn(`[${this.config.system || args[0]}]`),
                colorFn(chalk.dim(`[${this.config.component || args[1]}]`)),
                colorFn(chalk.italic.dim(`(${this.config.subcat || args[2]})`)),
                msgFn(formatMsg(args[3])),
            ];
        }

        return datePrefix + ' ' + message.join(' ');
    }

    log(...args) {
        const msg = this.getMessage(...args);
        return this.logFn(msg);
    }

    json(json, header, direction) {
        const datePrefix = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
        this.logFn(printJson(json, header, direction, this.config, datePrefix));
        return;
    }
}

module.exports = LogX;
