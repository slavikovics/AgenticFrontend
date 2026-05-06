import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { getLanguage, getLanguageDisplayName } from "../languageMap";

const CopyIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const CodeBlockHeader = ({ displayName, copyLabel, onCopy }) => (
  <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-green-500" />
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
        {displayName}
      </span>
    </div>
    {onCopy && (
      <button
        className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center gap-1"
        onClick={onCopy}
      >
        <CopyIcon />
        {copyLabel}
      </button>
    )}
  </div>
);

export const CodeBlock = ({
  className,
  children,
  isDarkMode,
  codeStyle,
  mounted,
  ...props
}) => {
  const [copyStatus, setCopyStatus] = useState({});

  const language = getLanguage(className);
  const displayName = getLanguageDisplayName(language);
  const codeString = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopyStatus((prev) => ({ ...prev, [language]: "Скопировано!" }));
      setTimeout(() => {
        setCopyStatus((prev) => ({ ...prev, [language]: "Копировать" }));
      }, 2000);
    } catch {
      setCopyStatus((prev) => ({ ...prev, [language]: "Ошибка" }));
    }
  };

  return (
    <div className="my-5 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
      <CodeBlockHeader
        displayName={displayName}
        copyLabel={copyStatus[language] || "Копировать"}
        onCopy={mounted ? handleCopy : undefined}
      />

      {mounted ? (
        <SyntaxHighlighter
          language={language}
          style={codeStyle}
          customStyle={{
            margin: 0,
            padding: "1rem",
            fontSize: "0.875rem",
            backgroundColor: isDarkMode ? "#1a202c" : "#ffffff",
            overflowX: "auto",
          }}
          showLineNumbers
          lineNumberStyle={{
            minWidth: "3em",
            paddingRight: "1em",
            textAlign: "right",
            color: isDarkMode ? "#718096" : "#a0aec0",
            borderRight: "1px solid",
            borderRightColor: isDarkMode ? "#2d3748" : "#e2e8f0",
          }}
          wrapLines
          wrapLongLines
          {...props}
        >
          {codeString}
        </SyntaxHighlighter>
      ) : (
        <pre className="p-4 overflow-x-auto bg-white dark:bg-gray-900 m-0">
          <code className={`text-sm font-mono ${className}`}>{children}</code>
        </pre>
      )}
    </div>
  );
};
