"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import {
  FacebookLogo,
  LinkLogo,
  TelegramLogo,
  WhatsAppLogo,
  XLogo,
} from "@/components/BrandIcons";

type ShareButtonsProps = {
  url: string;
  title: string;
  description?: string;
  variant?: "bar" | "sidebar";
};

export function ShareButtons({
  url,
  title,
  description,
  variant = "bar",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(
    description ? `${title}. ${description}` : title,
  );

  const links = [
    {
      label: "X (Twitter)",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: XLogo,
      tone: "x",
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: FacebookLogo,
      tone: "facebook",
    },
    {
      label: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
      icon: WhatsAppLogo,
      tone: "whatsapp",
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: TelegramLogo,
      tone: "telegram",
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy this link:", url);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className={`share-panel share-panel--${variant}`}>
      <p className="share-panel__label">Share post</p>
      <div className="share-panel__actions">
        <button
          type="button"
          className="share-item share-item--copy"
          onClick={copyLink}
          aria-label={copied ? "Link copied" : "Copy link"}
        >
          <span className="share-item__icon" aria-hidden="true">
            {copied ? <Check size={18} strokeWidth={2.2} /> : <LinkLogo />}
          </span>
          <span>{copied ? "Copied" : "Copy link"}</span>
        </button>

        {links.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`share-item share-item--${item.tone}`}
              aria-label={`Share on ${item.label}`}
            >
              <span className="share-item__icon" aria-hidden="true">
                <Icon />
              </span>
              <span>{item.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
