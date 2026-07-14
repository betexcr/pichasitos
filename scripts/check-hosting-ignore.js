#!/usr/bin/env node
/**
 * Assert production Hosting denylist includes must-not-ship paths.
 */
const fs = require('fs');
const path = require('path');

const firebasePath = path.join(__dirname, '..', 'firebase.json');
const cfg = JSON.parse(fs.readFileSync(firebasePath, 'utf8'));
const ignore = (cfg.hosting && cfg.hosting.ignore) || [];

const required = ['test.html', 'preview.html', '**/*.metadata.json', 'tools/**', 'external/**'];
const missing = required.filter((item) => !ignore.includes(item));

if (missing.length) {
  console.error('firebase.json hosting.ignore missing required entries:');
  missing.forEach((m) => console.error('  -', m));
  process.exit(1);
}

console.log('hosting ignore check OK:', required.join(', '));
