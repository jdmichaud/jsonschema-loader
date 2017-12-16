/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author jean.daniel.michaud@gmail.com
*/
var fs = require('fs');
var loaderUtils = require('loader-utils');
var schemaCompiler = require('json-schema-to-typescript');

module.exports = function (content) {
  var callback = this.async();
  content = content.toString('utf-8');
  if (this.cacheable) this.cacheable();

  // Convert schema to JS object
  let schema = JSON.parse(content);
  // compile from file
  schemaCompiler.compile(schema)
    .then(ts => callback(null, ts))
    .catch(err => {
      console.error('exception:', e);
      callback(e);
    });
};
module.exports.raw = true;
