import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { useMarkdownTheme } from "./useMarkdownTheme";
import { COMPACT_STYLES, FULL_STYLES } from "./markdownStyles";
import { CodeBlock } from "./components/CodeBlock";
import { makeComponents } from "./components/markdownComponents";

const fixInlineCode = (content) => {
  if (!content) return content;
  if (typeof content !== "string") return JSON.stringify(content, null, 2);
  return content.replace(/(?<!`)`([^`\n]+)`(?!`)/g, "**$1**");
};

export const SimpleMarkdownContent = ({
  content,
  className = "",
  compact = false,
  theme: themeProp = "auto",
}) => {
  const { isDarkMode, codeStyle, mounted } = useMarkdownTheme(themeProp);

  const processedContent = useMemo(() => fixInlineCode(content), [content]);

  const styles = compact ? COMPACT_STYLES : FULL_STYLES;

  const components = useMemo(
    () => makeComponents({ styles, isDarkMode, codeStyle, mounted, CodeBlock }),
    [isDarkMode, codeStyle, mounted, compact],
  );

  if (!content) return null;

  return (
    <div
      className={`${className} ${compact ? "" : "prose prose-sm max-w-none dark:prose-invert"}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};
