import type { Reflect } from "../reflect.ts";
import {
  create,
  type Runtype,
  type RuntypeBase,
  type Static,
} from "../runtype.ts";
import { SUCCESS } from "../util.ts";

export interface Optional<R extends RuntypeBase>
  extends Runtype<Static<R> | undefined> {
  tag: "optional";
  underlying: R;
}

/**
 * Validates optional value.
 */
export function Optional<R extends RuntypeBase>(runtype: R) {
  const self = ({ tag: "optional", underlying: runtype } as unknown) as Reflect;
  return create<Optional<R>>(
    (value) => (value === undefined ? SUCCESS(value) : runtype.validate(value)),
    self,
  );
}
