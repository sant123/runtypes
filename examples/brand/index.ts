import { Array, Partial, Record, Runtype, Static, String } from "../../mod.ts";

export const ID = String.withBrand("ID");
export type ID = Static<typeof ID>;

export const ArrayNonEmpty = <T extends Runtype>(element: T) =>
  Array(element).withConstraint((a) =>
    0 < a.length || "array must not be empty"
  );

export const IDRequiedAndOptional = Record({ required: ArrayNonEmpty(ID) })
  .And(Partial({ optional: ArrayNonEmpty(ID) }))
  .withBrand("IDRequiedAndOptional");
export type IDRequiedAndOptional = Static<typeof IDRequiedAndOptional>;

const _test: IDRequiedAndOptional = IDRequiedAndOptional.check({
  required: ["a"],
  optional: ["b"],
});

export default IDRequiedAndOptional;
