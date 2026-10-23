"use client";

import { EmbeddedTweet, TweetNotFound } from "react-tweet";
import type { Tweet } from "react-tweet/api";

export const TweetEmbed = ({ tweet }: { tweet: Tweet | undefined }) => (
  <div className="not-prose my-6 flex justify-center">
    {tweet ? <EmbeddedTweet tweet={tweet} /> : <TweetNotFound />}
  </div>
);
