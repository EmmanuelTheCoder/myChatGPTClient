"use strict";
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// target/main.wsim/.wing/handler_c89283d4.sandbox.cjs
var $handler = void 0;
exports.handler = async function(event) {
  $handler = $handler ?? new (/* @__PURE__ */ function() {
    return class Handler {
      static {
        __name(this, "Handler");
      }
      constructor(clients) {
        for (const [name, client] of Object.entries(clients)) {
          this[name] = client;
        }
      }
      async handle() {
        return this.value;
      }
    };
  }())({
    value: process.env["WING_TOKEN_WSIM_ROOT_DEFAULT_DATABASE_DATABASESIM_STATE_ATTRS_PORT"]
  });
  return await $handler.handle(event);
};
process.setUncaughtExceptionCaptureCallback((reason) => {
  process.send({ type: "reject", reason });
});
process.on("message", async (message) => {
  const { fn, args } = message;
  const value = await exports[fn](...args);
  process.send({ type: "resolve", value });
});
//# sourceMappingURL=index.cjs.map
