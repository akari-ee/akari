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
    <div className="columns-2 md:columns-3 xl:columns-5 gap-6 space-y-4 p-4">
      {items.map((item, idx) =>
        React.cloneElement(children(item, idx) as React.ReactElement, {
          key: item.id ?? idx,
        })
      )}
    </div>
  );
}
