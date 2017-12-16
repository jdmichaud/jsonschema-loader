const should = require('should');
const path = require('path');
const loader = require('../');
const schemaCompiler = require('json-schema-to-typescript');
const fs = require('fs');

function run(resourcePath, query, _content, expected, callback) {
  const content = _content || Buffer.from('{}');
  const context = {
    resourcePath: resourcePath,
    query: `?${query}`,
    options: {
      context: '/this/is/the/context',
    },
    async: callback,
  };

  const result = loader.call(context, content);
}

function check(err, result, expected, context, done) {
  if (err) { done(err); return; }
  should(result).be.eql(expected);
  context.resourcePath.slice(context.resourcePath.lastIndexOf('.')).should.be.eql('.ts');
  done();
}

function test(expected, resourcePath, query, content, done) {
  return run(resourcePath, query, content, expected, function asynch() {
    const that = this;
    return function callback(err, result) {
      check(err, result, expected, that, done);
    };
  });
}

describe('jsonschema-loader', () => {
  it('should return the result of json-schema-to-typescript on the provided schema', (done) => {
    const content = fs.readFileSync('test/example.schema.json').toString();
    const filename = 'example.schema.json';
    schemaCompiler.compile(JSON.parse(content)).then((ts) => {
      test(ts, filename, '', content, done);
    });
  });
  it('should accept buffer as content', (done) => {
    const content = fs.readFileSync('test/example.schema.json');
    const filename = 'example.schema.json';
    schemaCompiler.compile(JSON.parse(content.toString())).then((ts) => {
      test(ts, filename, '', content, done);
    });
  });
});
