import * as base32 from 'base32.js';
import { EncoderOptions } from 'base32.js';
import { intexp } from 'intexp';
import { IdCodec } from './IdCodec';

const encoderOptions: EncoderOptions = { type: 'crockford', lc: false };

const MAX_UINT_16 = 0xFFFF
    , uint16EncodedSize = 2 + 1;

const MAX_UINT_32 = 0xFFFFFFFF
    , uint32EncodedSize = 4 + 1;

export class Base32IntCodec implements IdCodec<number, string> {

    options: EncoderOptions;

    constructor(options: EncoderOptions = {}) {
        this.options = {
            ...encoderOptions,
            ...options
        };
    }

    /**
     * Datastore IDs are always highly divisible by 2.
     * We can exploit this to greatly shorten their encoded length,
     * by factoring out the largest power of 2 it is divisible by.
     *
     * Yes; this is a gross implementation-dependent kludge :)
     *
     * @param {number} id
     * @returns {string}
     */
    public encode(id: number): string {
        const [coefficient, exponent] = intexp(id);
        if (coefficient > MAX_UINT_32) {
            throw Error('DS ID is not divisible enough');
        }

        let buf;
        if (coefficient < MAX_UINT_16) {
            buf = Buffer.allocUnsafe(uint16EncodedSize);
            buf.writeUInt16LE(coefficient, 0);
        } else {
            buf = Buffer.allocUnsafe(uint32EncodedSize);
            buf.writeUInt32LE(coefficient, 0);
        }

        buf.writeUInt8(exponent, buf.length - 1);

        return base32.encode(buf, this.options);
    }

    public decode(encodedId: string): number {
        const buf = base32.decode(encodedId, this.options);

        let coefficient;
        switch (buf.length) {
        case (uint16EncodedSize):
            coefficient = buf.readUInt16LE(0);
            break;
        case (uint32EncodedSize):
            coefficient = buf.readUInt32LE(0);
            break;
        default:
            throw Error(`Invalid encoded DS ID: ${encodedId}`);
        }

        const exponent = buf.readUInt8(buf.length - 1);

        return coefficient * Math.pow(2, exponent);
    }
}
