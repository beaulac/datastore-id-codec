import * as assert from 'assert';
import codec, { dsIdToBuffer } from '../src';

function validRepresentationsOf(int: number) {
    return [int, `${int}`, { value: `${int}` }];
}

describe('base32 DS ID codec', function () {

    it('passes sanity check', function () {

        const exponent = Math.ceil(Math.random() * 10) + 21;
        const value = Math.floor(Math.random() * 10000) * Math.pow(2, exponent);

        validRepresentationsOf(value).forEach(
            v => assert.strictEqual(codec.decode(codec.encode(v)), value),
        );
    });

    describe(' encoding ', function () {
        it('encodes correct values', function () {
            const fixtures: any[] = require('./encoding.fixtures');

            fixtures.forEach(
                ([input, encoded]) => {
                    assert.strictEqual(codec.encode(input), encoded);
                },
            );
        });

        describe(' given invalid input ', function () {
            it('throws error for undefined value', function () {
                try {
                    codec.encode(undefined as any);
                    assert.fail('should fail');
                } catch (e) {
                    assert.strictEqual(e.message, 'Invalid Datastore ID');
                }
            });

            it('throws error for too large numbers', function () {
                try {
                    codec.encode(9999999999999999);
                    assert.fail('should fail');
                } catch (e) {
                    assert.strictEqual(e.message, 'Invalid Datastore ID');
                }
            });

            it('throws error for odd value', function () {
                try {
                    codec.encode(33333333333);
                    assert.fail('should fail');
                } catch (e) {
                    assert.strictEqual(e.message, 'DS ID is not divisible enough');
                }
            });
        });
    });

    describe(' decoding ', function () {
        it('decodes correct values', function () {
            const fixtures: any[] = require('./decoding.fixtures');

            fixtures.forEach(
                ([encoded, decoded]) => {
                    assert.strictEqual(codec.decode(encoded), decoded);
                },
            );
        });

        describe(' given invalid input ', function () {
            it('throws error for undefined value', function () {
                const invalidId = undefined as any;
                try {
                    codec.decode(invalidId);
                    assert.fail('should fail');
                } catch (e) {
                    assert.strictEqual(e.message, `Invalid encoded DS ID: ${invalidId}`);
                }
            });

            it('throws error for invalid base32', function () {
                const invalidId = 'x01';
                try {
                    codec.decode(invalidId);
                    assert.fail('should fail');
                } catch (e) {
                    assert.strictEqual(e.message, `Invalid encoded DS ID: ${invalidId}`);
                }
            });
        });

    });

    describe('converting ID to buffer', function () {

        it('returns expected value', function () {
            const expected = Buffer.from([0x01, 0x00, 0x0b]);
            const actual = dsIdToBuffer(2048);
            assert.strictEqual(
                Buffer.compare(actual, expected),
                0,
            );
        });

    });

});
