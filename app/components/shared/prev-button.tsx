import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { ChevronLeftIcon } from "lucide-react";

export default function PrevButton() {
  const navigate = useNavigate();

  return (
    <Button
      size={"icon"}
      variant={"ghost"}
      onClick={() => navigate(-1)}
      className="rounded-full shadow-none"
    >
      <ChevronLeftIcon className="text-default-500 size-8" strokeWidth={1.5} />
    </Button>
  );
}
