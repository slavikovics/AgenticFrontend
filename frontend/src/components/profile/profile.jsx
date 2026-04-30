// src/components/ui/profile/profile.jsx
import { useState, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Alert, AlertDescription } from "../ui/alert";
import {
  User,
  Mail,
  Calendar,
  Globe,
  AlertCircle,
  Loader2,
  Hash,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:8081";

const userAPI = {
  async getCurrentUser() {
    const token = localStorage.getItem("jwt_token");
    if (!token) throw new Error("Authentication required. Please login.");
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      if (response.status === 401)
        throw new Error("Session expired. Please login again.");
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch user data");
    }
    return response.json();
  },
};

const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return "U";
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
};

const formatDate = (dateString) => {
  if (!dateString) return "—";
  try {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
    <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="flex-1 min-w-0 flex items-baseline justify-between gap-4">
      <span className="text-xs text-muted-foreground flex-shrink-0">
        {label}
      </span>
      <span className="text-sm font-medium text-foreground truncate text-right">
        {value || "—"}
      </span>
    </div>
  </div>
);

export function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await userAPI.getCurrentUser();
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex flex-col gap-3">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={loadUserData}>
                Попробовать снова
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const initials = getInitials(user.firstName, user.lastName);
  const displayName =
    user.fullName ||
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
    "Пользователь";
  const localeLabel =
    user.locale === "ru"
      ? "Русский"
      : user.locale === "en"
        ? "English"
        : (user.locale ?? "—");

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-10 max-w-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Профиль
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Личная информация аккаунта
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="relative h-24 bg-gradient-to-r from-blue-500/15 via-primary/10 to-purple-500/10 dark:from-blue-500/10 dark:via-primary/8 dark:to-purple-500/8">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle, hsl(var(--muted-foreground) / 0.25) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            />
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
              <div className="p-1 rounded-full bg-card shadow-md">
                <Avatar className="h-20 w-20">
                  {user.pictureUrl && (
                    <AvatarImage src={user.pictureUrl} alt={displayName} />
                  )}
                  <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>

          <div className="pt-12 pb-5 px-6 text-center border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              {displayName}
            </h2>
            <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted-foreground">
              <Hash className="h-3 w-3" />
              <span>{user.id}</span>
            </div>
          </div>

          <div className="px-6 py-2">
            <InfoRow label="Email" value={user.email} icon={Mail} />
            <InfoRow label="Имя" value={user.firstName} icon={User} />
            <InfoRow label="Фамилия" value={user.lastName} icon={User} />
            <InfoRow label="Язык" value={localeLabel} icon={Globe} />
            <InfoRow
              label="Дата регистрации"
              value={formatDate(user.createdAt)}
              icon={Calendar}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
