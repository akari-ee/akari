import React from "react";

interface MasonryGridProps<T> {
  items: T[];
  children: (item: T, index: number) => React.ReactNode;
}

export default function MasonryGrid<T extends { id?: string | number }>({
  items,
  children,
}: MasonryGridProps<T>) {
  return (
    <div>
      {items.map((item, idx) =>
        React.cloneElement(children(item, idx) as React.ReactElement, {
          key: item.id ?? idx,
        })
      )}
    </div>
  );
}
