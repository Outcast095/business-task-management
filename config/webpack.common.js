/// это файл 'webpack.common.js
/// он расположен по адресу config/webpack.common.js


import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import Dotenv from 'dotenv-webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: path.resolve(__dirname, '../src/client/index.tsx'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js', 
    publicPath: '/',              
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    // Вот эта часть уже делает то, что вы хотели — настраивает пути для Webpack
    alias: { '@': path.resolve(__dirname, '../src') }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: { 
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, '../src/client/index.html') }),
    new ForkTsCheckerWebpackPlugin(),
    new Dotenv({
      path: path.resolve(__dirname, '../.env'), 
      safe: true,
      systemvars: true
    }),
  ],

};