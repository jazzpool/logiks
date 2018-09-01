const beautify = require('json-beautify');

module.exports = function(json, header, direction, config, prefix = '') {
    const text = beautify(json, null, 2, config.json.maxLength);

    const colorFn = direction === 'in' ? config.json.inputColor : config.json.outputColor;
    const [length, form, padding] = countForm(text, config.json.maxTerminalLength, prefix);

    const offset = new Array(padding + 3).fill(' ').join('');
    const dividerStart = new Array(padding).fill('─').join('');
    const dividerEnd = new Array(length + 1).fill('─').join('');

    const dividerUp = dividerStart + '┬' + dividerEnd;
    const dividerDown = dividerStart + '┴' + dividerEnd;

    prefix = prefix + ' ';

    const template = colorFn([
        header && (prefix + (header && `${offset}${header}:`)),
        prefix + dividerUp,
        form,
        prefix + dividerDown,
    ].filter(Boolean).join('\n'));

    return template;
};

function pad(max, l) {
    while (l.length < max) {
        l = '0' + l;
    }

    return l;
}

function countForm(text, max, prefix) {
    let l = 0;
    const rows = text.split('\n');
    const padding = String(rows.length).length;

    let t = rows.map((row, i) => {
        let r = prefix + ' ' + pad(padding, String(i)) + '  │ ' + row;

        if (r.length >= max) {
            r = r.slice(0, max - 3) + '...';
        }

        l = l > r.length ? l : r.length;

        return r;
    }).join('\n');

    l = l >= process.stdout.columns ? process.stdout.columns : l;
    return [l, t, padding + 2];
}
