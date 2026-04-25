import { Bot } from "lucide-react";
import { AuthComponent } from "../../auth";

// ── Animated "not authenticated" state ───────────────────────────────────────
export const UnauthenticatedState = () => (
  <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
    <style>{`
      @keyframes shimmer {
        0%   { background-position: -200% center; }
        100% { background-position:  200% center; }
      }
      .login-shimmer-wrap {
        background: linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.65) 40%, hsl(var(--primary)) 60%, hsl(var(--primary) / 0.65) 100%);
        background-size: 200% auto;
        animation: shimmer 2.4s linear infinite;
        border-radius: 12px;
        padding: 1.5px;
      }
      @keyframes float-ring {
        0%, 100% { transform: scale(1);    opacity: 0.18; }
        50%       { transform: scale(1.07); opacity: 0.3;  }
      }
      .ring-a { animation: float-ring 3s   ease-in-out infinite; }
      .ring-b { animation: float-ring 3s   ease-in-out infinite 0.6s; }
      .ring-c { animation: float-ring 3s   ease-in-out infinite 1.2s; }
    `}</style>
    <div className="w-full max-w-sm text-center">
      <div className="relative flex items-center justify-center mb-8">
        <span className="ring-a absolute w-32 h-32 rounded-full border-2 border-blue-300 dark:border-blue-700" />
        <span
          className="ring-b absolute rounded-full border border-blue-300/70 dark:border-blue-700/70"
          style={{ width: 88, height: 88 }}
        />
        <span className="ring-c absolute w-16 h-16 rounded-full border border-blue-200 dark:border-blue-800" />
        <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/30">
          <Bot className="h-7 w-7 text-white" />
        </div>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Добро пожаловать
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
        Войдите в аккаунт, чтобы начать общение
        <br />с ассистентом
      </p>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {["Умный поиск", "История чатов", "Быстрые ответы"].map((f) => (
          <span
            key={f}
            className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
          >
            {f}
          </span>
        ))}
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="relative group">
          <div className="absolute inset-0 rounded-xl bg-primary/25 blur-lg scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="login-shimmer-wrap">
            <div className="rounded-[10px] bg-white dark:bg-gray-950 px-6 py-2.5 flex items-center justify-center min-w-[180px]">
              <AuthComponent />
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Через Google аккаунт — быстро и безопасно
        </p>
      </div>
    </div>
  </div>
);
