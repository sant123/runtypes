import { assertEquals } from "../../deps/testing.ts";
import { Record, type Static, String } from "../../mod.ts";
import { Literal } from "./literal.ts";
import { Number } from "./number.ts";
import { Optional } from "./optional.ts";

Deno.test("record", async (t) => {
  const CrewMember = Record({
    name: String,
    rank: String,
    home: String,
  });

  await t.step("pick", async (t) => {
    await t.step("keeps only selected fields", () => {
      const PetMember = CrewMember.pick("name", "home");
      type PetMember = Static<typeof PetMember>;
      const petMember: PetMember = { name: "", home: "" };
      assertEquals(Object.keys(PetMember.fields), ["name", "home"]);
      assertEquals(PetMember.guard(petMember), true);
    });

    await t.step("works with empty arguments", () => {
      const PetMember = CrewMember.pick();
      type PetMember = Static<typeof PetMember>;
      const petMember: PetMember = {};
      assertEquals(Object.keys(PetMember.fields), []);
      assertEquals(PetMember.guard(petMember), true);
    });
  });

  await t.step("omit", async (t) => {
    await t.step("drop selected fields", () => {
      const PetMember = CrewMember.omit("name", "home");
      type PetMember = Static<typeof PetMember>;
      const petMember: PetMember = { rank: "" };
      assertEquals(Object.keys(PetMember.fields), ["rank"]);
      assertEquals(PetMember.guard(petMember), true);
    });

    await t.step("works with empty arguments", () => {
      const PetMember = CrewMember.omit();
      type PetMember = Static<typeof PetMember>;
      const petMember: PetMember = { name: "", home: "", rank: "" };
      assertEquals(Object.keys(PetMember.fields), ["name", "rank", "home"]);
      assertEquals(PetMember.guard(petMember), true);
    });
  });

  await t.step("extend", async (t) => {
    await t.step("adds fields", () => {
      const BaseShapeParams = Record({
        x: Number,
        y: Number,
        width: Number,
        height: Number,
        rotation: Number,
      });
      const PolygonParams = BaseShapeParams.extend({
        sides: Number,
      });
      assertEquals(Object.keys(PolygonParams.fields), [
        "x",
        "y",
        "width",
        "height",
        "rotation",
        "sides",
      ]);
    });

    await t.step("overwrites with a narrower type", () => {
      const _WrongPetMember = CrewMember.extend({ lastName: Optional(String) });
      const PetMember = CrewMember.extend({ name: Literal("pet") });
      type PetMember = Static<typeof PetMember>;
      const petMember: PetMember = { name: "pet", home: "", rank: "" };
      const anotherMember = { name: "another", home: "", rank: "" };
      assertEquals(PetMember.guard(petMember), true);
      assertEquals(PetMember.guard(anotherMember), false);
    });
  });
});
