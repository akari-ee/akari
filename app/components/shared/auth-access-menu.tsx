import { Link } from "react-router";
import { Button } from "../ui/button";

export default function AuthAccessMenu() {
  return (
    <div>
      <Button
        asChild
        size={"sm"}
        variant={"secondary"}
        className="shadow-none"
      >
        <Link to={"/collection/new"}>컬렉션 등록</Link>
      </Button>
    </div>
  );
}
