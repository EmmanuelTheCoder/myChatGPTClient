"use strict";
const $helpers = require("@winglang/sdk/lib/helpers");
module.exports = function({  }) {
  class PgUtil {
    constructor({  }) {
    }
    static async _query(query, creds) {
      return (require("@winglibs/postgres/pg.js")["_query"])(query, creds)
    }
    static async isPortOpen(port) {
      return (require("@winglibs/postgres/util.ts")["isPortOpen"])(port)
    }
  }
  return PgUtil;
}
//# sourceMappingURL=inflight.PgUtil-7.cjs.map