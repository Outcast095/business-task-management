/// это файл 'webpack.prod.js
/// он расположен по адресу config/webpack.prod.js

import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import path from 'path';

export default merge(common, {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
  },
  optimization: {
    minimizer: [`...`, new TerserPlugin(), new CssMinimizerPlugin()],
    splitChunks: { chunks: 'all' }
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'assets/styles/[name].[contenthash].css' }),
    new ESLintPlugin({
      extensions: ['ts', 'tsx'],
      overrideConfigFile: path.resolve(process.cwd(), '.eslintrc.cjs'),
    })
  ],
  module: {
    rules: [
      {
        test: /\.(s[ac]ss|css)$/i,
        use: [
          MiniCssExtractPlugin.loader, 
          {
            loader: 'css-loader',
            options: {
              esModule: false, // ДОБАВИТЬ ЭТО
              modules: {
                auto: true,
                localIdentName: '[hash:base64:8]',
                exportLocalsConvention: 'camelCase', // ДОБАВИТЬ ЭТО
              },
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      }
    ]
  }
});