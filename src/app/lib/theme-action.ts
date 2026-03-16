"use server";

import { getRequestInfo } from "rwsdk/worker";

export const setTheme = (theme: string): void => {
  const { response } = getRequestInfo();
  const value = theme === "dark" || theme === "light" ? theme : "system";
  response.headers.set(
    "Set-Cookie",
    `theme=${value}; Path=/; Max-Age=31536000; SameSite=Lax`
  );
};
