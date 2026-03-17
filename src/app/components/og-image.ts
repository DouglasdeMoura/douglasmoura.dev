import type { Post } from "#app/lib/posts.js";

const GRAVATAR_URL =
  "https://www.gravatar.com/avatar/997c72f0b7ca0fc26bdf60ca27cb4194?s=96";

const escapeHtml = (str: string): string =>
  str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const buildOgHtml = (post: Post, hostname: string): string => {
  const displayTags = post.tags.slice(0, 4);

  const tagsHtml = displayTags.length
    ? `<div style="display:flex;margin-bottom:3px;font-size:37px;font-weight:500;color:#c1c2c5;opacity:0.7">${displayTags
        .map(
          (tag) => `<span style="margin-right:16px">#${escapeHtml(tag)}</span>`
        )
        .join("")}</div>`
    : "";

  return `<div style="display:flex;padding:60px;background-color:#141517;width:1686px;height:948px;font-family:Geist">
  <div style="display:flex;align-items:flex-end;justify-content:space-between;height:100%;width:100%;position:relative">
    <div style="display:flex;flex-direction:column;height:100%;width:100%;justify-content:space-between">
      <div style="display:flex;flex-direction:column;position:absolute;top:0">
        ${tagsHtml}
        <div style="display:flex;font-size:92px;font-weight:700;color:#c1c2c5;line-height:1.4;max-width:98%">${escapeHtml(post.title)}</div>
      </div>
      <div style="display:flex;align-items:center;position:absolute;bottom:0;left:0;width:1566px">
        <img src="${GRAVATAR_URL}" width="75" height="75" style="border-radius:50%" />
        <span style="margin-left:16px;font-size:37px;font-weight:500;color:#4338ca;opacity:0.7">@douglasdemoura</span>
        <span style="margin-left:auto;font-size:37px;font-weight:500;color:#4338ca;opacity:0.7">${escapeHtml(hostname)}</span>
      </div>
    </div>
  </div>
</div>`;
};
