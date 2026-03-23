///файл /webpack.dev.js
///файл расположен по адресу config/webpack.dev.js

import { merge } from 'webpack-merge';
import common from './webpack.common.js';

export default merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,

    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:5000',
      },
    ],
  },
  module: {
  rules: [
    {
  test: /\.(s[ac]ss|css)$/i,
  use: [
    'style-loader', 
    {
      loader: 'css-loader',
      options: {
        esModule: false, // ВАЖНО: отключаем обертку в .default
        modules: {
          auto: true, 
          localIdentName: '[name]__[local]--[hash:base64:5]',
          exportLocalsConvention: 'camelCase', // Позволяет писать styles.taskCard вместо styles['task-card']
        },
      },
    },
    'sass-loader',
  ],
}
  ]
}
});