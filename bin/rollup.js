const { devConfig } = require("./rollup.config");
const rollup = require("rollup");

async function devRollup(entry) {
  const option = devConfig(entry);
  const bundle = await rollup.rollup(option);
  const { code, map } = await bundle.generate(option.output);
  await bundle.write(option.output);
}

module.exports = {
  devRollup,
};
