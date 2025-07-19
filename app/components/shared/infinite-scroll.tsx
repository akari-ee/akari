import React from "react";
import { useInView } from "react-intersection-observer";

interface InfiniteScrollProps {
  children: React.ReactNode;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isLoading?: boolean;
  rootMargin?: string;
  threshold?: number;
  loader?: React.ReactNode;
}

export default function InfiniteScroll({
  children,
  fetchNextPage,
  hasNextPage,
  isLoading = false,
  rootMargin = "100px",
  threshold = 0.2,
  loader,
}: InfiniteScrollProps) {
  const { ref: loadMoreRef } = useInView({
    threshold,
    rootMargin,
    onChange: (inView) => {
      if (inView && hasNextPage && !isLoading) {
        fetchNextPage();
      }
    },
  });

  return (
    <>
      {children}

      {/* Intersection observer target */}
      <div
        className="h-10  w-full col-span-full"
        ref={loadMoreRef}
        role="status"
        aria-live="polite"
        aria-busy={isLoading}
        tabIndex={-1}
      >
        {isLoading && (
          <span className="sr-only">더 많은 콘텐츠를 불러오는 중…</span>
        )}
      </div>
    </>
  );
}
