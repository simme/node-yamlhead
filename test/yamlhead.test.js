//
// # Test YAMLHead
//

var assert   = require('assert');
var yamlhead = require('./../yamlhead');

suite('YAMLHead', function () {
  test('Parses simple header correctly.', function (done) {
    yamlhead(__dirname + '/test.md', function (err, yaml, data) {
      assert(yaml.title, 'YAMLHead Rocks');
      assert(yaml.tags.length, 5);
      done();
    });
  });

  test('Parses header with weird separator.', function (done) {
    yamlhead(__dirname + '/inconsistentheader.md', function (err, yaml, data) {
      assert(yaml.title, 'weird divider');
      assert(data, 'foo\n');
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
      assert(header.title, 'YAMLHead Rocks');
      assert(buff, '\nHere is a random string.\n');
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
      console.log('hey');
    });
    file.on('end', function () {
      assert(header.title, 'YAMLHead Rocks');
      assert(buff, '\nHere is a random string.\n');
      done();
    });
  });
});

