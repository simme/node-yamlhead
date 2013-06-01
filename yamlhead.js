//
// # YAMLHead
//

//
// ## Dependencies
//
// For subclassing.
var inherit = require('util').inherits;
// Subclasses Stream.
var Stream  = require('stream').Stream;
// For parsing YAML.
var yaml    = require('js-yaml');
// For reading files.
var fs      = require('fs');

//
// ## Constructor
//
// Subclass Stream and make readable.
//
var YAMLHead = function (path, options, callback) {
  Stream.call(this);
  this.readable = true;
  this.writable = true;
  this.callback = typeof options === 'function' ? options : callback;
  this.options  = typeof options === 'object'   ? options : null;
  this.path     = path;
  this.header   = false;
  this.data     = '';
  this._sep     = /(\s*?\-+\s*\n)/g;
  this._ended   = false;
  this._err     = false;

  fs.createReadStream(this.path, this.options).pipe(this);
};
inherit(YAMLHead, Stream);

//
// ## Write
//
// Stream API implementation. When reading from the target file this function
// gets called.
//
YAMLHead.prototype.write = function(data) {
  this.data += data;
  // Check for YAML header separator.
  if (!this.header) {
    // Handle Jekyll-style triple dashes at the beginning of the file
    if (this.data.substr(0, 4) === "---\n") {
      this.data = this.data.substr(4);
    }
    var pos = this.data.search(this._sep);
    if (pos !== -1) {
      try {
        var matches = this.data.match(this._sep);
        var header = this.data.substr(0, pos);
        this.data = this.data.substr(pos + matches[0].length);
        this.header = yaml.load(header);
        this.emit('header', this.header);
        this.emit('data', this.data);
      }
      catch (err) {
        this._err = err;
        if (this.callback) {
          this.callback(err);
        }
        else {
          this.emit('error', err);
        }
        this.end();
        this.emit('end');
      }
    }
  }
  else {
    this.emit('data', data);
  }
};

//
// ## End
//
// Stream API implementation. When reading from the target file is done
// `.pipe()` will call this function. Kinda.
//
YAMLHead.prototype.end = function() {
  if (this._ended) return;
  this._ended = true;
  this.emit('end');
  if (this.callback && !this._err) {
    this.callback(null, this.header, this.data);
  }
};

//
// ## Public API
//
// The function you will actually call when requiring YAMLHead.
//
module.exports = function (path, options, callback) {
  return new YAMLHead(path, options, callback);
};

