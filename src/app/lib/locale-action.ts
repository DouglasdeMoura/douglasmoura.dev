"use server";

import { getRequestInfo } from "rwsdk/worker";

export const setLocale = (locale: string): void => {
  const { response } = getRequestInfo();
  const value = locale === "pt-BR" ? "pt-BR" : "en-US";
  response.headers.set(
    "Set-Cookie",
    `locale=${value}; Path=/; Max-Age=31536000; SameSite=Lax`
  );
};
