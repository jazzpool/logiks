const LogX = require('../src');

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
});
