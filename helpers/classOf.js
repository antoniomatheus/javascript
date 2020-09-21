// Works on es6
function classOf(o) {
  return Object.prototype.toString.call(o).slice(8, -1);
}

/**
 * Example:
 * class Range {
 *  get [Symbol.toStringTag]() { return "Range"; }
 * }
 */
