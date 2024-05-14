import { test, describe, it, expect } from "vitest"
import { serialize } from "../src/main"

class A {
    a: string
    b: string

    constructor(a: string, b: string) {
        this.a = a
        this.b = b
    }

    get c() {
        return this.a + this.b
    }

    get d() {
        return () => { console.log(this.a + this.b) };
    }

}

const source = new A("a", "b")
const serialized = serialize(source)
const serializedWithAccessors = serialize(source, true)


const sourceArray = [new A("a", "b"), new A("c", "d")]
const serializedArray = serialize(sourceArray)
const serializedWithAccessorsArray = serialize(sourceArray, true)


const sourceObject = { a: new A("a", "b"), b: new A("c", "d") }
const serializedObject = serialize(sourceObject)
const serializedWithAccessorsObject = serialize(sourceObject, true)

const sourceArrayOfObjects = [{ a: new A("a", "b"), b: new A("c", "d") }, { a: new A("e", "f"), b: new A("g", "h") }]
const serializedArrayOfObjects = serialize(sourceArrayOfObjects)
const serializedWithAccessorsArrayOfObjects = serialize(sourceArrayOfObjects, true)

const sourceMap = new Map<string, A>([["a", new A("a", "b")], ["b", new A("c", "d")]])
const serializedMap = serialize(sourceMap)
const serializedWithAccessorsMap = serialize(sourceMap, true)

const sourceSet = new Set<A>([new A("a", "b"), new A("c", "d")])
const serializedSet = serialize(sourceSet)
const serializedWithAccessorsSet = serialize(sourceSet, true)

const sourceMixed = {
    a: new A("a", "b"),
    b: new Set<A>([new A("c", "d"), new A("e", "f")]),
    c: new Map<string, A>([["a", new A("a", "b")], ["b", new A("c", "d")]]),
    d: [new A("a", "b"), new A("c", "d")],
    e: {
        a: new A("a", "b"),
        b: new Set<A>([new A("c", "d"), new A("e", "f")]),
        c: new Map<string, A>([["a", new A("a", "b")], ["b", new A("c", "d")]]),
        d: [new A("a", "b"), new A("c", "d")]
    }
}

const serializedMixed = serialize(sourceMixed)
const serializedWithAccessorsMixed = serialize(sourceMixed, true)


test("serialize", () => {
    expect(serialized).toEqual({ a: "a", b: "b" })
    expect(serializedWithAccessors).toEqual({ a: "a", b: "b", c: "ab" })
})

test("serialize array", () => {
    expect(serializedArray).toEqual([{ a: "a", b: "b" }, { a: "c", b: "d" }])
    expect(serializedWithAccessorsArray).toEqual([{ a: "a", b: "b", c: "ab" }, { a: "c", b: "d", c: "cd" }])
})

test("serialize object", () => {
    expect(serializedObject).toEqual({ a: { a: "a", b: "b" }, b: { a: "c", b: "d" } })
    expect(serializedWithAccessorsObject).toEqual({ a: { a: "a", b: "b", c: "ab" }, b: { a: "c", b: "d", c: "cd" } })
})

test("serialize array of objects", () => {
    expect(serializedArrayOfObjects).toEqual([{ a: { a: "a", b: "b" }, b: { a: "c", b: "d" } }, { a: { a: "e", b: "f" }, b: { a: "g", b: "h" } }])
    expect(serializedWithAccessorsArrayOfObjects).toEqual([{ a: { a: "a", b: "b", c: "ab" }, b: { a: "c", b: "d", c: "cd" } }, { a: { a: "e", b: "f", c: "ef" }, b: { a: "g", b: "h", c: "gh" } }])
})

test("serialize map", () => {
    expect(serializedMap).toEqual(new Map([["a", { a: "a", b: "b" }], ["b", { a: "c", b: "d" }]]))
    expect(serializedWithAccessorsMap).toEqual(new Map([["a", { a: "a", b: "b", c: "ab" }], ["b", { a: "c", b: "d", c: "cd" }]]))
})

test("serialize set", () => {
    expect(serializedSet).toEqual(new Set([{ a: "a", b: "b" }, { a: "c", b: "d" }]))
    expect(serializedWithAccessorsSet).toEqual(new Set([{ a: "a", b: "b", c: "ab" }, { a: "c", b: "d", c: "cd" }]))
})

test("serialize mixed", () => {
    expect(serializedMixed).toEqual(
        {
            a: { a: "a", b: "b" },
            b: new Set([{ a: "c", b: "d" }, { a: "e", b: "f" }]),
            c: new Map([["a", { a: "a", b: "b" }], ["b", { a: "c", b: "d" }]]),
            d: [{ a: "a", b: "b" }, { a: "c", b: "d" }],
            e: {
                a: { a: "a", b: "b" },
                b: new Set([{ a: "c", b: "d" }, { a: "e", b: "f" }]),
                c: new Map([["a", { a: "a", b: "b" }], ["b", { a: "c", b: "d" }]]),
                d: [{ a: "a", b: "b" }, { a: "c", b: "d" }]
            }
        }
    )
    expect(serializedWithAccessorsMixed).toEqual(
        {
            a: { a: "a", b: "b", c: "ab" },
            b: new Set([{ a: "c", b: "d", c: "cd" }, { a: "e", b: "f", c: "ef" }]),
            c: new Map([["a", { a: "a", b: "b", c: "ab" }], ["b", { a: "c", b: "d", c: "cd" }]]),
            d: [{ a: "a", b: "b", c: "ab" }, { a: "c", b: "d", c: "cd" }],
            e: {
                a: { a: "a", b: "b", c: "ab" },
                b: new Set([{ a: "c", b: "d", c: "cd" }, { a: "e", b: "f", c: "ef" }]),
                c: new Map([["a", { a: "a", b: "b", c: "ab" }], ["b", { a: "c", b: "d", c: "cd" }]]),
                d: [{ a: "a", b: "b", c: "ab" }, { a: "c", b: "d", c: "cd" }]
            }
        }
    )
})