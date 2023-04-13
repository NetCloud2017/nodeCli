const semver = require("semver");

module.exports = function checkNode(minNodeVersion) {
  let nodeVersion = semver.valid(semver.coerce(process.version));
  return semver.satisfies(nodeVersion, ">=" + minNodeVersion);
};
