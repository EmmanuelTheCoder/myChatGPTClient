"use strict";
const $helpers = require("@winglang/sdk/lib/helpers");
module.exports = function({ $PgUtil }) {
  class DatabaseNeon {
    constructor({ $this_connection }) {
      this.$this_connection = $this_connection;
    }
    async connectionOptions() {
      return this.$this_connection;
    }
    async query(query) {
      return (await $PgUtil._query(query, (await this.connectionOptions())));
    }
  }
  return DatabaseNeon;
}
//# sourceMappingURL=inflight.DatabaseNeon-7.cjs.map