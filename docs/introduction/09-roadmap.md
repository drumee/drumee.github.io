---
id: 09-roadmap
title: Road Map
slug: /introduction/09-roadmap
---

# Roadmap

Drumee's roadmap is driven by one principle: **sovereignty first, usability second, extensibility third.** We ship when it works, not when it looks good on a slide.

## Current State (May 2026)

| Capability | Status | Notes |
| :---- | :---- | :---- |
| Self-hosted deployment | ✅ Production ready | Deploys in < 10 minutes |
| SaaS deployment | ✅ Live | [app.drumee.org](http://app.drumee.org) |
| File storage + collaboration suite | ✅ Production ready | Both SaaS and self-hosted |
| Euro Office integration | ✅ Ready | Ships with self-hosted via plugin |
| Plugin system (architecture) | ✅ Production ready | New plugins take days to add |
| SaaS data portability (→ self-hosted) | 🔄 Final development | Days away |
| Database layer (Notion-like, SaaS) | 🔄 In development | Weeks |
| Diagram editor plugin | 🔄 In development | Weeks |
| SaaS app marketplace | 📋 Planned | See M2 below |
| Planner plugin | 📋 Planned | Months |

---

## Technical Milestones

Five milestones take Drumee from a solid self-hosted platform to a federated, AI-capable, enterprise-ready ecosystem. M1 and M3 run in parallel on dedicated teams. M2, M4, and M5 start as their dependencies are met.

### Timeline Overview

| Milestone | Start | Target | Duration |
| :---- | :---- | :---- | :---- |
| **M1** Migration & Admin Tools | Jun 2026 | Aug 2026 | 2 months |
| **M3** Midnight Integration | Jun 2026 | Feb 2028 | 20 months |
| **M2** Marketplace | Aug 2026 | Aug 2027 | 12 months |
| **M4** AI Integration | Jan 2027 | Nov 2027 | 10 months |
| **M5** Enterprise & Collaboration | Aug 2026 | May 2027 | 10 months |
| **Full platform** | — | **Feb 2028** | ~20 months |

---

### M1 — Migration & Admin Tools
**Jun 2026 → Aug 2026**

Make Drumee operational for real teams. Self-hosted needs to be deployable, maintainable, and manageable by someone who isn't a developer.

| Step | Dates | Description |
| :---- | :---- | :---- |
| 1. Drumee CLI | Jun–Sep 2026 | Command-line tool for node, domain, user, and plugin administration. Full MFS filesystem commands (`ls`, `cp`, `mv`, `rm`, `mkdir`). Import from Google Drive, Dropbox, Nextcloud, OneDrive; bulk CSV user import. Tab completion, JSON output, idempotent operations. |
| 2. Backup & Restore | Aug–Oct 2026 | One-click full backup (database + MFS + config), scheduled automated backups, incremental and encrypted backups, selective restore, multiple destinations (local, S3, SFTP, external drive). |
| 3. Admin Dashboard | Oct–Dec 2026 | Web UI replacing SSH: node health, user management, storage usage, plugin management, log viewer, SSL status, update management with rollback. |
| 4. Monitoring & Alerting | Nov 2026–Jan 2027 | Health checks for all services, disk space monitoring, auto-restart, email notifications, Prometheus/Grafana integration, brute force detection. |
| 5. Maintenance Automation | Jan–Mar 2027 | Automated updates with rollback, database maintenance, log rotation, trash expiry, SSL auto-renewal, maintenance mode with user notifications. |

---

### M2 — Marketplace
**Aug 2026 → Aug 2027**

Turn Drumee from a fixed feature set into a platform where developers build, distribute, and monetize extensions. Starts after M1 Admin Dashboard is stable.

| Step | Dates | Description |
| :---- | :---- | :---- |
| Plugin Packaging Standard | Aug–Sep 2026 | Formal manifest format, semantic versioning, dependency resolution, backward compatibility guarantees. |
| Developer Portal | Sep–Nov 2026 | Plugin submission, SDK documentation, testing sandbox, build CLI tools, API key management, community forum. |
| Plugin Registry Service | Nov 2026–Jan 2027 | Central backend for plugin discovery and distribution: CRUD API, version tracking, cryptographic signing. |
| Plugin Manager UI | Jan–Mar 2027 | In-app marketplace browser, one-click install/uninstall, configuration panel, conflict resolution. |
| Plugin Sandbox & Security | Mar–Jun 2027 | Permission system, user-granted permissions at install, resource limits, audit log, automated security scanning, crash isolation. |
| Monetization | Jun–Aug 2027 | Payment gateway (Stripe, crypto), free/paid/subscription models, revenue sharing, enterprise licensing. |


### M3 — AI Integration (Privacy-First, On-Premises)
**Jan 2027 → Nov 2027**

Intelligent automation, search, and assistance without compromising data sovereignty. All AI capabilities are opt-in, run locally by default, and never send user data to external models unless explicitly configured.

| Step | Dates | Description |
| :---- | :---- | :---- |
| 1. Local Embedding & Vector Search | Jan–Mar 2027 | Semantic search across files and chat history using on-node embedding models and a local vector database. Natural language queries, admin controls to re-index or purge. |
| 2. Local LLM (BYOM) | Mar–Jun 2027 | Connect to locally hosted models (Ollama, llama.cpp, vLLM). Chat assistant with RAG over workspace content, document summarization, explicit user consent required. |
| 3. External AI Gateway | May–Jul 2027 | Controlled, opt-in gateway to cloud models. Data isolation policies, content filters for PII/secrets, audit log of every external call, default-off. |
| 4. AI-Assisted Administration | Jul–Sep 2027 | Anomaly detection in logs, intelligent backup scheduling, natural language admin queries, automated plugin/security patch suggestions. |
| 5. User-Controlled AI Permissions | Sep–Oct 2027 | Per-user opt-in, per-workspace toggle, AI usage dashboard with redaction, right-to-deletion for prompt history and vector contributions. |
| 6. Model & Pipeline Transparency | Oct–Nov 2027 | Model manifest, swap mechanism, RAG pipeline explanation, dry-run mode showing what would be sent before execution. |

---

### M4 — Enterprise Integration & Collaboration Core
**Aug 2026 → May 2027**

The essential productivity and identity features every organisation expects. Delivered as paid plugins — not available in open-source repositories.

| Step | Dates | Description |
| :---- | :---- | :---- |
| 1. Calendar | Aug–Nov 2026 | Shared calendars per workspace, recurring events, invitation workflow, iCalendar import/export, CalDAV sync. Integrated with MFS files, chat threads, and video calls. |
| 2. Contact Manager | Nov 2026–Jan 2027 | Centralised shared contact database, contact groups, vCard/CSV import/export, shared and private address books, REST API. |
| 3. SSO & Enterprise Auth | Jan–May 2027 | SAML 2.0, LDAP/Active Directory, OAuth 2.0, OpenID Connect, SCIM user provisioning, role mapping, JIT provisioning, multi-domain SSO, setup wizard with test/debug UI. |

---

## What We Will Not Build

Drumee will not build features that require compromising the sovereignty principle:

❌ AI training on user data

❌ Third-party analytics embedded in the core product

❌ Advertising or data monetization of any kind

❌ Features that only work when connected to Drumee's cloud

The product moat is the conviction, not the feature list.
