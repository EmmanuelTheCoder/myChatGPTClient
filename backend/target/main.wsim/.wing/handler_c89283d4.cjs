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
value: process.env["WING_TOKEN_WSIM_ROOT_DEFAULT_DATABASE_DATABASESIM_STATE_ATTRS_PORT"]
}));
  return await $handler.handle(event);
};