---
id: application-qualification
title: IL-5 Application Qualification
slug: /kernel/distribution/application-qualification
sidebar_position: 5
description: Immutable source identities, real acceptance evidence, historical CI debt and review boundaries for the minimal-application distribution.
---

# Minimal-application qualification and integration

IL-5.9-B records **READY_FOR_OWNER_MERGE_DECISION** for the explicitly selected
Debian application profile. The real integration runs were performed on
2026-10-18; closing CI and documentation readback were completed on 2026-10-19.
This page summarizes those records. It does not claim a fresh deployment run
or general production support. Use the
[application operator guide](/getting-started/minimal-application) to build a
private runtime behind an existing host HTTPS proxy.

## Source identities and integration state

| Component | Immutable reference |
|---|---|
| Debian executable/build qualification | `ccaa839bf13ab163025e868b21f16516c87d1ff9` |
| Debian closing documentation/delivery | `490c4b0a28ffb35da6ff248402139b5f600c793f` |
| Consumed Infra Layer source | `aa9057f224f4ae5cf80d777e3cb2fad092193fb1` |
| Prior IL-5 consumer source, retained as history | `c6ef6e9b8d33921ffa39c289490067adfc63a8b0` |
| Published Server Runtime | `@drumee/server-runtime@0.1.0-alpha.4` |

The later Debian delivery changes documentation/evidence only relative to the
executable acceptance source. minimal-kernel locks, shared operator dispatch,
Runtime host/health scripts and historical profiles remain unchanged.

