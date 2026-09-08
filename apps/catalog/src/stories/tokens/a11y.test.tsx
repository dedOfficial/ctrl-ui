import type { ReactNode } from "react";
import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import axe from "axe-core";
import { afterEach, describe, expect, it } from "vitest";

// Storybook's a11y addon reports in the browser panel only. This runs the same
// engine over every gallery story so a finding fails CI.
//
// Incomplete ("needs review") results are treated as failures alongside
// violations: axe reports aria-prohibited-attr as incomplete whenever the
// element also has text content, so ignoring that bucket would let the exact
// class of finding this suite exists to catch pass silently.
//
// color-contrast is disabled because jsdom computes no layout, so axe can only
// ever mark it incomplete. Contrast is asserted numerically against the token
// values in the kit's contrast.test.ts.
const axeOptions: axe.RunOptions = {
  rules: { "color-contrast": { enabled: false } },
};

type StoryModule = Parameters<typeof composeStories>[0];
type ComposedStory = () => ReactNode;

const storyModules = import.meta.glob<StoryModule>("./*.stories.tsx", { eager: true });

// import.meta.glob yields untyped modules, so composeStories cannot infer a type
// per story; every composed story is a render function regardless.
const stories: Array<[string, ComposedStory]> = Object.entries(storyModules).flatMap(
  ([path, storyModule]) =>
    Object.entries(composeStories(storyModule) as Record<string, ComposedStory>).map(
      ([storyName, Story]): [string, ComposedStory] => [
        `${path.replace("./", "")} ${storyName}`,
        Story,
      ],
    ),
);

afterEach(() => {
  document.body.replaceChildren();
});

describe("token galleries", () => {
  it("scans at least one story from every gallery module", () => {
    expect(Object.keys(storyModules).length).toBeGreaterThan(0);
    expect(stories.length).toBeGreaterThanOrEqual(Object.keys(storyModules).length);
  });

  it.each(stories)("renders %s with no axe findings", async (_name, Story) => {
    const { container } = render(<Story />);

    const results = await axe.run(container, axeOptions);

    expect({
      violations: results.violations.map((finding) => finding.id),
      incomplete: results.incomplete.map((finding) => finding.id),
    }).toEqual({ violations: [], incomplete: [] });
  });
});
