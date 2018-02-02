'use strict';
const codec = require('..').base32;
const assert = require('assert');

function validRepresentationsOf(int) {
    return [int, `${int}`, { value: `${int}` }];
}

describe('base32 output', function () {
    it('passes sanity check', function () {

        const exponent = Math.ceil(Math.random() * 10) + 21;
        const value = Math.floor(Math.random() * 10000) * Math.pow(2, exponent);

        validRepresentationsOf(value).forEach(
            v => assert.strictEqual(codec.decode(codec.encode(v)), value));
    });
});
