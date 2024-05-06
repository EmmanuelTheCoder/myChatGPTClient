"use strict";
var $handler = undefined;
exports.handler = async function(event) {
  $handler = $handler ?? (new ((function(){
return class Handler {
  constructor(clients) {
    for (const [name, client] of Object.entries(clients)) {
      this[name] = client;
    }
  }
  async handle() { 
        return this.value;
      }
};
})())({
value: process.env["WING_TOKEN_WSIM_ROOT_ENV0_DATABASE_DATABASESIM_STATE_ATTRS_PORT"]
}));
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
