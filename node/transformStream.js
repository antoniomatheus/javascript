const stream = require("stream");

class GrepStream extends stream.Transform {
  constructor(pattern) {
    super({ decodeStrings: false });
    this.pattern = pattern;
    this.incompleteLine = "";
  }

  _transform(chunk, encoding, callback) {
    if (typeof chunk !== "string") {
      callback(new Error("Expected a string bug got a buffer"));
      return;
    }

    let lines = (this.incompleteLine + chunk).split("\n");
    this.incompleteLine = lines.pop();

    let output = lines.filter((l) => this.pattern.test(l)).join("\n");

    if (output) {
      output += "\n";
    }

    callback(null, output);
  }

  _flush(callback) {
    if (this.pattern.test(this.incompleteLine)) {
      callback(null, this.incompleteLine + "\n");
    }
  }
}

let pattern = new RegExp(process.argv[2], process.argv[3]);
process.stdin
  .setEncoding("utf8")
  .pipe(new GrepStream(pattern))
  .pipe(process.stdout)
  .on("error", () => process.exit());
