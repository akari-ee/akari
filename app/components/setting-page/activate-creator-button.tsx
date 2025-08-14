import { LoaderIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function ActivateCreatorButton({
  className = "",
  isCreator,
  onToggle,
  loading,
}: {
  className?: string;
  isCreator: boolean;
  onToggle: () => void | Promise<void>;
  loading?: boolean;
}) {
  return (
    <Button
      type="button"
      variant={isCreator ? "ghost" : "secondary"}
      size="sm"
      className={className}
      onClick={onToggle}
      disabled={loading}
    >
      {loading ? (
        <LoaderIcon className="w-4 h-4 animate-spin" />
      ) : isCreator ? (
        "비활성화"
      ) : (
        "활성화"
      )}
    </Button>
  );
}
