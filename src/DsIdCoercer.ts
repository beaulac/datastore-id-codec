import { PathElement } from '@google-cloud/datastore/entity';

export interface DsIdCoercer<T> {
    coerce(id: PathElement): T;
}
