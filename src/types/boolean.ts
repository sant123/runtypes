import type { Reflect } from "../reflect.ts";
import { create, type Runtype } from "../runtype.ts";
import { FAILURE, SUCCESS } from "../util.ts";

export interface Boolean extends Runtype<boolean> {
  tag: "boolean";
}

const self = ({ tag: "boolean" } as unknown) as Reflect;

/**
 * Validates that a value is a boolean.
 */
export const Boolean = create<Boolean>(
  (
    value,
  ) => (typeof value === "boolean"
    ? SUCCESS(value)
    : FAILURE.TYPE_INCORRECT(self, value)),
  self,
);
