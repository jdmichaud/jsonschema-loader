/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author jean.daniel.michaud@gmail.com
*/
const fs = require('fs');
const path = require('path');
const loaderUtils = require('loader-utils');
const schemaCompiler = require('json-schema-to-typescript');

module.exports = function loader(content) {
  const callback = this.async();
  const contentStr = content.toString('utf-8');
  if (this.cacheable) this.cacheable();

  // For ts-loader (or any typescript loader) to accept the file, we need to
  // change its extension to .ts
  const rawFilePath = path.normalize(this.resourcePath);
  this.resourcePath = `${rawFilePath.slice(0, rawFilePath.lastIndexOf('.'))}.ts`;

  // Convert schema to JS object
  const schema = JSON.parse(contentStr);
  // compile from file
  schemaCompiler.compile(schema)
    .then(ts => callback(null, ts))
    .catch((err) => {
      console.error('exception:', err);
      callback(err);
    });
};
module.exports.raw = true;
