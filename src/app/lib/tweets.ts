import type { Tweet } from "react-tweet/api";

export type { Tweet };

const SYNDICATION_URL = "https://cdn.syndication.twimg.com/tweet-result";

const getToken = (id: string): string =>
  ((Number(id) / 1e15) * Math.PI).toString(36).replaceAll(/(0+|\.)/g, "");

export const fetchTweetData = async (
  id: string
): Promise<Tweet | undefined> => {
  const url = new URL(SYNDICATION_URL);
  url.searchParams.set("id", id);
  url.searchParams.set("lang", "en");
  url.searchParams.set("token", getToken(id));

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; BlogBot/1.0)",
      },
    });
    if (!res.ok) {
      return undefined;
    }
    const data = (await res.json()) as Tweet;
    if (!data || Object.keys(data).length === 0) {
      return undefined;
    }
    return data;
  } catch {
    return undefined;
  }
};
