import { useNavigate } from "react-router-dom";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-8 text-center">
          <div className="flex justify-center mb-5">
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/50 inline-flex">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <div className="mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-medium">
              500
            </span>
          </div>

          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Произошла ошибка
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Что-то пошло не так. Попробуйте обновить страницу.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="gap-2"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Обновить
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/chats")}
              className="gap-2"
            >
              <Home className="h-3.5 w-3.5" />
              На главную
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
