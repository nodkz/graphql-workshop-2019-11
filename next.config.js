const withCSS = require('@zeit/next-css');

if (typeof require !== 'undefined') {
  require.extensions['.css'] = (file) => {};
}

const config = withCSS();

module.exports = config;
