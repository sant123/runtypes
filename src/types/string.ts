// deno-lint-ignore-file ban-types
import type { Reflect } from "../reflect.ts";
import { create, type Runtype } from "../runtype.ts";
import { FAILURE, SUCCESS } from "../util.ts";

export interface String extends Runtype<string> {
  tag: "string";
}

const self = ({ tag: "string" } as unknown) as Reflect;

/**
 * Validates that a value is a string.
 */
export const String = create<String>(
  (
    value,
  ) => (typeof value === "string"
    ? SUCCESS(value)
    : FAILURE.TYPE_INCORRECT(self, value)),
  self,
);
