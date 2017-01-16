const expect = require("chai").expect;
const search = require("../lib/search");
const fs = require("fs");

describe("Search", function() {
  describe("#scan()", function() {
    before(function() {
      if (!fs.existsSync(".test_files")) {
        fs.mkdirSync(".test_files");
        fs.writeFileSync(".test_files/a", "");
        fs.writeFileSync(".test_files/b", "");
        fs.mkdirSync(".test_files/dir");
        fs.writeFileSync(".test_files/dir/c", "");
        fs.mkdirSync(".test_files/dir2");
        fs.writeFileSync(".test_files/dir2/d", "");
      }
    });
    after(function() {
      fs.unlinkSync(".test_files/dir/c");
      fs.rmdirSync(".test_files/dir");
      fs.unlinkSync(".test_files/dir2/d");
      fs.rmdirSync(".test_files/dir2");
      fs.unlinkSync(".test_files/a");
      fs.unlinkSync(".test_files/b");
      fs.rmdirSync(".test_files");
    });

    it("should retrieve the files from a directory", function(done) {
      search.scan(".test_files", 0, function(err, flist) {
        expect(flist).to.deep.equal([
          ".test_files/a",
          ".test_files/b",
          ".test_files/dir/c",
          ".test_files/dir2/d"
        ]);
        done();
      });
    });
  });

  describe("#match()", function() {
    it("should find and return matches based on a query", function() {
      let files = ["hello.txt", "world.js", "another.js"];
      let results = search.match(".js", files);
      expect(results).to.deep.equal(["world.js", "another.js"]);

      results = search.match("hello", files);
      expect(results).to.deep.equal(["hello.txt"]);
    });
  });
});
