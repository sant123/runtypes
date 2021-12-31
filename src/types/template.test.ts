import { assertEquals } from "../../deps/testing.ts";
import { expect } from "../../deps/chai.ts";
import {
  Boolean,
  Literal,
  Number,
  Static,
  String,
  Template,
  Union,
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
    expect(() => Dog.check(dogAlice)).to.throw(
      'Expected string `${"Bob" | "Jeff"}\'s dog`, but was "Alice\'s cat"',
    );
  });

  await t.step("supports convenient arguments form", () => {
    const Owner = Union(Literal("Bob"), Literal("Jeff"));
    const Dog = Template(Owner, "'s dog");
    type Dog = Static<typeof Dog>;
    const catBob: Dog = "Bob's dog";
    expect(() => Dog.check(catBob)).not.to.throw();
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
    expect(() => DogCount.check("101 dogs")).not.to.throw();
    expect(() => DogCount.check("101 Dogs")).not.to.throw();
    expect(() => DogCount.check("101dogs")).to.throw();
    expect(() => DogCount.check("101 false dogs")).not.to.throw();
    expect(() => DogCount.check("101 cats")).to.throw();
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
