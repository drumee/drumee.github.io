---
sidebar_position: 3
title: Plugins
description: Extend Drumee with your own backend services without modifying the core
---

# Plugins

Drumee is designed to be extended through plugins. A plugin is an independent Node.js package that adds new backend services to a Drumee instance without modifying the core `server-team` codebase.

> "Add tailored plugins to meet your own requirements. No need to develop boilerplates like identity management - extend while reusing the same infrastructure."

Plugins follow the same ACL + service architecture as built-in modules. Once registered on an endpoint, a plugin's services are callable through the standard service routing convention, scoped to that endpoint.

---

## Plugin vs Core Service

| | Core service | Plugin |
|---|---|---|
| Location | `server-team/service/` | `/srv/drumee/runtime/plugins/server/<user>/<plugin>/` |
| Service URL | `/-/svc/module.method` | `/-/<endpoint>/svc/module.method` |
| Deployment | Part of the main server | Registered independently per endpoint |
| Hot-reload | Server restart required | `Acl.loadPlugins(true)` on signal |

---

## Plugin Structure

A plugin is a Node.js package with the same structure as any Drumee service module:

```
my-plugin/
  acl/
    mymodule.json       # ACL configuration for the plugin's services
  service/
    private/
      mymodule.js       # Service implementation
  index.js              # Plugin entry point
  package.json
```

The `package.json` must include the following scripts:

```json
{
  "scripts": {
    "register-plugin": "drumee-server-plugin add",
    "remove-plugin":   "drumee-server-plugin remove",
    "dev":             "drumee-server-devel",
    "deploy":          "drumee-server-deploy"
  }
}
```

---

## Development Workflow

### 1. Configure the sync target

Create `.dev-tools.rc/devel.sh` in your plugin directory. This file must not be committed — add `.dev-tools.rc/` to your `.gitignore`.

```bash
user=<your-username>
export DEST_HOST=drumee.in
export DEST_USER=$user
export DEST_DIR=/srv/drumee/runtime/plugins/server/$user/<plugin-name>
export ENDPOINT=$user
```

### 2. Sync to the server

From your plugin directory:

```bash
npm run dev
```

This syncs the local files to `DEST_DIR` on the target server.

### 3. Register the plugin on the server

SSH into the server and register:

```bash
ssh drumee.in
cd /srv/drumee/runtime/plugins/server/<user>/<plugin-name>
sudo npm run register-plugin -- --endpoint=<user>
```

### 4. Start the endpoint services

```bash
sudo drumee start <user>
sudo drumee start <user>/service
```

### 5. Verify in the frontend

Reload the browser, open the developer console, and check for the plugin module:

```js
SERVICE.<module-name>
// Should display the registered service methods as functions
```

If the module appears, the plugin is correctly registered and running.

---

## Plugin Service URL

Plugin services are scoped to their endpoint, so the URL differs from core services:

```
# Core service
https://hostname/-/svc/module.method

# Plugin service
https://hostname/-/<endpoint>/svc/module.method
```

---

## Managing Plugins

### Remove a plugin

```bash
cd /srv/drumee/runtime/plugins/server/<user>/<plugin-name>
sudo npm run remove-plugin -- --endpoint=<user>
```

### View logs

```bash
sudo drumee log <user>/service
```

### Restart a plugin service

```bash
sudo drumee restart <user>/service
```

---

## How the Server Loads Plugins

The service runner (`service.js`) calls `Acl.loadPlugins()` at startup to discover and register all installed plugins. On receiving a reload signal, it calls `Acl.loadPlugins(true)` to hot-reload plugins without restarting the full server process.

```js
// From service.js
await Acl.loadPlugins();

configs.handleSignals(async () => {
  await Acl.loadPlugins(true);
});
```

This means plugin updates can be applied without a full service restart by sending the appropriate signal to the process.

---

## See Also

- [Own Cloud](./own-cloud.md) — server management commands and file structure
- [Creating a Service](../guides/creating-service.md) — how to implement a service following the ACL pattern
- [ACL Field Specification](../api-reference/acl-spec.md) — ACL JSON field reference