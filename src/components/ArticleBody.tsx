import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import sanitizeHtml from "sanitize-html";

type ArticleBodyProps = {
  content: string;
  className?: string;
};

function looksLikeHtml(text: string): boolean {
  const t = text.trim();
  return t.startsWith("<") && (t.includes("</") || t.includes("/>"));
}

const allowedTags = [
  "p", "br", "strong", "em", "u", "s", "h2", "h3", "h4",
  "ul", "ol", "li", "a", "img", "blockquote", "span", "div",
];
const allowedAttrs: Record<string, string[]> = {
  a: ["href", "target", "rel"],
  img: ["src", "alt", "width", "height", "class"],
  span: ["class"],
  div: ["class"],
};

export default function ArticleBody({ content, className = "" }: ArticleBodyProps) {
  const baseClass = "prose prose-navy max-w-none text-gray-700 leading-relaxed text-sm md:text-base";

  if (looksLikeHtml(content)) {
    const sanitized = sanitizeHtml(content, {
      allowedTags,
      allowedAttributes: allowedAttrs,
      allowedSchemes: ["http", "https", "data"],
    });
    return (
      <div
        className={`${baseClass} ${className} article-body-html`}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    );
  }

  return (
    <div className={`${baseClass} ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt }) =>
            src ? (
              <span className="block my-4">
                <img
                  src={src}
                  alt={alt ?? ""}
                  className="rounded-xl max-w-full h-auto"
                />
              </span>
            ) : null,
          p: ({ children }) => <p className="mb-4">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
          h2: ({ children }) => <h2 className="text-lg font-bold text-navy mt-6 mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-bold text-navy mt-4 mb-2">{children}</h3>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