As observed on **2026-10-19**, [Debian PR #7](https://github.com/drumee/debian/pull/7)
is merged into **feat/container-distribution**, while
[Infra PR #2](https://github.com/drumee/infra-layer/pull/2) remains open into main.
The intended review order recorded by IL-5 was Infra first, then Debian; the
current PR states are an independently observed integration event, not evidence
that this order was completed. No Debian-main convergence or Infra merge is
inferred. The source pin still names the exact qualified bytes. Owner review of
the remaining integration/security conditions and any future publication remain
separate operations.

## Source archive versus npm candidate

Debian uses this immutable source archive:

```text
https://codeload.github.com/drumee/infra-layer/tar.gz/aa9057f224f4ae5cf80d777e3cb2fad092193fb1
```

| Artifact | Measured identity |
|---|---|
| GitHub source SHA256 | `b33e5ba7946b73701b05365c637f5153e9ddb860efe0074821d86161dd1466d2` |
| GitHub source SRI | `sha512-faoNlMWBO05FM+ozsuGu9tqFgq/IYc9WJwb4KCyZcZiTlEIrgJ9QLqLxslTADdipaItg02r2f6qFG07HDxhVqA==` |
| Local npm alpha.3 candidate SHA256 | `7385ee7acbc6582746b2f8d8713ce174f7136e7531e7e57221df06a15c906a75` |
| Local npm alpha.3 candidate SRI | `sha512-ZZIxqtHsFA0tCwAR6vcGa3iOttFYTkHCS4rKN4UtPApLPDkq41FJ0xJWKfWLEWVUlvM3JZldb1aGrhyKMiM9Pw==` |

The source archive has 260 safe members and 225 tracked files verified against
Git objects. Packing its extraction reproduces the qualified npm candidate:
40 allowed files, 98,808 bytes packed, no production npm dependencies. Compared
with IL-5.8's executable source f91253c, only package.json differs among the 40
members; the changes concern development tooling/scripts. Public exports,
declarations and shipped executable files are unchanged.

The two SRIs identify different artifacts. npm alpha.3 is not the selected
registry dependency; a future source-to-npm migration needs explicit publication,
selection and requalification. Published alpha.2 does not contain the application
contract, while published alpha.1 lacks the qualified lifecycle APIs. The
[IL-4 release record](/kernel/distribution/qualification) remains unchanged for
minimal-kernel and its published alpha.2 context.

## Results, counted separately

| Verification | Recorded result |
|---|---|
| Debian application TAP | 8 passed, no final failure/skip |
| Minimal-kernel targeted TAP | 15 passed, no final failure/skip |
| Plugin archive Python tests | 8 passed |
| Shared Debian suite | 331 checks passed |
| Real clean-clone application acceptance | 126 functional assertions in 10 groups, passed |
| Isolated npm consumer | 8 assertions, actual idempotent preparation and strict NodeNext types passed |
| Independent LAN observations | Accessible nonce witness; runtime connection refused from testbox |
| New Chromium scenarios | 0; earlier kernel browser evidence is retained, not rerun |

Counts overlap in purpose and are not combined into an aggregate score. The
126 counter includes ownership/cleanup assertions. The retained historical
minimal-kernel evidence is 260 functional assertions, 3 Chromium scenarios and
16 SQL negative cases, not new runs of this application profile. Infra's 161 TAP
and its earlier gateway/services/lifecycle results belong to the owning Infra
qualification, not a fresh site-documentation execution.

Actual application acceptance covers native public RPC and protected 403,
Docker/host loopback publication, independent LAN denial, external native Nginx
with verified CA/SAN, stop/start/restart, real SIGKILL and explicit recovery,
failed startup, compatible rollback, isolated no-SMTP restoration and ownership
refusals. The base deployment has only the application service.

SMTP/DKIM acceptance covers mandatory STARTTLS, valid trust and invalid TLS-name
refusal, SASL/open-relay negatives, actual private DKIM networking, no host mail
publication, queued-message and secret preservation, optional versus required
readiness and `SMTP_RECOVERY_UNQUALIFIED`. The queued message uses capture mode
and reserved `.invalid` addresses; Internet delivery and spool restoration are
not qualified.

## Image identity and reproducibility limits

Two builds on the qualified host produce identical receipts and image IDs:

| Acceptance artifact | Identity |
|---|---|
| Runtime application image | `sha256:d44327e37d37c612257822684a870d05d7f90fdae649b2dcbfb8e9f0566e7955` |
| Canonical native tools image | `sha256:075a3c53d14f9a71c827f285564518dde41e29faa0cc9e58f4cc126cd3dda4cd` |

These are local acceptance artifacts with a disposable plugin, not published
images or Oxy-form images. Inspection compared all 35 Runtime package files,
host/health/plugin bytes and provenance labels. Infra Layer runs in the host
operator dependency, not inside the application image; its source identity is
checked before building. Infra and ESLint development modules are absent from
the production application image.

This establishes same-host repeatability with Docker cache. It does not promise
cache-free, cross-machine, future APT mirror or filesystem-timestamp
reproducibility. Temporary qualification paths and local image availability are
not installation dependencies; committed receipts preserve their identities.

## CI and security reservations

[Final Debian CI, run 39222614639](https://github.com/drumee/debian/actions/runs/39222614639),
on delivery 490c4b0:

| Job | Actual conclusion |
|---|---|
| minimal-application-contract | SUCCESS |
| suite | SUCCESS |
| packaging | FAILURE: 10 checks pass, 2 historical violations |
| lint | FAILURE: 91 historical ShellCheck diagnostics |

The two packaging violations concern legacy Team base images without digests
and global PM2 installation. ShellCheck 0.11.0 reports 20 errors and 71 warnings
on the same 121-file scope as the baseline, with no added diagnostic. The checks
remain enabled and failing; old defects are not represented as successful tests.
The owning follow-ups are Debian historical distribution compliance and shell
hardening. Review must explicitly account for those debts.

Infra Layer's qualified GitHub chain includes CodeQL, ESLint, dependency checks,
contracts, unit tests and package verification. The observed CodeQL PR result
reports no new alerts in changed code, not a repository-wide zero-alert claim.
External SonarCloud still reports a failed gate; accepted local false-positive
decisions are not asserted to have been applied in SonarCloud. Its administrative
cleanup is separate from Debian's source realignment. Branch protections were
not modified; limited administrative API visibility is recorded in the owning
reports. Mergeability alone does not authorize integration.

## Evidence and future consumers

- [Immutable source selection](https://github.com/drumee/debian/blob/490c4b0a28ffb35da6ff248402139b5f600c793f/docs/IL-5.9-B-source-selection.md).
- [Consumer change inventory](https://github.com/drumee/debian/blob/490c4b0a28ffb35da6ff248402139b5f600c793f/docs/IL-5.9-B-consumer-realignment.md).
- [Complete qualification and failed-attempt history](https://github.com/drumee/debian/blob/490c4b0a28ffb35da6ff248402139b5f600c793f/docs/IL-5.9-B-qualification.md).
- [Acceptance and artifact receipts](https://github.com/drumee/debian/tree/490c4b0a28ffb35da6ff248402139b5f600c793f/docs/evidence/IL-5.9-B).
- [Oxy-form handoff](https://github.com/drumee/debian/blob/490c4b0a28ffb35da6ff248402139b5f600c793f/docs/IL-5.7-oxy-form-handoff.md).
- [Infra GitHub-security qualification](https://github.com/drumee/infra-layer/blob/aa9057f224f4ae5cf80d777e3cb2fad092193fb1/docs/IL-5.9-A-qualification.md).

Oxy-form still needs explicit selection of the compatible distribution and its
own plugin, proxy/certificates, upstream TLS/submission secrets, authorized
sender, controlled inboxes and SPF/DKIM/DMARC/reception/bounce evidence. This page
does not declare OF-01R accepted or resumed. Oxymotion D0, Hub/MFS/Finder,
crawling and agentic qualifications are separate and are not established here.
