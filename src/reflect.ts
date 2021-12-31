// deno-lint-ignore-file no-explicit-any
import type { Runtype } from "./runtype.ts";
import type { LiteralBase } from "./types/literal.ts";
import type { ConstraintCheck } from "./types/constraint.ts";
import type { Constructor } from "./types/instanceof.ts";

export type Reflect =
  | ({ tag: "unknown" } & Runtype)
  | ({ tag: "never" } & Runtype<never>)
  | ({ tag: "void" } & Runtype<void>)
  | ({ tag: "boolean" } & Runtype<boolean>)
  | ({ tag: "number" } & Runtype<number>)
  | ({ tag: "bigint" } & Runtype<bigint>)
  | ({ tag: "string" } & Runtype<string>)
  | ({ tag: "symbol"; key: string | undefined } & Runtype<symbol>)
  | (
    & { tag: "symbol"; (key: string | undefined): Runtype<symbol> }
    & Runtype<symbol>
  )
  | ({ tag: "literal"; value: LiteralBase } & Runtype<LiteralBase>)
  | (
    & { tag: "template"; strings: string[]; runtypes: Runtype<LiteralBase>[] }
    & Runtype<string>
  )
  | (
    & { tag: "array"; element: Reflect; isReadonly: boolean }
    & Runtype<ReadonlyArray<unknown>>
  )
  | ({
    tag: "record";
    fields: { [_: string]: Reflect };
    isPartial: boolean;
    isReadonly: boolean;
  } & Runtype<{ readonly [_ in string]: unknown }>)
  | (
    & { tag: "dictionary"; key: "string" | "number" | "symbol"; value: Reflect }
    & Runtype<{
      [_: string]: unknown;
    }>
  )
  | ({ tag: "tuple"; components: Reflect[] } & Runtype<unknown[]>)
  | ({ tag: "union"; alternatives: Reflect[] } & Runtype)
  | ({ tag: "intersect"; intersectees: Reflect[] } & Runtype)
  | ({ tag: "optional"; underlying: Reflect } & Runtype)
  | ({ tag: "function" } & Runtype<(...args: any[]) => any>)
  | ({
    tag: "constraint";
    underlying: Reflect;
    constraint: ConstraintCheck<Runtype<never>>;
    args?: any;
    name?: string;
  } & Runtype)
  | ({ tag: "instanceof"; ctor: Constructor<unknown> } & Runtype)
  | ({ tag: "brand"; brand: string; entity: Reflect } & Runtype);
