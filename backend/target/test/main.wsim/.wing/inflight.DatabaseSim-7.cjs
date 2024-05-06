"use strict";
const $helpers = require("@winglang/sdk/lib/helpers");
module.exports = function({ $PgUtil }) {
  class DatabaseSim {
    constructor({ $this_connection }) {
      this.$this_connection = $this_connection;
    }
    async connectionOptions() {
      return this.$this_connection;
    }
    async query(query) {
      return (await $PgUtil._query(query, this.$this_connection));
    }
  }
  return DatabaseSim;
}
//# sourceMappingURL=inflight.DatabaseSim-7.cjs.map