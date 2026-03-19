"use client";

import { useEffect } from "react";

export const CodeCopy = () => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const button = (e.target as HTMLElement).closest<HTMLButtonElement>(
        ".code-block-copy"
      );
      if (!button) {
        return;
      }

      const wrapper = button.closest(".code-block-wrapper");
      const code = wrapper?.querySelector("pre")?.textContent;
      if (!code) {
        return;
      }

      navigator.clipboard.writeText(code);
      button.classList.add("copied");
      setTimeout(() => button.classList.remove("copied"), 2000);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
};
