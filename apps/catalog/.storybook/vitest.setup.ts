import { setProjectAnnotations } from "@storybook/react-vite";

import preview from "./preview.tsx";

// Applies the scheme and direction decorators to composed stories so the axe
// pass runs against the same tree Storybook renders.
setProjectAnnotations([preview]);
