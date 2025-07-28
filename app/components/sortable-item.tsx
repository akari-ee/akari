import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DotsSixVerticalIcon } from "@phosphor-icons/react";

export function SortableItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: "relative",
  };

  return (
    <OverlaySortableItem ref={setNodeRef} style={style} {...attributes}>
      <div
        {...listeners}
        style={{
          cursor: "grab",
          position: "absolute",
          top: 4,
          left: 4,
          zIndex: 10,
        }}
      >
        <div className="rounded-full bg-black/80 p-0.5">
          <DotsSixVerticalIcon />
        </div>
      </div>
      {children}
    </OverlaySortableItem>
  );
}

export function OverlaySortableItem(
  props: React.HTMLAttributes<HTMLDivElement> &
    React.RefAttributes<HTMLDivElement>
) {
  return <div {...props}>{props.children}</div>;
}
