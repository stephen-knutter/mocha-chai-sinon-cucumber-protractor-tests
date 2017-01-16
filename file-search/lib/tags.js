exports = module.exports = {};

exports.parse = function(args, defaults, replacements) {
  var options = {};
  if (typeof defaults === "object" && !(defaults instanceof Array)) {
    options = defaults;
  }

  if (typeof replacements === "object" && !(defaults instanceof Array)) {
    for (let i in args) {
      let arg = args[i];
      if (arg.charAt(0) === "-" && arg.charAt(1) != "-") {
        arg = arg.substr(1);
        if (arg.indexOf("=") !== -1) {
          arg = arg.split("=");
          let keys = arg.shift();
          let value = arg.join("=");

          arg = keys.split("");
          let key = arg.pop();
          if (replacements.hasOwnProperty(key)) {
            key = replacements[key];
          }
          args.push("--" + key + "=" + value);
        } else {
          arg = arg.split("");
        }

        arg.forEach(function(key) {
          if (replacements.hasOwnProperty(key)) {
            key = replacements[key];
          }
          args.push("--" + key);
        });
      }
    }
  }

  for (let i in args) {
    let arg = args[i];

    // Check if Long formed tag
    if (arg.substr(0, 2) === "--") {
      arg = arg.substr(2);

      // Check for equals sign
      if (arg.indexOf("=") !== -1) {
        arg = arg.split("=");
        let key = arg.shift();
        let value = arg.join("=");
        if (/^[0-9]+$/.test(value)) {
          value = parseInt(value, 10);
        }
        options[key] = value;
      } else {
        options[arg] = true;
      }
    }
  }
  return options;
};
