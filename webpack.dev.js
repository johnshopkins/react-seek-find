const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './example/js/index.js',
  output: {
    clean: true,
    path: path.resolve(__dirname, 'example/dist/'),
    // libraryTarget: 'commonjs2',
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    static: {
      directory: path.join(__dirname, 'example'),
    }
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve( __dirname, 'example/index.html' ),
      filename: 'index.html'
    })
  ],
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                mode: "icss",
              },
            },
          },
          'sass-loader'
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
