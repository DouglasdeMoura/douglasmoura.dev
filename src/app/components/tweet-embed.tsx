"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Tweet } from "react-tweet";

interface TweetPortal {
  id: string;
  container: Element;
}

export const TweetEmbed = ({ tweetIds }: { tweetIds: string[] }) => {
  const [portals, setPortals] = useState<TweetPortal[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || tweetIds.length === 0) {
      return;
    }
    initialized.current = true;

    const containers =
      document.querySelectorAll<HTMLElement>("[data-tweet-id]");
    setPortals(
      [...containers]
        .map((el) => ({ container: el, id: el.dataset.tweetId ?? "" }))
        .filter((p) => p.id)
    );
  }, [tweetIds]);

  return portals.map((p) =>
    createPortal(
      <div className="not-prose flex justify-center">
        <Tweet id={p.id} />
      </div>,
      p.container
    )
  );
};
