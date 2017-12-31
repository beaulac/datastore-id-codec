import { PathElement } from '@google-cloud/datastore/entity';
import { DsIdCoercer } from './DsIdCoercer';
import { IdCodec } from './IdCodec';

export class DsIdCodec<Encoded, I extends PathElement = PathElement> implements IdCodec<PathElement, Encoded> {

    constructor(private coercer: DsIdCoercer<I>,
                private codec: IdCodec<I, Encoded>) {
    }

    encode(dsId: PathElement): Encoded {
        return this.codec.encode(this.coercer.coerce(dsId));
    }

    decode(encodedId: Encoded): I {
        return this.codec.decode(encodedId);
    }

}
