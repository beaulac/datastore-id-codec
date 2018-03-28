import * as base32 from 'base32.js';
import { EncoderOptions } from 'base32.js';
import { IdCodec } from './IdCodec';
import { toBuffer, uint16EncodedSize, uint32EncodedSize } from './int-buffer';

const encoderOptions: EncoderOptions = { type: 'crockford', lc: false };

export class Base32IntCodec implements IdCodec<number, string> {

    public options: EncoderOptions;

    constructor(options: EncoderOptions = {}) {
        this.options = {
            ...encoderOptions,
            ...options,
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
        const buf = toBuffer(id);

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
