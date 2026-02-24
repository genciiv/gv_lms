import { marked } from "marked";
import DOMPurify from "dompurify";

marked.setOptions({
  gfm: true,
  breaks: true
});

export function renderMarkdown(mdText = "") {
  const raw = marked.parse(String(mdText || ""));
  return DOMPurify.sanitize(raw);
}