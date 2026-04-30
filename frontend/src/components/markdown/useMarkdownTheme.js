import { useState, useEffect, useMemo } from "react";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../providers/theme-provider";

export const useMarkdownTheme = (themeProp = "auto") => {
  const { theme: contextTheme } = useTheme?.() || { theme: undefined };
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = useMemo(() => {
    if (themeProp !== "auto") return themeProp;
    if (contextTheme) return contextTheme;
    if (mounted) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  }, [themeProp, contextTheme, mounted]);

  const isDarkMode = currentTheme === "dark";
  const codeStyle = isDarkMode ? vscDarkPlus : vs;

  return { isDarkMode, codeStyle, mounted };
};
