import { assertEquals, assertThrows } from "../../deps/testing.ts";
import { assertNotThrows } from "../../testing/utils/assertNotThrows.ts";

import {
  Boolean,
  Literal,
  Number,
  Static,
  String,
  Template,
  Union,
  ValidationError,
} from "../../mod.ts";

Deno.test("template", async (t) => {
  await t.step("validates", () => {
    const Owner = Union(Literal("Bob"), Literal("Jeff"));
    const Dog = Template`${Owner}'s dog`;
    type Dog = Static<typeof Dog>;
    const dogBob: Dog = "Bob's dog";
    assertEquals(Dog.guard(dogBob), true);
    const catBob: Dog = "Bob's cat";
    assertEquals(Dog.guard(catBob), false);
    const dogJeff: Dog = "Jeff's dog";
    assertEquals(Dog.guard(dogJeff), true);
    const dogAlice: Dog = "Alice's cat";
    assertEquals(Dog.guard(dogAlice), false);
  });

  await t.step("invalidates with correct error messages", () => {
    const Owner = Union(Literal("Bob"), Literal("Jeff"));
    const Dog = Template(["", "'s dog"] as const, Owner);
    type Dog = Static<typeof Dog>;

    const catBob = "Bob's cat";
    assertEquals(Dog.validate(catBob), {
      code: "VALUE_INCORRECT",
      message:
        'Expected string `${"Bob" | "Jeff"}\'s dog`, but was "Bob\'s cat"',
      success: false,
    });

    const dogAlice = "Alice's cat";
    assertThrows(
      () =>
        Dog.check(
          dogAlice,
        ),
      ValidationError,
      'Expected string `${"Bob" | "Jeff"}\'s dog`, but was "Alice\'s cat"',
    );
  });

  await t.step("supports convenient arguments form", () => {
    const Owner = Union(Literal("Bob"), Literal("Jeff"));
    const Dog = Template(Owner, "'s dog");
    type Dog = Static<typeof Dog>;
    const catBob: Dog = "Bob's dog";
    assertNotThrows(() => Dog.check(catBob));
  });

  await t.step("supports various inner runtypes", () => {
    const DogCount = Template(
      Number,
      " ",
      Union(Template(Boolean, " "), Literal("")),
      String.withConstraint((s) => s.toLowerCase() === "dogs", {
        name: '"dogs"',
      }),
    );
    type DogCount = Static<typeof DogCount>;
    assertNotThrows(() => DogCount.check("101 dogs"));
    assertNotThrows(() => DogCount.check("101 Dogs"));
    assertThrows(() => DogCount.check("101dogs"));
    assertNotThrows(() => DogCount.check("101 false dogs"));
    assertThrows(() => DogCount.check("101 cats"));
  });

  await t.step("emits TYPE_INCORRECT for values other than string", () => {
    const Dog = Template("foo");
    assertEquals(Dog.validate(42), {
      code: "TYPE_INCORRECT",
      message: 'Expected string "foo", but was number',
      success: false,
    });
  });
});
