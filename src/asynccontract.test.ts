// deno-lint-ignore-file no-explicit-any
import { assertEquals, assertRejects } from "../deps/testing.ts";
import { AsyncContract, Number } from "../mod.ts";
import { ValidationError } from "./errors.ts";

Deno.test("AsyncContract", async (t) => {
  await t.step("when function does not return a promise", async (t) => {
    await t.step("throws a validation error", async () => {
      const contractedFunction = AsyncContract(Number).enforce(() => 7 as any);
      await assertRejects(contractedFunction, ValidationError);
    });
  });

  await t.step(
    "when a function does return a promise, but for the wrong type",
    async (t) => {
      await t.step("throws a validation error asynchronously", async () => {
        const contractedFunction = AsyncContract(Number).enforce(() =>
          Promise.resolve("hi" as any)
        );
        await assertRejects(contractedFunction, ValidationError);
      });
    },
  );

  await t.step("when a function does return a promise", async (t) => {
    await t.step("should validate successfully", async () => {
      const contractedFunction = AsyncContract(Number).enforce(() =>
        Promise.resolve(7)
      );
      assertEquals(await contractedFunction(), 7);
    });
  });

  await t.step("when not enough arguments are provided", async (t) => {
    await t.step("throws a validation error", async () => {
      const contractedFunction = AsyncContract(Number, Number).enforce((n) =>
        Promise.resolve(n + 1)
      );
      await assertRejects(contractedFunction as any, ValidationError);
    });
  });
});
