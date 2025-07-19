import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { ChevronLeftIcon } from "lucide-react";

export default function PrevButton() {
  const navigate = useNavigate();

  return (
    <Button
      size={"icon"}
      variant={"secondary"}
      onClick={() => navigate(-1)}
      className="rounded-full shadow-none"
    >
      <ChevronLeftIcon
        className="text-default-500"
        strokeWidth={1.5}
        size={16}
      />
    </Button>
  );
}
