let tags = require("./lib/tags");
let search = require("./lib/search");

let defaults = {
  path: ".",
  query: "",
  depth: 2
}

let replacements = {
  p: "path",
  q: "query",
  d: "depth",
  h: "help"
}

tags = tags.parse(process.argv, defaults, replacements);

if (tags.help) {
  console.log("Usage: ./app.js -q=query [-d=depth] [-p=path]");
} else {
  search.scan(tags.path, tags.depth, function(err, files) {
    search.match(tags.query, files).forEach(function(file) {
      console.log(file);
    });
  });
}
