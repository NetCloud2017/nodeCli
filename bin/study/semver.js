const semver = require("semver");

// 这俩工作是标准的
console.log(semver.valid("1.2.3")); // '1.2.3'
console.log(semver.valid("v1.2.3")); // '1.2.3'

console.log(semver.valid("1.2")); // 'null'
console.log(semver.valid("a.b.c")); // null

console.log(semver.clean("  =v1.2.3   ")); // '1.2.3'
console.log(semver.clean("  >v1.2.3   ")); // null
console.log(semver.clean("  <v1.2.3   ")); // null

console.log(semver.satisfies("1.2.3", "1.x || >=2.5.0 || 5.0.0 - 7.2.3")); // true
// 判断一个范围
console.log(semver.validRange("5.2.3", "5.0.0 - 7.2.3")); // true

// 版本比对大小
console.log(semver.gt("1.2.3", "9.8.7")); // false 大于
console.log(semver.lt("1.2.3", "9.8.7")); // true 小于

//
let minVersion = "2.1.23";
console.log(semver.minVersion(">=" + minVersion).version); // '2.1.23' 返回最新的版本

// 将版本号转换成标准的版本号
console.log(semver.valid(semver.coerce("v2"))); // '2.0.0'
console.log(semver.valid(semver.coerce("42.6.7.9.3-alpha"))); // '42.6.7'
