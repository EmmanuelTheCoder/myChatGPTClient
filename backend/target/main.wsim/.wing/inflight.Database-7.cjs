"use strict";
const $helpers = require("@winglang/sdk/lib/helpers");
module.exports = function({  }) {
  class Database {
    constructor({ $this_inner }) {
      this.$this_inner = $this_inner;
    }
    async query(query) {
      return (await this.$this_inner.query(query));
    }
    async connectionOptions() {
      return (await this.$this_inner.connectionOptions());
    }
  }
  return Database;
}
//# sourceMappingURL=inflight.Database-7.cjs.map