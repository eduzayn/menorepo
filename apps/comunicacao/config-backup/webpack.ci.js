module.exports = {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimize: true,
  },
  performance: {
    hints: 'error',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
}; 