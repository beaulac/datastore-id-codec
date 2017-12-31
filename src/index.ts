import { Base32IntCodec } from './Base32IntCodec';
import { DsIdCodec } from './DsIdCodec';
import intCoercer from './id.to.int.coercion';

export * from './IdCodec';
export * from './DsIdCodec';

export const base32DsIdCodec = new DsIdCodec(intCoercer, new Base32IntCodec());
export default base32DsIdCodec;
