import { PathElement } from '@google-cloud/datastore/entity';
import { Base32IntCodec } from './Base32IntCodec';
import { DsIdCodec } from './DsIdCodec';
import intCoercer from './id-to-int';
import { toBuffer } from './int-buffer';

export * from './IdCodec';
export * from './DsIdCodec';

export const base32 = new DsIdCodec(intCoercer, new Base32IntCodec());
export default base32;

export function dsIdToBuffer(dsId: PathElement): Buffer {
    return toBuffer(intCoercer.coerce(dsId));
}
