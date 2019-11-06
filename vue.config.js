const path = require('path')
const WebpackAssetsManifest = require('webpack-assets-manifest')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  lintOnSave: false,
  outputDir: '_site/packs',
  publicPath: '/packs',
  indexPath: 'tmp/index.html',
  filenameHashing: true,
  productionSourceMap: false,
  css: {
    extract: false
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': './webpack'
      }
    },

    entry: {
      app: './webpack/assets/stylesheets/app.scss'
    },
    output: {
      filename: 'javascripts/[name].[hash].js',
      chunkFilename: 'javascripts/[name].[chunkhash].js'
    },

    plugins: [
      new WebpackAssetsManifest({
        entrypoints: true,
        publicPath: true,
        output: path.resolve(__dirname, 'source', '_data', 'manifest.json'),
      }),
      new MiniCssExtractPlugin({
        filename: 'stylesheets/[name].[hash].css',
        chunkFilename: 'stylesheets/[name].[chunkhash].css',
        ignoreOrder: false
      })
    ],

    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          include: [
            path.resolve(__dirname, 'webpack/assets/stylesheets/')
          ],
          use: [
            { loader: MiniCssExtractPlugin.loader },
            { loader: 'css-loader', options: {url: true}},
            { loader: 'sass-loader'},
          ]
        },
        {
          test: /\.(jpe?g|png|gif)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'img/[name].[hash].[ext]'
              }
            }
          ]
        }
      ]
    }
  },
  chainWebpack: config => {
    //not used at vue cli base rules images
    //https://cli.vuejs.org/guide/webpack.html#replacing-loaders-of-a-rule
    const imagesRule = config.module.rule('images')
    imagesRule.uses.clear()

    // dont generate index.html
    config.plugins.delete('html')
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
  }
}
