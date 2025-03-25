const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base');

module.exports = (env, argv) => {
  const mode = argv.mode || 'development';
  
  let config;
  switch (mode) {
    case 'production':
      config = require('./webpack.prod');
      break;
    case 'staging':
      config = require('./webpack.staging');
      break;
    case 'test':
      config = require('./webpack.test');
      break;
    case 'ci':
      config = require('./webpack.ci');
      break;
    default:
      config = require('./webpack.dev');
  }

  return merge(baseConfig, config);
}; 