"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Safe Markdown: raw HTML is never rendered (no rehype-raw); links open in a new tab without referrer. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children: c }) => {
            const internal = !!href && href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/\\");
            return internal ? <a href={href}>{c}</a> : <a href={href} target="_blank" rel="noopener noreferrer nofollow">{c}</a>;
          },
          img: () => null,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
