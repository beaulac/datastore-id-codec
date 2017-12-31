#!/usr/bin/env node
'use strict';
const idCodec = require('.').base32;
const argv = process.argv;

const id = argv.pop();
if (argv.includes('-e')) {
    process.stdout.write(idCodec.encode(id));
} else if (argv.includes('-d')) {
    process.stdout.write(idCodec.decode(id).toString());
} else {
    process.stderr.write('Usage: base32.codec [-d] [-e] ID');
}

process.stdout.write('\n');
