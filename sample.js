var gm = require('gm');

gm('/path/to/image.jpg')
.resize(353, 257)
.autoOrient()
.write(writeStream, function (err) {
  if (!err) console.log(' hooray! ');
});
