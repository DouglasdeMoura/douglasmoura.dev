// oxlint-disable typescript/consistent-type-imports
import type { AppContext } from "@/src/worker";

declare module "rwsdk/worker" {
  // Un-commment the interface below if you need to add context to your app
  // interface DefaultAppContext extends AppContext {}

  // App is the type of your defineApp export in src/worker.tsx
  export type App = typeof import("../src/worker").default;
}
