import type { RouteObject } from "react-router-dom";
import { CasePage } from "./pages/case-page";

export const CaseRoute: RouteObject[] = [
  {
    path: "/casos",
    Component: CasePage,
  },
];
