---
sidebar_position: 1
title: Overview
description: General principles and technical architecture of Drumee
---

# General Principles

## Technical Architecture

Drumee is built around four main pillars:

- Identity Management (access control)
- File System Management (fine-grain privilege control)
- Pure client-server architecture (JSON-based UI rendering engine)
- Objectified database

![Drumee Rendering Engine](../../static/img/letc.png)

## Access Control

Who are you and what do you want? Drumee exposes a restful micro-service endpoint. Each service is assigned a required privilege (permission). A service request will only be executed if the caller's privilege matches the service permission requirement.

## File System Management

Unlike standard applications, Drumee does not rely on the host file system directly. In a conventional setup, the entire host file system is exposed to threats that may pass through the application. MFS (Meta File System) is an API layer that makes file system handling safer, easier, more flexible, scalable, and powerful.

![MFS principle](../../static/img/mfs.png)

## User Interface Rendering Engine

LETC (Limitlessly Extensible Tree Components) is a declarative UI framework where user interfaces are represented as JSON trees. Each node in the tree corresponds to a UI component or widget.

Most web frameworks face a structural conflict: HTML is by design a server-side language, yet the user interface is a client-side concern. Common approaches either generate HTML on the server (consuming server resources for a task the client could do) or bundle JavaScript on the server side (mixing frontend and backend code in a way that degrades readability and increases security surface).

Drumee resolves this with LETC. Instead of generating HTML or executing UI logic on the server, Drumee returns pure JSON data. The LETC renderer on the client reads the JSON tree, resolves each node to a registered widget, and renders the interface. The server stays focused on data processing; the client handles all rendering.

[Discover LETC](https://drumee.com/-/#/sandbox)