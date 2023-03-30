class Service {
  constructor(props) {
    this.args = props;
    this.config = {};
    this.hooks = {};
  }
  async start() {
    console.log("启动服务");
    this.resolveConfig();
  }
  resolveConfig() {}
}

module.exports = Service;
