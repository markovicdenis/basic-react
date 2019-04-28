const dev = process.env.NODE_ENV !== "production"
const webpack = require('webpack')
const path = require("path")
const {
  BundleAnalyzerPlugin
} = require("webpack-bundle-analyzer")
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");

const plugins = [
  new FriendlyErrorsWebpackPlugin(),
  new webpack.DefinePlugin({
    "NODE_ENV": JSON.stringify(process.env.NODE_ENV || 'development'),
  })
]

if (false) {
  plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: "static",
    reportFilename: "webpack-report.html",
    openAnalyzer: false,
  }))
  // plugins.push(new DuplicatePackageCheckerPlugin())
}

if (true) {
  plugins.push(new HtmlWebpackPlugin(
    Object.assign({}, {
      title: 'hey',
      inject: true,
      template: path.join(__dirname, 'public/template.html'),
      filename: 'index.html'
    },
    false ? {
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    } :
      undefined
    )
  ))
  plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = {
  mode: dev ? "development" : "production",
  context: path.join(__dirname, ""),
  // devtool: dev ? "cheap-module-eval-source-map" : "none",
  devtool: "source-map", // dev ? "source-map" : "none",
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    // hot: true,
    inline: true,
    // compress: true,
    port: 3300
  },
  entry: {
    // app: ["babel-polyfill", "./client.ts"],
    index: './dist/index.js'
  },
  resolve: {
    modules: [
      path.resolve("./src"),
      "node_modules",
    ],
    symlinks: false,
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },
  module: {
    rules: [{
      test: /\.js?$/,
      exclude: /node_modules\/(?!(my-react-bootstrap|ANOTHER-ONE)\/).*/,
      // exclude: /(node_modules|bower_components)/,
      // include: [
      //   path.resolve(__dirname, "node_modules/my-react-bootstrap")
      // ],
      use: [
        "source-map-loader"
      ],
      enforce: "post"
    },
    // {
    //   test: /\.js?$/,
    //   exclude: /(node_modules|bower_components)/,
    //   use: [{
    //     loader: 'babel-loader',
    //     options: {
    //       presets: [
    //         ['@babel/env', {
    //           "targets": {
    //             "browsers": ["> 10%"]
    //           }
    //         }], // '@babel/react'
    //       ],
    //       "plugins": ["react-hot-loader/babel"]
    //     }
    //   },
    //   "source-map-loader"
    //   ]
    // },
    {
      test: /\.tsx?$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'ts-loader',
      }
    },
    {
      test: /\.scss$/,
      use: [{
        loader: 'style-loader',
        // loader: MiniCssExtractPlugin.loader,
        // options: {
        // 	publicPath: "../styles/"
        // }
      }, {
        loader: 'css-loader',
        options: {
          sourceMap: true
        }
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: true
        }
      }]
    }
    ],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    chunkFilename: '[name].js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          chunks: 'all',
          test: /node_modules/
        }
      }
    }
  },
  plugins
}