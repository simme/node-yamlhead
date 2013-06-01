//
// # Test YAMLHead
//

var assert   = require('assert');
var yamlhead = require('./../yamlhead');

suite('YAMLHead', function () {
  test('Parses simple header correctly.', function (done) {
    yamlhead(__dirname + '/test.md', function (err, yaml, data) {
      assert.equal(yaml.title, 'YAMLHead Rocks');
      assert.equal(yaml.tags.length, 5);
      done();
    });
  });

  test('Parses header with weird separator.', function (done) {
    yamlhead(__dirname + '/inconsistentheader.md', function (err, yaml, data) {
      assert.equal(yaml.title, 'weird divider');
      assert.equal(data, 'foo\n\n');
      done();
    });
  });

  test('Streams data and header.', function (done) {
    var file = yamlhead(__dirname + '/test.md');
    var header, buff = '';
    file.on('header', function (yaml) {
      header = yaml;
    });
    file.on('data', function (data) {
      buff += data;
    });
    file.on('end', function () {
      assert.equal(header.title, 'YAMLHead Rocks');
      assert.equal(buff, 'Here is a random string.\n\n');
      done();
    });
  });

  test('Passing options to streams work.', function (done) {
    var file = yamlhead(__dirname + '/test.md', {encoding: 'utf-8', bufferSize: 32});
    var header, buff = '';
    file.on('header', function (yaml) {
      header = yaml;
    });
    file.on('data', function (data) {
      buff += data;
    });
    file.on('end', function () {
      assert.equal(header.title, 'YAMLHead Rocks');
      assert.equal(buff, 'Here is a random string.\n\n');
      done();
    });
  });

  test('Invalid YAML triggers error callback.', function (done) {
    var foo = yamlhead(__dirname + '/invalid.md', function (err, yaml, data) {
      assert(err);
      done();
    });
  });

  test('Handles Jekyll files.', function (done) {
    yamlhead(__dirname + '/jekyllstyle.md', function (err, yaml, data) {
      assert.equal(yaml.title, 'This is Jekyll-style');
      assert.equal(data, 'Here is the content.');
      done();
    });
  });
});

