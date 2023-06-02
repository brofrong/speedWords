import type { RouteDefinition } from "@solidjs/router";
import { lazy } from "solid-js";

import Home from "./pages/home";

export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/experiment/:id",
    component: lazy(() => import("./pages/experiment")),
  },
  {
    path: "**",
    component: lazy(() => import("./errors/404")),
  },
];
