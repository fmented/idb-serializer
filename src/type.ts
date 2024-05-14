export type Serialize<T> =

    {
        [P in keyof ExtractNonReadonly<T> as ExtractNonReadonly<T>[P] extends Function ? never : P]
        : ExtractNonReadonly<T>[P] extends new (...args: any) => infer R ? Serialize<R>
        : ExtractNonReadonly<T>[P] extends Set<infer R> ? Set<Serialize<R>>
        : ExtractNonReadonly<T>[P] extends Map<infer K, infer V> ? Map<K, Serialize<V>>
        : ExtractNonReadonly<T>[P] extends Record<any, any> ? Serialize<ExtractNonReadonly<T>[P]>
        : ExtractNonReadonly<T>[P] extends Array<infer R> ? Array<Serialize<R>>
        : ExtractNonReadonly<T>[P]
    }

export type SerializeWithAccessors<T> =

    {
        -readonly [P in keyof T as T[P] extends Function ? never : P]
        : T[P] extends new (...args: any) => infer R ? SerializeWithAccessors<R>
        : T[P] extends Set<infer R> ? Set<SerializeWithAccessors<R>>
        : T[P] extends Map<infer K, infer V> ? Map<K, SerializeWithAccessors<V>>
        : T[P] extends Record<any, any> ? SerializeWithAccessors<T[P]>
        : T[P] extends Array<infer R> ? Array<SerializeWithAccessors<R>>
        : T[P]
    }


export type DeSerialize<T> = T extends Serialize<infer R> ? R
    : T extends Set<Serialize<infer R>> ? Set<R>
    : T extends Map<infer K, Serialize<infer V>> ? Map<K, V>
    : T extends Array<Serialize<infer R>> ? Array<R>
    : T extends Record<any, any> ? {
        [P in keyof T]: DeSerialize<T[P]>
    }
    : T



export type ExtractNonReadonly<T> = ExtractMutable<T> extends never ? T : Pick<T, ExtractMutable<T>>


type IfEquals<T, U, Y = true, N = false> =
    (<G>() => G extends T ? 1 : 2) extends
    (<G>() => G extends U ? 1 : 2) ? Y : N;

type ExtractMutable<T> = {
    [Prop in keyof T]:
    /**
     * Example:
     * IfEquals<{readonly a: string}, Record<'a',string> -> returns false
     */
    IfEquals<Pick<T, Prop>, Record<Prop, T[Prop]>> extends false
    ? never
    : Prop
}[keyof T]

export type ValidBuiltInData =
    | Uint8Array
    | Uint16Array
    | Uint32Array
    | Uint8ClampedArray
    | Int8Array
    | Int16Array
    | Int32Array
    | BigUint64Array
    | BigInt64Array
    | Float32Array
    | Float64Array
    | Date
    | RegExp
    | ArrayBuffer
    | Blob
    | string | number | boolean | null | undefined


