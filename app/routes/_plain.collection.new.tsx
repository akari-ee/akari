import { useNavigate } from "react-router";
import type { Route } from "./+types/_plain.collection.new";

export default function CollectionNewRoute({
  actionData,
}: Route.ComponentProps) {
  const navigate = useNavigate();

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*" // 필요에 따라 필터
      />
      <button type="submit">Upload</button>
    </div>
  );
}
