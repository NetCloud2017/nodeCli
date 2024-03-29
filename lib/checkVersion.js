const semver = require("semver");

module.exports = function checkVersion(minimum_version) {
  const userNodeVersion = semver.valid(semver.coerce(process.version));
  return semver.satisfies(userNodeVersion, ">=" + minimum_version);
};
