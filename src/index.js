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

function formatMsg(msg) {
    if (msg instanceof Error) {
        const stackTop = (msg.stack || '').split('\n')[1];
        return `${msg.name}: ${msg.message}. ${stackTop ? '(' + stackTop.trim() + ')' : ''}`;
    }

    if (msg instanceof RegExp) {
        return msg.toString();
    }

    if (typeof msg === 'object') {
        return JSON.stringify(msg);
    }

    return msg;
}

class Logiks {
    constructor(config) {
        if (config.component && !config.system) {
            throw new Error('At first specify system');
        }

        if (config.subCat && !config.component) {
            throw new Error('At first specify system and component');
        }

        this.config = {
            colors: false,
            level: 'info',
            date: true,
            ...config,
        };

        this.config.json = this.config.json || {};
        this.config.json = {
            maxLength: this.config.json.maxLength || 64,
            defaultColor: this.config.json.defaultColor || chalk.rgb(167, 101, 121),
            maxRowLength: this.config.json.maxRowLength || process.stdout.columns - 5,
        };

        this.levels = config.levels || LEVELS;
        this.logFn = config.logger || console.log;
        this.__levels = {};

        let logLevelPriority = -1;
        const levelPriorities = {};

        this.levels.forEach(([levelName, levelColorFn], i) => {
            if (levelName === this.config.level) {
                logLevelPriority = i;
            }

            if (!this.config.colors) {
                levelColorFn = identity => identity;
            }

            levelPriorities[levelName] = i;
            this.__levels[levelName] = levelColorFn;

            this[levelName] = (...args) => {
                if (levelPriorities[levelName] < logLevelPriority) {
                    return;
                }

                return this.log(levelColorFn, ...args);
            };

            this[levelName].json = (...args) => {
                if (levelPriorities[levelName] < logLevelPriority) {
                    return;
                }

                const json = args.pop();

                if (args.length) {
                    this.log(levelColorFn, ...args);
                    this.json(json, false, levelColorFn);
                } else {
                    const header = this.getMessage(levelColorFn, ...args); // TODO
                    this.json(json, header, levelColorFn);
                }
                return;
            };
        });
    }

    withSystem(system) {
        return new Logiks({...this.config, system});
    }

    withComponent(component) {
        if (!this.config.system) {
            throw new Error('At first specify system');
        }

        return new Logiks({...this.config, component});
    }

    withSubCat(subCat) {
        if (!this.config.system || !this.config.component) {
            throw new Error('At first specify system and component');
        }

        return new Logiks({...this.config, subCat});
    }

    getMessage(colorFn, ...args) {
        let msgFn = chalk.dim;

        if (!this.config.colors) {
            msgFn = identity => identity;
        }

        const datePrefix = colorFn(dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'));

        let message = [];

        switch (args.length) {
        case 1: /* log(message) */
            message = [
                colorFn(formatMsg(args[0])),
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

        return this.config.date ? datePrefix + ' ' + message.join(' ') : message.join(' ');
    }

    log(...args) {
        const msg = this.getMessage(...args);
        return this.logFn(msg);
    }

    json(json, header, colorFn) {
        const datePrefix = this.config.date && dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
        this.logFn(printJson(json, header, colorFn || this.config.json.defaultColor, this.config, datePrefix));
        return;
    }
}



module.exports = Logiks;
