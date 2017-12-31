import { DatastoreInt, PathElement } from '@google-cloud/datastore/entity';
import * as debug from 'debug';
import { DsIdCoercer } from './DsIdCoercer';


export const intCoercer: DsIdCoercer<number> = { coerce };
export default intCoercer;


function coerce(datastoreId: PathElement = ''): number {
    if (isValidNumericId(datastoreId)) {
        return datastoreId;
    }

    datastoreId = coerceDsIntToIntStr(datastoreId);
    if (isValidIdString(datastoreId)) {
        return parseInt(datastoreId, 10);
    }

    return _invalidId(datastoreId);
}

function isValidIdString(intstr: PathElement): intstr is string {
    return /^[1-9][\d]{1,15}$/.test(intstr.toString());
}

function isValidNumericId(id: PathElement): id is number {
    return (id > 0) && Number.isSafeInteger(id as number);
}

function coerceDsIntToIntStr(datastoreInt: DatastoreInt | string): string {
    if (typeof datastoreInt === 'string') {
        return datastoreInt;
    }
    const { value } = datastoreInt;
    if (typeof value === 'string') {
        return value;
    }

    return _invalidId(datastoreInt);
}

function _invalidId(datastoreInt: any): never {
    debug('datastore-id-codec')(`Invalid DS ID: ${datastoreInt}`);
    throw Error('Invalid Datastore ID');
}
