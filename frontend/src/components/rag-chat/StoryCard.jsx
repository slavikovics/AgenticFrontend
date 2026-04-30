// src/components/ui/rag-chat/StoryCard.jsx
import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Brain,
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
  Zap,
  Wrench,
  Database,
  Clock,
  AlertCircle,
  FileText,
  TrendingUp,
  Hash,
  BookOpen,
} from "lucide-react";

const isNumeric = (val) =>
  val !== "" && val !== null && val !== undefined && isFinite(Number(val));

const iconMap = {
  search: Search,
  brain: Brain,
  sparkles: Sparkles,
  check: CheckCircle2,
  error: XCircle,
  loading: Loader2,
  zap: Zap,
  wrench: Wrench,
  database: Database,
  clock: Clock,
  alert: AlertCircle,
  file: FileText,
  trending: TrendingUp,
  hash: Hash,
  book: BookOpen,
};

const colorConfig = {
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/20",
    border: "border-purple-200 dark:border-purple-800",
    icon: "text-purple-600 dark:text-purple-400",
    badge:
      "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    border: "border-emerald-200 dark:border-emerald-800",
    icon: "text-emerald-600 dark:text-emerald-400",
    badge:
      "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/20",
    border: "border-orange-200 dark:border-orange-800",
    icon: "text-orange-600 dark:text-orange-400",
    badge:
      "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950/20",
    border: "border-green-200 dark:border-green-800",
    icon: "text-green-600 dark:text-green-400",
    badge:
      "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-200 dark:border-blue-800",
    icon: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-950/20",
    border: "border-red-200 dark:border-red-800",
    icon: "text-red-600 dark:text-red-400",
    badge: "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300",
  },
  gray: {
    bg: "bg-gray-50 dark:bg-gray-900/50",
    border: "border-gray-200 dark:border-gray-700",
    icon: "text-gray-600 dark:text-gray-400",
    badge: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
  },
  gradient: {
    bg: "bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30",
    border: "border-blue-200 dark:border-blue-800",
    icon: "text-blue-600 dark:text-blue-400",
    badge: "bg-white/50 dark:bg-black/20 text-gray-700 dark:text-gray-300",
  },
};

const DocumentResults = ({ documents }) => {
  const [expandedDoc, setExpandedDoc] = useState(null);

  if (!documents || documents.length === 0) {
    return (
      <div className="text-xs text-gray-500 italic">
        Нет документов для отображения
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
        <BookOpen className="h-3.5 w-3.5" />
        <span>Найдено документов: {documents.length}</span>
      </div>

      <div className="space-y-2">
        {documents.map((doc, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-black/20 overflow-hidden"
          >
            <div
              onClick={() => setExpandedDoc(expandedDoc === idx ? null : idx)}
              className="p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                      Документ #{doc.document}
                    </span>
                    {doc.score && isNumeric(doc.score) && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                        Релевантность: {(doc.score * 100).toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FileText className="h-3 w-3" />
                    <span className="truncate">{doc.source}</span>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                    expandedDoc === idx ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {expandedDoc === idx && (
              <div className="p-3 pt-0 border-t border-gray-200 dark:border-gray-700 animate-in fade-in duration-200">
                <div className="mt-2">
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Содержание:
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {doc.content}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const StoryCard = ({ card }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = iconMap[card.icon] || Search;
  const colors = colorConfig[card.color] || colorConfig.blue;

  if (card.isAnswer) return null;

  const hasDocuments =
    card.documents &&
    Array.isArray(card.documents) &&
    card.documents.length > 0;

  return (
    <div
      className={`rounded-lg border ${colors.bg} ${colors.border} transition-all duration-200`}
    >
      <div className="p-3">
        <div className="flex items-start gap-2">
          <div className={`p-1.5 rounded-md ${colors.badge} flex-shrink-0`}>
            <Icon className={`h-3.5 w-3.5 ${colors.icon}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {card.title}
              </h4>
              {card.badge && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${colors.badge}`}
                >
                  {card.badge}
                </span>
              )}
              {card.timestamp && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {card.timestamp}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
              {card.description}
            </p>
          </div>

          {(card.details || hasDocuments) && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-all flex-shrink-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-3.5 w-3.5 text-gray-500" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
              )}
            </button>
          )}
        </div>

        {isExpanded && (
          <div className="mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50 animate-in fade-in duration-200">
            {card.type === "tool_result" && hasDocuments ? (
              <DocumentResults documents={card.documents} />
            ) : card.type === "tool_result" && card.resultLength ? (
              <div className="space-y-2">
                {card.resultLength && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Database className="h-3 w-3" />
                    <span>
                      Найдено данных: {Math.ceil(card.resultLength / 1000)}KB
                    </span>
                  </div>
                )}
                <div className="bg-black/5 dark:bg-white/5 rounded-md p-2">
                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap font-mono max-h-32">
                    {card.details}
                  </pre>
                </div>
              </div>
            ) : card.type === "tool_call" ? (
              <div className="bg-black/5 dark:bg-white/5 rounded-md p-2">
                {Object.entries(card.details).map(([key, value]) => (
                  <div key={key} className="flex gap-2 text-xs mb-1 last:mb-0">
                    <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">
                      {key}:
                    </span>
                    <span className="font-mono text-gray-600 dark:text-gray-400 break-all">
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-black/5 dark:bg-white/5 rounded-md p-2">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {typeof card.details === "string"
                    ? card.details
                    : JSON.stringify(card.details, null, 2)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
