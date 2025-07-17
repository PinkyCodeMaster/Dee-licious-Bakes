"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function UserPagination({ page, totalPages, total, hasNext, hasPrev }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigateToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`/admin/users?${params.toString()}`);
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, total)} of {total} users
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPrev}
          onClick={() => navigateToPage(page - 1)}
        >
          Previous
        </Button>
        <div className="flex items-center space-x-1">
          {getVisiblePages().map((pageNum, index) => (
            pageNum === "..." ? (
              <span key={`dots-${index}`} className="px-2 text-muted-foreground">
                ...
              </span>
            ) : (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => navigateToPage(pageNum as number)}
              >
                {pageNum}
              </Button>
            )
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNext}
          onClick={() => navigateToPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}