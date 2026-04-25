import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ProfileCard } from "./ProfileCard";
import { useUser } from "./useUser";
import { useAuth } from "../../hooks/useAuth";
import { UnauthenticatedState } from "../rag-chat/chat-states/UnauthenticatedState";
export const ProfilePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { user, isLoading, error } = useUser();

  if (authLoading || isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <UnauthenticatedState />;

  if (!user) navigate("/error");

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
        <ProfileCard user={user} />
      </div>
    </div>
  );
};
