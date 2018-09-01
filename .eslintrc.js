const path = require('path');

module.exports = {
    'extends': [
        'nodejs',
        'eslint:recommended',
        'plugin:node/recommended',
        'standard',
    ],
    'plugins': [
        'promise',
        'import',
        'node'
    ],
    'env': {
        'browser': false,
        'node': true,
        'es6': true,
    },
    'parserOptions': {
        'ecmaVersion': 2018
    },
    'rules': {
        'no-console': 0,
        'no-process-exit': 0,
        'semi': [
            'error',
            'always',
        ],
        'no-useless-constructor': 0,
        'no-duplicate-imports': 0,
        'key-spacing': 0,
        'max-len': [
            2,
            140,
            2,
        ],
        'object-curly-spacing': [
            2,
            'never',
        ],
        'indent': [
            'error',
            4,
        ],
        'space-before-function-paren': [
            'error',
            'never',
        ],
        'comma-dangle': [
            'error',
            {
                'arrays': 'always-multiline',
                'imports': 'always-multiline',
                'exports': 'always-multiline',
                'functions': 'always-multiline',
                'objects': 'always-multiline',
            },
        ],
        'import/no-unresolved': [2, {commonjs: true, amd: false}],
        'node/no-missing-require': 0,
        'node/shebang': 0,
    },
};

