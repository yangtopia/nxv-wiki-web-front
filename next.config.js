const path = require('path');
const withSass = require('@zeit/next-sass');
const pkg = require('./package.json');
const isDevEnv = process.env.NODE_ENV !== 'production';

const { parsed: parsedEnv } = require('dotenv').config({
  path: isDevEnv ? './.env.dev' : './.env.prod',
});

module.exports = withSass({
  env: {
    NXV_ENV: {
      ...parsedEnv,
      BASE_DOMAIN: process.env.BASE_DOMAIN || parsedEnv.process.env.BASE_DOMAIN,
      FIREBASE_ARTICLE_COLLECTION_NAME:
        process.env.FIREBASE_ARTICLE_COLLECTION_NAME ||
        parsedEnv.process.env.FIREBASE_ARTICLE_COLLECTION_NAME,
      APP_VERSION: pkg.version,
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });

    config.module.rules.push({
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        configFile: path.resolve(__dirname, '.babelrc'),
      },
      include: [
        path.resolve(__dirname, 'node_modules/crypto-random-string'),
        path.resolve(__dirname, 'node_modules/markdown-it-texmath'),
        path.resolve(__dirname, 'node_modules/markdown-it-toc-done-right'),
        path.resolve(__dirname, 'node_modules/markdown-it-multimd-table'),
        path.resolve(__dirname, 'node_modules/markdown-it-auto-parnum'),
        path.resolve(__dirname, 'node_modules/markdown-it-attrs'),
        path.resolve(__dirname, 'node_modules/markdown-it-video'),
      ],
    });

    return config;
  },
});
