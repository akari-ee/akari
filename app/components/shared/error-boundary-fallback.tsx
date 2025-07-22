import type { ErrorBoundaryFallbackProps } from "@suspensive/react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";

// TODO: 401, 403, 408, 429, 500 처리
export default function ErrorBoundaryFallback({
  reset,
  error,
}: ErrorBoundaryFallbackProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 h-full items-center justify-center">
      <h2 className="font-medium text-2xl">{error.message}</h2>
      <div className="flex gap-2 items-center">
        <Button
          variant={"secondary"}
          size={"sm"}
          onClick={() => {
            reset();
          }}
        >
          다시 시도
        </Button>
        <span className="text-xs ml-4">또는</span>
        <Button variant={"link"} size={"sm"} onClick={() => navigate(-1)}>
          이전으로
        </Button>
      </div>
    </div>
  );
}
