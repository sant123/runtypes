// deno-lint-ignore-file no-explicit-any
import type { Reflect } from "../reflect.ts";
import {
  create,
  type Runtype,
  type RuntypeBase,
  type Static,
} from "../runtype.ts";

export declare const RuntypeName: unique symbol;

export interface RuntypeBrand<B extends string> {
  [RuntypeName]: B;
}

export interface Brand<B extends string, A extends RuntypeBase> extends
  Runtype<
    // TODO: replace it by nominal type when it has been released
    // https://github.com/microsoft/TypeScript/pull/33038
    Static<A> & RuntypeBrand<B>
  > {
  tag: "brand";
  brand: B;
  entity: A;
}

export function Brand<B extends string, A extends RuntypeBase>(
  brand: B,
  entity: A,
) {
  const self = ({ tag: "brand", brand, entity } as unknown) as Reflect;
  return create<any>((value) => entity.validate(value), self);
}
