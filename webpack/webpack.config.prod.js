import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import AssetsPlugin from 'assets-webpack-plugin';

const root = process.cwd();
const clientInclude = [path.join(root, 'src', 'client'), path.join(root, 'src', 'universal'),/joi/, /isemail/, /hoek/, /topo/];

const vendor = [
  'react',
  'react-dom',
  'react-router',
  'react-redux',
  'redux',
  'redux-logger',
  'redux-thunk',
  'redux-optimist',
  'redux-form',
  'regenerate',
  'material-ui'
];

const prefetches = [
  'react-dnd/lib/index.js',
  'joi/lib/index.js',
  'universal/containers/Kanban/KanbanContainer.js'
]

const prefetchPlugins = prefetches.map(specifier => new webpack.PrefetchPlugin(specifier));

const babelQuery = {
  "env": {
    "production": {
      "plugins": [
        ["transform-decorators-legacy"]
      ]
    }
  }
}

export default {
  context: path.join(__dirname, "..", "src"),
  entry: {
    app: ['babel-polyfill', 'client/client.js']
    //vendor
  },
  output: {
    // https://github.com/webpack/webpack/issues/1752
    filename: '[name].js',
    chunkFilename: '[name].[hash].js',
    path: path.join(root, 'build'),
    publicPath: '/static/'
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader',
        include: clientInclude
      }, {
        test: /\.txt$/,
        loader: 'raw-loader',
        include: clientInclude
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader?limit=10000',
        include: clientInclude
      }, {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader',
        include: clientInclude
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name].[local].[hash:base64:5]!postcss'),
        include: clientInclude
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: clientInclude,
        query: babelQuery
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.css', {allChunks: false}),
    //new webpack.optimize.CommonsChunkPlugin({
    //  name: "vendor",
    //  minChunks: Infinity
    //}),
    new webpack.optimize.UglifyJsPlugin({compressor: {warnings: false}}),
    new AssetsPlugin({
      path: path.join(root, 'build'),
      filename: 'assets.json',
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      "__CLIENT__": true,
      "process.env.NODE_ENV": JSON.stringify('production')
    }),

  ],
  resolve: {
    extensions: ['', '.js'],
    root: path.join(root, 'src')
  },
  // used for joi validation on client
  node: {
    dns: 'mock',
    net: 'mock'
  },
  postcss: [
    require('postcss-modules-values')
  ]
};
