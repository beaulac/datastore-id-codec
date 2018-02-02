# datastore-id-codec

A tool to encode shorter, user-friendly representations of Google Cloud Datastore (GCDS) IDs.

### Mechanism
IDs assigned by GCDS are always highly divisible by 2. This property can be used to greatly shorten their encoded length, by factoring out the largest power of 2 it is divisible by.

Yes; this is somewhat of an implementation-dependent kludge :)

This tool's default implementation uses Crockford-alphabet base32 as its output format.

### Usage

```javascript
const base32DsIdCodec = require('datastore-id-codec').base32

// Outputs: "2D84Y0GV"
const encoded = base32DsIdCodec.encode('5201242305331200') 

// Outputs: "5201242305331200"
const decoded = base32DsIdCodec.decode('2D84Y0GV')
```
