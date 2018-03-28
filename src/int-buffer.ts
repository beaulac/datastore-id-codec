import { intexp } from 'intexp';

const MAX_UINT_16 = 0xFFFF;
export const uint16EncodedSize = 2 + 1;

const MAX_UINT_32 = 0xFFFFFFFF;
export const uint32EncodedSize = 4 + 1;

export function toBuffer(int: number): Buffer {
    const [coefficient, exponent] = intexp(int);
    if (coefficient > MAX_UINT_32) {
        throw Error('DS ID is not divisible enough');
    }

    let buf: Buffer;
    if (coefficient < MAX_UINT_16) {
        buf = Buffer.allocUnsafe(uint16EncodedSize);
        buf.writeUInt16LE(coefficient, 0);
    } else {
        buf = Buffer.allocUnsafe(uint32EncodedSize);
        buf.writeUInt32LE(coefficient, 0);
    }

    buf.writeUInt8(exponent, buf.length - 1);

    return buf;
}
