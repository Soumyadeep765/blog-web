"use client";

import { Check, Link as LinkIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

type HeadingAnchorProps = {
  id: string;
  level: 2 | 3;
  children: ReactNode;
};

export function HeadingAnchor({ id, level, children }: HeadingAnchorProps) {
  const [copied, setCopied] = useState(false);
  const Tag = level === 2 ? "h2" : "h3";

  async function copyHeadingLink() {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy this heading link:", url);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <Tag id={id} className="prose__heading">
      <a href={`#${id}`} className="prose__heading-hash" aria-label="Jump to heading">
        #
      </a>
      <span className="prose__heading-text">{children}</span>
      <button
        type="button"
        className="prose__heading-copy"
        onClick={copyHeadingLink}
        aria-label={copied ? "Heading link copied" : "Copy link to this heading"}
        title={copied ? "Copied" : "Copy heading link"}
      >
        {copied ? (
          <Check size={15} strokeWidth={2.2} aria-hidden="true" />
        ) : (
          <LinkIcon size={15} strokeWidth={2.2} aria-hidden="true" />
        )}
      </button>
    </Tag>
  );
}
