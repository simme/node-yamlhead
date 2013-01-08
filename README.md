YAMLHead
--------

Read YAML-headers from random files.

# Installation

`npm install yamlhead`

# Usage

Suppose you have a Markdown file similiar to those found in Jekyll.

```
title: Cool Blog Post About Cats
tags: [foo, bar, cat, horse, js]
category: Cats

---

# Cool Blog Post About Cats

I recenly came across a cool cat named Arthus. He has a moustache and yellow
**paws**.

Yaddayada lorem ipsum dolor _site_ prosit.
```

Now suppose you would like to extract that YAML header and separate it from
the rest of the contents.

```js
var yamlhead = require('yamlhead');
var md       = require('discount');
yamlhead('path/to/file.md', function (err, yaml, data) {
  if (err) {
    console.log('Something went terribly wrong during parsing.');
  }

  console.log(yaml.title); // -> "Cool Blog Posts About Cats"
  console.log(md.parse(data));
});
```

Very simple!

# Streams!!

What would a node module be without streams!? `yamlhead()` returns a stream
object!

```js
var yamlhead = require('yamlhead');
// Optional second arg is an object the options passed to `fs.crateReadStream()`
var stream = yamlhead('file.md', {stream: 'options'});
stream.on('header', function (header) {
  console.log(header); // <- Parsed YAML header
});
stream.on('data', function (data) {
  console.log(data.toString()); // <- The rest of the file comes in data events
});
stream.on('end', function () {
  console.log('Read entire file!!');
});
stream.on('error', function (err) {
  console.log(err); // <- YAML parse error most likely, unless path was invalid
});
```

# License

ISC

