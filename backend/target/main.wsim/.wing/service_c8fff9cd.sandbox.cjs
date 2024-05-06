      "use strict";
      let $stop;
      exports.start = async function() {
        if ($stop) {
          throw Error('service already started');
        }
        const client = await 
          (await (async () => {
            const $Closure1Client = 
          require("C:/Users/loyal/Desktop/codingProject/assistant/backend/target/main.wsim/.wing/inflight.$Closure1-7.cjs")({
            $PgUtil: 
      require("C:/Users/loyal/Desktop/codingProject/assistant/backend/target/main.wsim/.wing/inflight.PgUtil-7.cjs")({
      })
    ,
            $_helpers_unwrap_container_hostPort_: process.env["WING_TOKEN_WSIM_ROOT_DEFAULT_DATABASE_DATABASESIM_CONTAINER_ATTRS_HOST_PORT"],
            $state: (function() {
  let handle = process.env.STATE_HANDLE_9cbb3066;
  if (!handle) {
    throw new Error("Missing environment variable: STATE_HANDLE_9cbb3066");
  }
  const simulatorUrl = process.env.WING_SIMULATOR_URL;
  if (!simulatorUrl) {
    throw new Error("Missing environment variable: WING_SIMULATOR_URL");
  }
  const caller = process.env.WING_SIMULATOR_CALLER;
  if (!caller) {
    throw new Error("Missing environment variable: WING_SIMULATOR_CALLER");
  }
  return require("@winglang/sdk/lib/simulator/client").makeSimulatorClient(simulatorUrl, handle, caller);
})(),
            $util_Util: require("C:/Users/loyal/AppData/Roaming/npm/node_modules/winglang/node_modules/@winglang/sdk/lib/util/util.js").Util,
          })
        ;
            const client = new $Closure1Client({
            });
            if (client.$inflight_init) { await client.$inflight_init(); }
            return client;
          })())
        ;
        const noop = () => {};
        $stop = (await client.handle()) ?? noop;
      };

      exports.stop = async function() {
        if (!$stop) {
          throw Error('service not started');
        }
        await $stop();
        $stop = undefined;
      };
      
process.setUncaughtExceptionCaptureCallback((reason) => {
  process.send({ type: "reject", reason });
});

process.on("message", async (message) => {
  const { fn, args } = message;
  const value = await exports[fn](...args);
  process.send({ type: "resolve", value });
});
