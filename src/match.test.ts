// deno-lint-ignore-file no-explicit-any
import { assertEquals, assertThrows } from "../deps/testing.ts";
import { Literal, match, Number, String } from "../mod.ts";
import { when } from "./match.ts";

Deno.test("match", async (t) => {
  await t.step("works", () => {
    const f: (value: string | number) => number = match(
      when(Literal(42), (fortyTwo) => fortyTwo / 2),
      when(Number, (n) => n + 9),
      when(String, (s) => s.length * 2),
    );

    assertEquals(f(42), 21);
    assertEquals(f(16), 25);
    assertEquals(f("yooo"), 8);
    assertThrows(() => f(true as any), Error, "No alternatives were matched");
  });
});
