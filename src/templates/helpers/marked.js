const marked = require('marked');
const fs = require('fs');
const { resolve } = require('path');

module.exports = function renderMarkdown(file, options) {
    const mdStr = fs.readFileSync(
        resolve(
            __dirname,
            '../contents/' + (file.endsWith('.md') ? file : file + '.md')
        ),
        {
            encoding: 'utf8',
        }
    );
    return marked(mdStr);
};
