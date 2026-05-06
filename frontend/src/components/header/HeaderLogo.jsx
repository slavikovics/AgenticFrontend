import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeaderLogo = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center gap-2.5 cursor-pointer select-none"
      onClick={() => navigate("/")}
    >
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
        <GraduationCap className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="text-base font-semibold text-foreground hidden sm:block leading-tight">
        Ассистент абитуриента
      </span>
      <span className="text-base font-semibold text-foreground sm:hidden leading-tight">
        Ассистент
      </span>
    </div>
  );
};
