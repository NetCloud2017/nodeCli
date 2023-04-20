const Service = require("../service/Service");

module.exports = async function build(opts, cmd) {
   const args = {
      customWebpackPath: opts.customWebpackPath,
      stopBuild: opts.stopBuild,
      config: opts.config,
   };
   process.env.NODE_ENV = "production";

   const service = new Service("build", args);
   service.build();
};
