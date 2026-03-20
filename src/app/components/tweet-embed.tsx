"use client";

import { EmbeddedTweet, TweetNotFound } from "react-tweet";
import type { Tweet } from "react-tweet/api";

export const TweetEmbed = ({ tweet }: { tweet: Tweet | undefined }) => (
  <div className="not-prose flex justify-center my-6">
    {tweet ? <EmbeddedTweet tweet={tweet} /> : <TweetNotFound />}
  </div>
);
