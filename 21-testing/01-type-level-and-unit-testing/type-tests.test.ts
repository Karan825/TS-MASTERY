/**
 * Lesson 21.1: Compile-Time Type-Level Tests
 * Validates that generic utilities produce exact types.
 */

import { describe, it, expect } from "vitest";
import type { Equal, Expect, IsNever, IsAny } from "../../shared/type-utils.js";
import type { DeepReadonly } from "../../06-advanced-types/02-mapped-types-and-key-remapping/solution.js";
import type { CustomOmit } from "../../07-utility-types/01-object-transformation-utilities/solution.js";

describe("Type-Level Assertions", () => {
  it("should verify DeepReadonly deeply freezes nested object and array types", () => {
    type Target = {
      user: {
        id: string;
        roles: string[];
      };
    };

    type Result = DeepReadonly<Target>;

    type Expected = {
      readonly user: {
        readonly id: string;
        readonly roles: ReadonlyArray<string>;
      };
    };

    type _Test1 = Expect<Equal<Result, Expected>>;
    expect(true).toBe(true);
  });

  it("should verify CustomOmit removes specified keys", () => {
    type User = { id: string; name: string; age: number };
    type Stripped = CustomOmit<User, "age">;

    type _Test2 = Expect<Equal<Stripped, { id: string; name: string }>>;
    expect(true).toBe(true);
  });

  it("should assert IsNever and IsAny safety", () => {
    type _TestNever = Expect<IsNever<never>>;
    type _TestAny = Expect<IsAny<any>>;
    expect(true).toBe(true);
  });
});
