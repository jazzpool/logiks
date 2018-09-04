const beautify = require('json-beautify');

module.exports = function(json, header, colorFn, config, prefix = '') {
    const text = beautify(json, null, 2, config.json.maxLength);
    prefix = prefix ? prefix + ' ' : '';

    const maxRowLength = config.json.maxRowLength - prefix.length - 1;
    const [length, form, padding] = countForm(text, maxRowLength, prefix);

    const offset = new Array(padding + 3).fill(' ').join('');
    const dividerStart = new Array(padding).fill('─').join('');
    const dividerEnd = new Array(length).fill('─').join('');

    const dividerUp = dividerStart + '┬' + dividerEnd;
    const dividerDown = dividerStart + '┴' + dividerEnd;

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
        let r = prefix + pad(padding, String(i)) + '  │ ' + row;

        if (r.length >= max) {
            r = r.slice(0, max - 3) + '...';
        }

        l = l > r.length ? l : r.length;

        return r;
    }).join('\n');

    l = l >= process.stdout.columns ? process.stdout.columns : l;
    return [l, t, padding + 2];
}
