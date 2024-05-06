"use strict";
const $stdlib = require('@winglang/sdk');
const std = $stdlib.std;
const $helpers = $stdlib.helpers;
const $extern = $helpers.createExternRequire(__dirname);
const aws = $stdlib.aws;
const cloud = $stdlib.cloud;
const http = $stdlib.http;
const util = $stdlib.util;
const sim = $stdlib.sim;
const ui = $stdlib.ui;
const constructs = require("constructs");
const cdktf = require("cdktf");
const rawNeon = require("@rybickic/cdktf-provider-neon");
const tfaws = require("@cdktf/provider-aws");
class Database extends $stdlib.std.Resource {
  constructor($scope, $id, props) {
    super($scope, $id);
    const target = (util.Util.env("WING_TARGET"));
    if ($helpers.eq(target, "sim")) {
      const sim = new DatabaseSim(this, "DatabaseSim", props);
      this.connection = sim.connection;
      this.inner = sim;
    }
    else if ($helpers.eq(target, "tf-aws")) {
      const neon = new DatabaseNeon(this, "DatabaseNeon", props);
      this.connection = neon.connection;
      this.inner = neon;
    }
    else {
      throw new Error(("Unsupported target: " + target));
    }
  }
  static _toInflightType() {
    return `
      require("${$helpers.normalPath(__dirname)}/inflight.Database-7.cjs")({
      })
    `;
  }
  _toInflight() {
    return `
      (await (async () => {
        const DatabaseClient = ${Database._toInflightType()};
        const client = new DatabaseClient({
          $this_inner: ${$stdlib.core.liftObject(this.inner)},
        });
        if (client.$inflight_init) { await client.$inflight_init(); }
        return client;
      })())
    `;
  }
  get _liftMap() {
    return ({
      "query": [
        [this.inner, ["query"]],
      ],
      "connectionOptions": [
        [this.inner, ["connectionOptions"]],
      ],
      "$inflight_init": [
        [this.inner, []],
      ],
    });
  }
}
class DatabaseSim extends $stdlib.std.Resource {
  constructor($scope, $id, props) {
    super($scope, $id);
    const image = String.raw({ raw: ["postgres:", ""] }, (props.pgVersion ?? 15));
    const container = this.node.root.new("@winglang/sdk.sim.Container", sim.Container, this, "Container", { name: "postgres", image: image, env: ({"POSTGRES_PASSWORD": "password"}), containerPort: 5432, volumes: ["/var/lib/postgresql/data"] });
    const state = this.node.root.new("@winglang/sdk.sim.State", sim.State, this, "State");
    this.port = (state.token("port"));
    const __parent_this_1 = this;
    class $Closure1 extends $stdlib.std.AutoIdResource {
      _id = $stdlib.core.closureId();
      constructor($scope, $id, ) {
        super($scope, $id);
        $helpers.nodeof(this).hidden = true;
      }
      static _toInflightType() {
        return `
          require("${$helpers.normalPath(__dirname)}/inflight.$Closure1-7.cjs")({
            $PgUtil: ${$stdlib.core.liftObject(PgUtil)},
            $_helpers_unwrap_container_hostPort_: ${$stdlib.core.liftObject($helpers.unwrap(container.hostPort))},
            $state: ${$stdlib.core.liftObject(state)},
            $util_Util: ${$stdlib.core.liftObject($stdlib.core.toLiftableModuleType(util.Util, "@winglang/sdk/util", "Util"))},
          })
        `;
      }
      _toInflight() {
        return `
          (await (async () => {
            const $Closure1Client = ${$Closure1._toInflightType()};
            const client = new $Closure1Client({
            });
            if (client.$inflight_init) { await client.$inflight_init(); }
            return client;
          })())
        `;
      }
      get _liftMap() {
        return ({
          "handle": [
            [$helpers.unwrap(container.hostPort), []],
            [PgUtil, ["isPortOpen"]],
            [state, ["set"]],
          ],
          "$inflight_init": [
            [$helpers.unwrap(container.hostPort), []],
            [PgUtil, []],
            [state, []],
          ],
        });
      }
    }
    this.node.root.new("@winglang/sdk.cloud.Service", cloud.Service, this, "Service", new $Closure1(this, "$Closure1"));
    this.connection = ({"host": "localhost", "password": "password", "database": "postgres", "user": "postgres", "port": this.port, "ssl": false});
    this.node.root.new("@winglang/sdk.ui.ValueField", ui.ValueField, this, "ValueField", "Postgres Port", this.port);
  }
  static _toInflightType() {
    return `
      require("${$helpers.normalPath(__dirname)}/inflight.DatabaseSim-7.cjs")({
        $PgUtil: ${$stdlib.core.liftObject(PgUtil)},
      })
    `;
  }
  _toInflight() {
    return `
      (await (async () => {
        const DatabaseSimClient = ${DatabaseSim._toInflightType()};
        const client = new DatabaseSimClient({
          $this_connection: ${$stdlib.core.liftObject(this.connection)},
        });
        if (client.$inflight_init) { await client.$inflight_init(); }
        return client;
      })())
    `;
  }
  get _liftMap() {
    return ({
      "connectionOptions": [
        [this.connection, []],
      ],
      "query": [
        [PgUtil, ["_query"]],
        [this.connection, []],
      ],
      "$inflight_init": [
        [PgUtil, []],
        [this.connection, []],
      ],
    });
  }
}
class DatabaseNeon extends $stdlib.std.Resource {
  constructor($scope, $id, props) {
    super($scope, $id);
    (this.neonProvider());
    const project = this.node.root.new("@rybickic/cdktf-provider-neon.project.Project", rawNeon.project.Project, this, "Project", { name: props.name, historyRetentionSeconds: (std.Duration.fromSeconds(86400)).seconds, pgVersion: (props.pgVersion ?? 16) });
    const db = this.node.root.new("@rybickic/cdktf-provider-neon.database.Database", rawNeon.database.Database, this, "Database", { projectId: project.id, branchId: project.defaultBranchId, ownerName: project.databaseUser, name: props.name });
    this.connection = ({"database": project.databaseName, "host": project.databaseHost, "password": project.databasePassword, "port": "5432", "ssl": true, "user": project.databaseUser});
  }
  neonProvider() {
    const stack = (cdktf.TerraformStack.of(this));
    const singletonKey = "WingNeonProvider";
    const existing = (stack.node.tryFindChild(singletonKey));
    if (((existing) != null)) {
      return existing;
    }
    return ($scope => $scope.node.root.new("@rybickic/cdktf-provider-neon.provider.NeonProvider", rawNeon.provider.NeonProvider, $scope, singletonKey))(stack);
  }
  static _toInflightType() {
    return `
      require("${$helpers.normalPath(__dirname)}/inflight.DatabaseNeon-7.cjs")({
        $PgUtil: ${$stdlib.core.liftObject(PgUtil)},
      })
    `;
  }
  _toInflight() {
    return `
      (await (async () => {
        const DatabaseNeonClient = ${DatabaseNeon._toInflightType()};
        const client = new DatabaseNeonClient({
          $this_connection: ${$stdlib.core.liftObject(this.connection)},
        });
        if (client.$inflight_init) { await client.$inflight_init(); }
        return client;
      })())
    `;
  }
  get _liftMap() {
    return ({
      "connectionOptions": [
        [this.connection, []],
      ],
      "query": [
        [PgUtil, ["_query"]],
        [this, ["connectionOptions"]],
      ],
      "$inflight_init": [
        [PgUtil, []],
        [this.connection, []],
      ],
    });
  }
}
class PgUtil extends $stdlib.std.Resource {
  constructor($scope, $id, ) {
    super($scope, $id);
  }
  static _toInflightType() {
    return `
      require("${$helpers.normalPath(__dirname)}/inflight.PgUtil-7.cjs")({
      })
    `;
  }
  _toInflight() {
    return `
      (await (async () => {
        const PgUtilClient = ${PgUtil._toInflightType()};
        const client = new PgUtilClient({
        });
        if (client.$inflight_init) { await client.$inflight_init(); }
        return client;
      })())
    `;
  }
  get _liftMap() {
    return ({
      "$inflight_init": [
      ],
    });
  }
  static get _liftTypeMap() {
    return ({
      "_query": [
      ],
      "isPortOpen": [
      ],
    });
  }
}
module.exports = { Database };
//# sourceMappingURL=preflight.lib-9.cjs.map