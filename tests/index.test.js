const LogX = require('../src');
const chalk = require('chalk');

const log = console.log;
global.console.log = (...args) => log(...args) || args[0];

describe('LogX', () => {
    describe('colors', () => {
        const colored = new LogX({colors: true, level: 'debug', date: false});
        const uncolored = new LogX({colors: false, level: 'debug', date: false});

        it('colored', () => {
            expect(colored.debug('test')).toBe(colored.__levels.debug('test'));
        });

        it('uncolored', () => {
            expect(uncolored.debug('test')).toBe('test');
        });
    });

    describe('levels', () => {
        const infoLevel = new LogX({colors: false, level: 'info', date: false});

        it('if given power than required', () => {
            expect(infoLevel.debug('test')).toBe(undefined);
        });

        it('if it is ok', () => {
            expect(infoLevel.info('test')).toBe('test');
        });
    });

    describe('levels', () => {
        const log = new LogX({colors: false, level: 'info', date: false});

        it('.withSystem', () => {
            expect(log.withSystem('system').info('test')).toBe('[system] test');
        });

        it('.withComponent', () => {
            expect(log
                .withSystem('system')
                .withComponent('component')
                .info('test')).toBe('[system] ' + chalk.dim('[component]') + ' test');
        });

        it('.withSubcat', () => {
            expect(log
                .withSystem('system')
                .withComponent('component')
                .withSubCat('subcat')
                .info('test')).toBe('[system] ' + chalk.dim('[component]') + ' ' + chalk.italic.dim('(subcat)') + ' test');
        });
    });

    describe('errors logging', () => {
        const log = new LogX({colors: false, level: 'info', date: false});
        let error = null;
        try {
            const t = a + 10; // eslint-disable-line
        } catch (e) {
            error = e;
        }

        const errMsg = '[Syntax error] ReferenceError: a is not defined.';

        expect(log.error('Syntax error', error).startsWith(errMsg)).toBe(true);
    });
});
