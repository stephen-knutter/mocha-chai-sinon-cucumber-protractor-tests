const expect = require("chai").expect;
const tags = require("../lib/tags");

describe("Tags", function() {
  describe("#parse()", function() {
    it("should parse long formed tags and convert numbers", function() {
      let args = ["--depth=4", "--hello=world"];
      let results = tags.parse(args);

      expect(results).to.have.a.property("depth", 4);
      expect(results).to.have.a.property("hello", "world");
    });

    it("should fallback to defaults", function() {
      let args = ["--depth=4", "--hello=world"];
      let defaults = {depth: 2, foo: "bar"};
      let results = tags.parse(args, defaults);

      var expected = {
        depth: 4,
        foo: "bar",
        hello: "world"
      };

      expect(results).to.deep.equal(expected);
    });

    it("should accept tags without values as a bool", function() {
      let args = ["--searchContents"];
      let results = tags.parse(args);

      expect(results).to.have.a.property("searchContents", true);
    });

    it("should accept short formed tags", function() {
        let args = ["-sd=4", "-h"];
        let replacements = {
          s: "searchContents",
          d: "depth",
          h: "hello"
        };

        let results = tags.parse(args, {}, replacements);

        let expected = {
          searchContents: true,
          depth: 4,
          hello: true
        };

        expect(results).to.deep.equal(expected);
    });

  });
});
