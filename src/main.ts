import { Serialize, SerializeWithAccessors, ValidBuiltInData } from "./type"

function isValidBuiltInData(v: any): v is ValidBuiltInData {
  if (v === null || v === undefined) return true
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return true
  return v instanceof Uint8Array
    || v instanceof Uint16Array
    || v instanceof Uint32Array
    || v instanceof Uint8ClampedArray
    || v instanceof Int8Array
    || v instanceof Int16Array
    || v instanceof Int32Array
    || v instanceof BigUint64Array
    || v instanceof BigInt64Array
    || v instanceof Float32Array
    || v instanceof Float64Array
    || v instanceof Date
    || v instanceof RegExp
    || v instanceof ArrayBuffer
    || v instanceof Blob

}


function getKeys<T extends object>(obj: T, includeAccessors = false): (keyof T & string | number)[] {
  if (!includeAccessors) return Object.keys(obj) as (keyof T & string | number)[]

  const proto = Object.getPrototypeOf(obj)
  const desc = Object.entries(Object.getOwnPropertyDescriptors(proto)).filter(([k, v]) => {
    return typeof v.get === "function" && k[0] !== '_'
  }).map(([k,]) => {
    return k
  })
  return [...desc, ...Object.keys(obj)] as (keyof T & string | number)[]
}


export function serialize<T>(t: T): Serialize<T>
export function serialize<T>(t: T, includeAccessors?: false): Serialize<T>
export function serialize<T>(t: T, includeAccessors: true): SerializeWithAccessors<T>
export function serialize<T, I extends boolean | undefined>(t: T, includeAccessors?: I): I extends true ? SerializeWithAccessors<T> : Serialize<T> {
  if (t instanceof Set) {
    return new Set([...t.values()].map((v: any) => serialize(v, includeAccessors as any))) as any
  }
  if (t instanceof Map) {
    return new Map([...t.entries()].map(([k, v]) => [k, serialize(v, includeAccessors as any)])) as any
  }
  if (Array.isArray(t)) return t.map((v) => serialize(v, includeAccessors as any)) as any
  if (isValidBuiltInData(t)) return t as any
  return getAllProperties(t, includeAccessors) as any
}

function getAllProperties(v: any, includeAccessors = false) {
  const serialized = {} as any

  for (const key of getKeys(v, includeAccessors)) {

    try {
      if (typeof v[key] === "function") continue
      serialized[key] = serialize(v[key], includeAccessors as any)
    } catch (error) {
      console.error(`Error calling getter ${key}`, error);
    }

  }

  return serialized
}