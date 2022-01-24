import type { Reflect } from "../reflect.ts";
import { create, type Runtype } from "../runtype.ts";
import { FAILURE, SUCCESS } from "../util.ts";

export interface Number extends Runtype<number> {
  tag: "number";
}

const self = ({ tag: "number" } as unknown) as Reflect;

/**
 * Validates that a value is a number.
 */
export const Number = create<Number>(
  (
    value,
  ) => (typeof value === "number"
    ? SUCCESS(value)
    : FAILURE.TYPE_INCORRECT(self, value)),
  self,
);
