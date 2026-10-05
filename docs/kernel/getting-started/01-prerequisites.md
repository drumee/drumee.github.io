---
id: prerequisites
title: Prerequisites
slug: /kernel/getting-started/prerequisites
sidebar_position: 1
description: Verified requirements for developing and running the current Minimal Kernel integration environment.
---

# Prerequisites

There are two distinct environments:

- The extracted npm packages require **Node.js 18 or newer**. Their lockfiles and tests use npm, but no minimum npm version is declared.
- The only verified end-to-end environment is the Linux/Docker harness in `drumee/transient`. Its image uses Node 22 and its prerequisite check accepts Node 18 or newer on the host.

## Verified integration requirements

- Linux;
- Node.js 18+ and npm;
- Docker Engine available to the current user;
- Docker Compose plugin and Docker buildx;
- `curl`;
- at least 3 GiB of free disk space in the `transient` checkout;
- network access to obtain `node:22-bookworm-slim`, `mariadb:11.4`, `redis:7.4-alpine`, and npm dependencies when not cached.

The harness starts disposable MariaDB 11.4 and Redis 7.4 containers, an Nginx/Node Kernel container, and a private Docker network. MariaDB and Redis are not exposed on host ports. The HTTP endpoint defaults to `127.0.0.1:28642`.

No local DNS edit is required for the default status and Hello checks. The generated integration configuration uses `kernel.test`; browser cross-origin tests introduce controlled test hostnames internally. Production DNS, TLS, email, backup, and upgrade procedures are outside this onboarding path.

## Configuration inputs

The scripts define test-safe defaults in `scripts/test-env/kernel/lib.sh`. Relevant overrides include `KERNEL_HTTP_PORT`, `KERNEL_SCHEMA_MODE` (`clean` or `upgrade`), container/network names constrained to `transient-*`, runtime source paths, and WebSocket allowed origins. Database passwords in that file are disposable test credentials and must not be reused.

Browser-level package tests use Chromium. The Window Manager test finds a local Chrome/Chromium executable; the Finder browser integration also depends on Chrome DevTools Protocol support.

## Check the host

From `drumee/transient`:

```bash
scripts/test-env/kernel/check.sh
```

This command was verified against the current checkout. It validates the tools, disk space, required pinned source inputs, and runtime schema manifests without starting the environment.

