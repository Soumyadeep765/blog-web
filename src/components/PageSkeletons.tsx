"use client";

import type { ReactNode } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type AppSkeletonThemeProps = {
  children: ReactNode;
};

export function AppSkeletonTheme({ children }: AppSkeletonThemeProps) {
  return (
    <SkeletonTheme
      baseColor="var(--skeleton-base)"
      highlightColor="var(--skeleton-highlight)"
      borderRadius={10}
      duration={1.2}
    >
      {children}
    </SkeletonTheme>
  );
}

export function BlogIndexSkeleton() {
  return (
    <AppSkeletonTheme>
      <div
        className="blog-index skeleton-page"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="blog-index__header">
          <Skeleton width="55%" height={42} />
        </div>
        <Skeleton height={48} className="skeleton-search" />
        <div className="skeleton-chips">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} width={78} height={32} borderRadius={999} />
          ))}
        </div>
        <div className="post-grid post-grid--blog">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="skeleton-card">
              <Skeleton height={180} className="skeleton-card__media" />
              <Skeleton width="88%" height={20} style={{ marginTop: 12 }} />
              <Skeleton count={2} style={{ marginTop: 8 }} />
              <Skeleton width={90} height={14} style={{ marginTop: 10 }} />
            </div>
          ))}
        </div>
      </div>
    </AppSkeletonTheme>
  );
}

export function ArticleSkeleton() {
  return (
    <AppSkeletonTheme>
      <div
        className="article-layout skeleton-page"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="article">
          <Skeleton width="45%" height={14} style={{ marginBottom: 18 }} />
          <Skeleton width="92%" height={40} />
          <Skeleton width={120} height={16} style={{ marginTop: 12 }} />
          <Skeleton
            height={260}
            className="skeleton-article-cover"
            style={{ marginTop: 20, marginBottom: 20 }}
          />
          <Skeleton count={8} style={{ marginBottom: 10 }} />
        </div>
        <aside className="article-sidebar skeleton-sidebar">
          <Skeleton width="40%" height={14} />
          <Skeleton count={4} style={{ marginTop: 10 }} />
          <Skeleton width="35%" height={14} style={{ marginTop: 18 }} />
          <Skeleton count={5} style={{ marginTop: 10 }} />
          <Skeleton height={42} style={{ marginTop: 18 }} />
          <Skeleton width="45%" height={14} style={{ marginTop: 18 }} />
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="skeleton-related">
              <Skeleton width={72} height={48} />
              <div style={{ flex: 1 }}>
                <Skeleton count={2} />
              </div>
            </div>
          ))}
        </aside>
      </div>
    </AppSkeletonTheme>
  );
}
