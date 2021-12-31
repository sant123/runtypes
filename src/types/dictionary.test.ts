import { assertEquals } from "../../deps/testing.ts";
import {
  Dictionary,
  Literal,
  Optional,
  type Static,
  String,
} from "../../mod.ts";

Deno.test("dictionary", async (t) => {
  await t.step("works with optional properties", () => {
    const T = Dictionary(Optional(String), Literal("bar"));
    type T = Static<typeof T>;
    type Expected = { bar?: string | undefined };
    const t: [Expected, T] extends [T, Expected] ? T : never = {};
    assertEquals(T.guard(t), true);
  });
});
