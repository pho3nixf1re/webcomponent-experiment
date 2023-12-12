import path from 'node:path'
import { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import 'webpack-dev-server'

const dirname = new URL('.', import.meta.url).pathname

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [
        ['postcss-pxtorem', { rootValue: 16, propList: ['*'] }],
        'autoprefixer',
      ],
    },
  },
}

const config: Configuration = {
  entry: './src/app-root.ts',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
    module: true,
    scriptType: 'module',
    publicPath: '/',
  },
  experiments: {
    outputModule: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(ico|png|jpe?g|gif|svg|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts',
            },
          },
        ],
      },
      {
        oneOf: [
          {
            assert: { type: 'css' },
            use: [
              {
                loader: 'css-loader',
                options: {
                  exportType: 'css-style-sheet',
                },
              },
              postcssLoader,
            ],
          },
          {
            test: /\.css$/i,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    auto: true,
                    localIdentName: '[name]__[local]--[hash:base64:5]',
                  },
                },
              },
              postcssLoader,
            ],
          },
        ],
      },
    ],
  },
  devServer: {
    static: './dist',
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
}

export default config
