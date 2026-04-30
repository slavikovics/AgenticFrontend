export const eventToStoryCard = (event) => {
  const ts = new Date().toLocaleTimeString();
  const id = () => `${Date.now()}_${Math.random()}`;

  switch (event.type) {
    case "iteration_start":
      return {
        id: `iter_${id()}`,
        type: "iteration",
        title: "Начало анализа",
        description: "Агент приступил к обработке вашего запроса",
        badge: `Максимум: ${event.data?.max_iterations} итераций`,
        details: {
          query: event.data?.query,
          maxIterations: event.data?.max_iterations,
        },
        icon: "zap",
        color: "purple",
        timestamp: ts,
      };

    case "llm_response":
      return {
        id: `llm_${id()}`,
        type: "decision",
        title: event.data?.has_tool_calls
          ? "Принятие решения"
          : "Формирование ответа",
        description: event.data?.has_tool_calls
          ? `Агент решил использовать ${event.data.tool_call_count} инструмент(ов) для поиска`
          : "Агент готовит финальный ответ на основе найденной информации",
        details: event.data,
        icon: event.data?.has_tool_calls ? "wrench" : "brain",
        color: "emerald",
        timestamp: ts,
      };

    case "tool_call":
      return {
        id: `tool_${id()}`,
        type: "tool_call",
        title: "Вызов инструмента",
        description: "Поиск в базе знаний",
        badge: event.data?.tool_name,
        details: event.data?.arguments,
        icon: "search",
        color: "orange",
        timestamp: ts,
      };

    case "tool_result": {
      let documents = null;
      let resultPreview = event.data?.result_preview || "Нет данных";
      try {
        if (event.data?.result_preview?.trim().startsWith("[")) {
          const parsed = JSON.parse(event.data.result_preview);
          if (Array.isArray(parsed) && parsed[0]?.document !== undefined) {
            documents = parsed;
            resultPreview = `Найдено ${parsed.length} документов`;
          }
        }
      } catch {
        /* ignore parse error */
      }

      return {
        id: `result_${id()}`,
        type: "tool_result",
        title: event.data?.success ? "Информация найдена" : "Результат поиска",
        description: event.data?.success
          ? `Успешно найдено${event.data?.result_length ? " " + Math.ceil(event.data.result_length / 1000) + "KB" : ""} данных`
          : "Не удалось найти точную информацию",
        details: resultPreview,
        documents,
        resultLength: event.data?.result_length ?? null,
        icon: event.data?.success ? "check" : "alert",
        color: event.data?.success ? "green" : "red",
        timestamp: ts,
      };
    }

    case "complete":
      return {
        id: `complete_${id()}`,
        type: "complete",
        title: "Обработка завершена",
        description:
          event.data?.status === "success"
            ? "Агент успешно обработал ваш запрос"
            : "Обработка завершена",
        icon: "sparkles",
        color: "blue",
        timestamp: ts,
      };

    case "error":
      return {
        id: `error_${id()}`,
        type: "error",
        title: "Ошибка",
        description: event.content || "Произошла ошибка при обработке",
        icon: "error",
        color: "red",
        timestamp: ts,
      };

    default:
      return null;
  }
};
