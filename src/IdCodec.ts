export interface IdCodec<Intermediate, Format> {
    encode(id: Intermediate): Format;

    decode(encoded: Format): Intermediate;
}
