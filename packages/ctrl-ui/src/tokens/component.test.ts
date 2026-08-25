import { describe, expect, it } from "vitest";

import * as publicApi from "../index.ts";
import { component } from "./component/index.ts";
import { color } from "./semantic/color.ts";
import { density } from "./semantic/density.ts";
import { direction } from "./semantic/direction.ts";
import { radius } from "./semantic/radius.ts";
import { space } from "./semantic/space.ts";
import { typography } from "./semantic/typography.ts";

describe("component tokens", () => {
  describe("when reading the private passthrough", () => {
    it("mirrors semantic collections and stays off the public export surface", () => {
      expect(component.color).toBe(color);
      expect(component.space).toBe(space);
      expect(component.radius).toBe(radius);
      expect(component.typography).toBe(typography);
      expect(component.density).toBe(density);
      expect(component.direction).toBe(direction);
      expect(publicApi).not.toHaveProperty("component");
      expect(Object.keys(publicApi).sort()).toEqual(
        ["color", "density", "direction", "radius", "space", "typography"].sort(),
      );
    });
  });
});
