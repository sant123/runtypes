import { assertEquals, assertObjectMatch } from "../../deps/testing.ts";
import { expect } from "../../deps/chai.ts";
import {
  InstanceOf,
  Literal,
  Number,
  Record,
  String,
  Union,
} from "../../mod.ts";
import { Failcode } from "../result.ts";
import { Static } from "../runtype.ts";
import { LiteralBase } from "./literal.ts";

const ThreeOrString = Union(Literal(3), String);

Deno.test("union", async (t) => {
  await t.step("mapped literals", async (t) => {
    await t.step("works with its static types", () => {
      const values = ["Unknown", "Online", "Offline"] as const;
      type ElementOf<T extends readonly unknown[]> = T extends
        readonly (infer E)[] ? E : never;
      type LiteralOf<T extends readonly unknown[]> = {
        [K in keyof T]: T[K] extends ElementOf<T>
          ? T[K] extends LiteralBase ? Literal<T[K]>
          : never
          : never;
      };
      type L = LiteralOf<typeof values>;
      const literals = (values.map(Literal) as unknown) as L;
      const Values = Union<L>(...literals);
      type Values = Static<typeof Values>;
      const v: Values = "Online";
      expect(() => Values.check(v)).not.to.throw();
    });
  });

  await t.step("match", async (t) => {
    await t.step("works with exhaustive cases", () => {
      const match = ThreeOrString.match(
        (three) => three + 5,
        (str) => str.length * 4,
      );
      assertEquals(match(3), 8);
      assertEquals(match("hello"), 20);
    });
  });

  await t.step("discriminated union", async (t) => {
    await t.step(
      "should pick correct alternative with typescript docs example",
      () => {
        const Square = Record({ kind: Literal("square"), size: Number });
        const Rectangle = Record({
          kind: Literal("rectangle"),
          width: Number,
          height: Number,
        });
        const Circle = Record({ kind: Literal("circle"), radius: Number });

        const Shape = Union(Square, Rectangle, Circle);

        assertObjectMatch(
          Shape.validate({ kind: "square", size: new Date() }),
          {
            success: false,
            code: Failcode.CONTENT_INCORRECT,
            message:
              'Expected { kind: "square"; size: number; }, but was incompatible',
            details: { size: "Expected number, but was Date" },
          },
        );

        assertObjectMatch(
          Shape.validate({ kind: "rectangle", size: new Date() }),
          {
            success: false,
            code: Failcode.CONTENT_INCORRECT,
            message:
              'Expected { kind: "rectangle"; width: number; height: number; }, but was incompatible',
            details: {
              width: "Expected number, but was missing",
              height: "Expected number, but was missing",
            },
          },
        );

        assertObjectMatch(
          Shape.validate({ kind: "circle", size: new Date() }),
          {
            success: false,
            code: Failcode.CONTENT_INCORRECT,
            message:
              'Expected { kind: "circle"; radius: number; }, but was incompatible',
            details: { radius: "Expected number, but was missing" },
          },
        );

        expect(Shape.validate({ kind: "other", size: new Date() })).not.to
          .haveOwnProperty("key");
      },
    );

    await t.step(
      "should not pick alternative if the discriminant is not unique",
      () => {
        const Square = Record({ kind: Literal("square"), size: Number });
        const Rectangle = Record({
          kind: Literal("rectangle"),
          width: Number,
          height: Number,
        });
        const CircularSquare = Record({
          kind: Literal("square"),
          radius: Number,
        });

        const Shape = Union(Square, Rectangle, CircularSquare);

        expect(Shape.validate({ kind: "square", size: new Date() })).not.to
          .haveOwnProperty("key");
      },
    );

    await t.step(
      "should not pick alternative if not all types are records",
      () => {
        const Square = Record({ kind: Literal("square"), size: Number });
        const Rectangle = Record({
          kind: Literal("rectangle"),
          width: Number,
          height: Number,
        });

        const Shape = Union(Square, Rectangle, InstanceOf(Date));

        expect(Shape.validate({ kind: "square", size: new Date() })).not.to
          .haveOwnProperty("key");
      },
    );
  });
});
