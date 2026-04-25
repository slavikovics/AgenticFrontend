import { User, Mail, Calendar, Globe, Hash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { InfoRow } from "./InfoRow";
import { getInitials } from "../../utils/getInitials";
import { formatDate } from "../../utils/formatDate";

const LOCALE_LABELS = {
  ru: "Русский",
  en: "English",
};

export const ProfileCard = ({ user }) => {
  const initials = getInitials(user.firstName, user.lastName);

  const displayName =
    user.fullName ||
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
    "Пользователь";

  const localeLabel = LOCALE_LABELS[user.locale] ?? user.locale ?? "—";

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Hero banner */}
      <div className="relative h-24 bg-gradient-to-r from-blue-500/15 via-primary/10 to-purple-500/10 dark:from-blue-500/10 dark:via-primary/8 dark:to-purple-500/8">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(var(--muted-foreground) / 0.25) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        {/* Avatar — overlaps banner */}
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

      {/* Name + ID */}
      <div className="pt-12 pb-5 px-6 text-center border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">{displayName}</h2>
        <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted-foreground">
          <Hash className="h-3 w-3" />
          <span>{user.id}</span>
        </div>
      </div>

      {/* Info rows */}
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
  );
};
