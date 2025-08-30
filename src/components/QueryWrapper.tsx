import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface QueryWrapperProps {
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  refetch?: () => void;
  children: ReactNode;
}

export default function QueryWrapper({
  isLoading,
  isError,
  error,
  refetch,
  children,
}: QueryWrapperProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-medium">Xatolik yuz berdi!</p>
          {error instanceof Error && (
            <p className="text-muted-foreground">{error.message}</p>
          )}
          {refetch && (
            <Button onClick={refetch} variant="default">
              Qayta urinib ko'rish
            </Button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
