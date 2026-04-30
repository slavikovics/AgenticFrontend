export const makeComponents = ({
  styles,
  isDarkMode,
  codeStyle,
  mounted,
  CodeBlock,
}) => ({
  h1: ({ children }) => <h1 className={styles.h1}>{children}</h1>,
  h2: ({ children }) => <h2 className={styles.h2}>{children}</h2>,
  h3: ({ children }) => <h3 className={styles.h3}>{children}</h3>,
  h4: ({ children }) => <h4 className={styles.h4}>{children}</h4>,
  h5: ({ children }) => (
    <h5 className="text-sm font-medium mt-4 mb-2 text-gray-600 dark:text-gray-400">
      {children}
    </h5>
  ),
  h6: ({ children }) => (
    <h6 className="text-sm font-medium mt-3 mb-1 text-gray-500 dark:text-gray-500">
      {children}
    </h6>
  ),

  p: ({ children }) => <p className={styles.p}>{children}</p>,
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900 dark:text-white">
      {children}
    </strong>
  ),
  em: ({ children }) => (
    <em className="italic text-gray-600 dark:text-gray-400">{children}</em>
  ),
  del: ({ children }) => (
    <del className="line-through text-gray-400 dark:text-gray-500">
      {children}
    </del>
  ),

  // ── Lists ─────────────────────────────────────────────────────────────
  ul: ({ children }) => (
    <ul className={`mb-4 ml-5 list-disc ${styles.spacing}`}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className={`mb-4 ml-5 list-decimal ${styles.spacing}`}>{children}</ol>
  ),
  li: ({ children, ...props }) => {
    const isTask = props?.className?.includes("task-list-item");
    return (
      <li
        className={`text-sm text-gray-700 dark:text-gray-300 leading-relaxed ${
          isTask ? "flex items-start gap-2 list-none" : "ml-1 pl-1"
        }`}
      >
        {children}
      </li>
    );
  },

  // ── Code ──────────────────────────────────────────────────────────────
  code: ({ node, inline, className, children, ...props }) => {
    if (inline) {
      return (
        <code
          className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs font-mono text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <CodeBlock
        className={className}
        isDarkMode={isDarkMode}
        codeStyle={codeStyle}
        mounted={mounted}
        {...props}
      >
        {children}
      </CodeBlock>
    );
  },

  // ── Block elements ────────────────────────────────────────────────────
  blockquote: ({ children }) => (
    <blockquote className={styles.blockquote}>{children}</blockquote>
  ),
  hr: () => (
    <hr className="my-6 border-t border-gray-300 dark:border-gray-700 opacity-50" />
  ),

  // ── Links & media ─────────────────────────────────────────────────────
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium underline decoration-2 decoration-blue-300/30 hover:decoration-blue-400/50 transition-all duration-200"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  img: ({ src, alt }) => (
    <div className="my-6 flex justify-center">
      <div className="relative group">
        <img
          src={src}
          alt={alt}
          className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-md group-hover:shadow-lg transition-shadow duration-300"
          loading="lazy"
        />
        {alt && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-lg">
            {alt}
          </div>
        )}
      </div>
    </div>
  ),

  // ── Tables ────────────────────────────────────────────────────────────
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
      {children}
    </tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
      {children}
    </td>
  ),

  // ── Task list ─────────────────────────────────────────────────────────
  input: ({ checked, type }) => {
    if (type !== "checkbox") return null;
    return (
      <input
        type="checkbox"
        checked={checked || false}
        readOnly
        className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
      />
    );
  },
});
