---
id: run-the-kernel
title: Run the Kernel
slug: /kernel/getting-started/run-the-kernel
sidebar_position: 3
description: The smallest verified end-to-end Minimal Kernel launch path.
---

# Run the Kernel

The smallest verified end-to-end path currently uses the `transient` integration harness. There is no released standalone installer that assembles only npm packages. The harness also uses private integration modules and its default runtime copies under `target/foundation`; use it as developer validation, not as a production deployment recipe.

## 1. Obtain the integration repository

```bash
git clone https://github.com/drumee/transient.git
cd transient
```

The repository contains pinned source evidence required by the image build. A shallow selection of only `target/` is insufficient.

## 2. Validate prerequisites

```bash
scripts/test-env/kernel/check.sh
```

## 3. Start and inspect

```bash
scripts/test-env/kernel/up.sh
scripts/test-env/kernel/status.sh
```

Observable state:

- `GET http://127.0.0.1:28642/-/svc/kernel.status` returns a successful Kernel status envelope;
- the UI runtime and Hello plugin indices are served;
- MariaDB contains the intrinsic runtime schema and bootstrapped identities;
- Redis responds and the push router is configured.

Call the anonymous Hello service:

```bash
curl --fail --silent --show-error \
  --header 'content-type: application/json' \
  --data '{}' \
  http://127.0.0.1:28642/-/svc/hello.ping
```

The response contains `status: "ok"` and `data.message: "Hello from Drumee"`.

## 4. Stop the disposable environment

```bash
scripts/test-env/kernel/down.sh
```

For a one-command build, launch, assertion, binary data-plane check, and cleanup:

```bash
scripts/test-env/kernel/test.sh
```

This exact command was verified for this documentation. It checks service and plugin routes, Yellow Page domain ACL, Redis, streamed binary upload, and Nginx delivery, then removes the three disposable containers and network.

## What this path proves—and does not

It proves the integrated runtime can start, bootstrap identity/session state, dispatch a capability, serve its frontend bundle, route push traffic, and keep large binary delivery outside bounded JSON control requests. It does not prove production hardening, a supported upgrade policy, a public Finder package, or a standalone npm-only assembly.

