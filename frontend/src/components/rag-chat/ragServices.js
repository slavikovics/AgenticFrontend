import { Bot, Layers } from "lucide-react";

export const RAG_SERVICES = [
  {
    id: "agentic",
    label: "Agentic RAG",
    labelRu: "Агентный RAG",
    description: "Multi-step agent with tool calls",
    descriptionRu: "Многошаговый агент с вызовом инструментов",
    icon: Bot,
    wsUrl:
      import.meta.env.VITE_RAG_AGENTIC_WS_URL ||
      "ws://localhost:8000/api/v1/ws/query",
  },
  {
    id: "hybrid",
    label: "Hybrid Search",
    labelRu: "Гибридный поиск",
    description: "Fast hybrid vector + keyword search",
    descriptionRu: "Быстрый векторный и ключевой поиск",
    icon: Layers,
    wsUrl:
      import.meta.env.VITE_RAG_HYBRID_WS_URL ||
      "ws://localhost:8035/rag/ws/query",
  },
];

export const DEFAULT_SERVICE = RAG_SERVICES[0];
