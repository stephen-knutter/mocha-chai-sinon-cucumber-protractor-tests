const fs = require("fs");

exports = module.exports = {};

exports.scan = function(dir, depth, done) {
  depth--;
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          if (depth !== 0) {
            let ndepth = (depth > 1) ? depth-1 : 1;
            exports.scan(file, ndepth, function(err, res) {
              results = results.concat(res);
              next();
            });
          } else {
            next();
          }
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

exports.match = function(query, files) {
  let matches = [];
  files.forEach((name) => {
    if (name.indexOf(query) !== -1) {
      matches.push(name);
    }
  });
  return matches;
}
