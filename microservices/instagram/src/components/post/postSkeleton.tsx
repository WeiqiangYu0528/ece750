import React from "react";
import Skeleton from "react-loading-skeleton";

export default function PostSkeleton() {
  return (
    <div data-testid="skeleton" >
      <div className="rounded col-span-4 border bg-white border-gray-primary mb-12">
        <div className="flex h-4 p-4 py-8">
          <div className="flex items-center justify-end">
            <div className="mr-5">
            <Skeleton circle height={40} width={40} />
            </div>
            <div>
            <Skeleton height={40} width={450} />
            </div>
          </div>
        </div>
        <div className="px-5 pb-1">
        <Skeleton height="350px" width="505px" />
        </div>
        <div className="px-5 py-1">
            <Skeleton height={20} width="100%" />
        </div>
        <div className="px-5 py-1">
            <Skeleton height={20} width="100%" />
        </div>
        <div className="px-5 py-1 pb-3">
            <Skeleton height={20} width="100%" />
        </div>
      </div>
    </div>
  );
}
