---
title: Internal handbook
date: 2026-09-11
description: Example of a Hugo page that is gated by Auth.js.
index: false
sitemap:
  disable: true
---

This page is produced by Hugo like any other, then gated by Auth.js.

To protect another section, add its path to `PROTECTED_PATHS` in `.env` (for example `/members,/staff`) and create matching Hugo content.
