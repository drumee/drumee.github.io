---
sidebar_position: 1
---

# Introduction to Drumee

Drumee is a Meta Operating System designed for building sovereign, scalable web applications.

## What is Drumee?

Drumee provides three integrated pillars:

1. **Identity & Access Control (Built-In)**
   - Automatic user-ID tagging for all requests
   - Role-based permissions enforced at microservice level
   - Extensible and flexible rules

2. **Secure Filesystem (Linux-Inspired)**
   - Isolated volumes with POSIX-style permissions
   - Atomic API for uploads/downloads/move/delete/copy/update
   - Prevents directory traversal and permission leaks

3. **LETC Engine (JSON UI)**
   - Zero HTML processing on server-side
   - Define UIs as JSON trees
   - Extend with custom widgets

## Quick Start

```bash
# Deploy with Docker
docker run -p 8080:80 drumee/bundle:latest

# Or install Debian package
sudo dpkg -i drumee-bundle.deb
