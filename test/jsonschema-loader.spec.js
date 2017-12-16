const should = require('should');
const path = require('path');
const loader = require('../');
const schemaCompiler = require('json-schema-to-typescript');
const fs = require('fs');

function run(resourcePath, query, _content, expected, done) {
  const content = _content || Buffer.from('{}');
  const context = {
    resourcePath: resourcePath,
    query: `?${query}`,
    options: {
      context: '/this/is/the/context',
    },
    async: function async() {
      return function callback(err, result) {
        if (err) {
          done(err);
        }
        try {
          should(result).be.eql(expected);
          done();
        } catch (testAssertionError) {
          done(testAssertionError);
        }
      };
    },
  };

  const result = loader.call(context, content);
  return result;
}

function test(expected, resourcePath, query, content, done) {
  if (typeof done === 'function') {
    return run(resourcePath, query, content, expected, done);
  }
  return run(resourcePath, query, content, expected).should.equal(expected);
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
