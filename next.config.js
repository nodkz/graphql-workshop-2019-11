const path = require('path');
const withCSS = require('@zeit/next-css');

if (typeof require !== 'undefined') {
  require.extensions['.css'] = (file) => {};
}

const config = withCSS({
  webpack (config) {
    config.resolve.alias['app'] = path.join(__dirname, 'src');
    return config
  }
});

module.exports = config;
