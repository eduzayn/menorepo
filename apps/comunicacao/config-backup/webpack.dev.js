module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    static: {
      directory: './public',
    },
    hot: true,
    port: 3000,
    historyApiFallback: true,
    open: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  optimization: {
    minimize: false,
  },
}; 