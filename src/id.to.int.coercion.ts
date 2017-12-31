import { DatastoreInt, PathElement } from '@google-cloud/datastore/entity';
import * as debug from 'debug';
import { DsIdCoercer } from './DsIdCoercer';
const _DEBUG = debug('datastore-id-codec');


export const intCoercer: DsIdCoercer<number> = { coerce };
export default intCoercer;


function coerce(datastoreId: PathElement = ''): number {
    if (isValidNumericId(datastoreId)) {
        return datastoreId;

    }

    datastoreId = coerceDsIntToIntStr(datastoreId);
    if (isValidIdString(datastoreId)) {
        const result = parseInt(coerceDsIntToIntStr(datastoreId), 10);
        if (isValidNumericId(result)) {
            return result;
        }

    }
    _DEBUG(`Invalid DS ID: ${datastoreId}`);
    throw Error('Invalid Datastore ID');

}

function isValidIdString(intstr: PathElement): intstr is string {
    return /^[1-9][\d]{1,15}$/.test(intstr.toString());
}

function isValidNumericId(id: PathElement): id is number {
    return (id > 0) && (id < Number.MAX_SAFE_INTEGER);
}

function coerceDsIntToIntStr(datastoreInt: DatastoreInt | string = ''): string {
    return typeof datastoreInt === 'string'
        ? datastoreInt
        : datastoreInt.value;
}
