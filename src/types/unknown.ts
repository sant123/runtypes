import type { Reflect } from "../reflect.ts";
import { create, type Runtype } from "../runtype.ts";
import { SUCCESS } from "../util.ts";

export interface Unknown extends Runtype {
  tag: "unknown";
}

const self = ({ tag: "unknown" } as unknown) as Reflect;

/**
 * Validates anything, but provides no new type information about it.
 */
export const Unknown = create<Unknown>((value) => SUCCESS(value), self);
