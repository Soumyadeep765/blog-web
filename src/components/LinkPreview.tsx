"use client";

import { useEffect, useState } from "react";

type PreviewData = {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  url: string;
};

type LinkPreviewProps = {
  href: string;
  fallbackText?: string;
};

export function LinkPreview({ href, fallbackText }: LinkPreviewProps) {
  const [data, setData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);

    fetch(`/api/link-preview?url=${encodeURIComponent(href)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((payload) => {
        if (!active) return;
        if (payload.image) {
          setData(payload);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [href]);

  if (error) {
    const displayText = fallbackText === "preview" ? href : fallbackText || href;
    return (
      <a href={href} className="link-preview-fallback" target="_blank" rel="noopener noreferrer">
        {displayText}
      </a>
    );
  }

  if (loading) {
    return (
      <div className="link-preview-card link-preview-card--loading">
        <div className="link-preview-card__media">
          <div className="link-preview-card__image-skeleton" style={{ width: "100%", height: "100%" }} />
        </div>
        <div className="link-preview-card__content">
          <div className="link-preview-card__site-skeleton" />
          <div className="link-preview-card__title-skeleton" />
          <div className="link-preview-card__desc-skeleton" />
          <div className="link-preview-card__desc-skeleton-short" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="link-preview-card"
    >
      <div className="link-preview-card__media">
        <img
          src={data.image}
          alt={data.title || "Link preview"}
          className="link-preview-card__image"
          loading="lazy"
        />
      </div>
      <div className="link-preview-card__content">
        {data.siteName && <span className="link-preview-card__site">{data.siteName}</span>}
        <h3 className="link-preview-card__title">{data.title || href}</h3>
        {data.description && <p className="link-preview-card__description">{data.description}</p>}
      </div>
    </a>
  );
}
