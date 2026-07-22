"use client";

import { Check, Copy } from "lucide-react";
import {
  Children,
  isValidElement,
  useState,
  type ReactNode,
} from "react";

type CodeBlockProps = {
  children: ReactNode;
};

function getCodeMeta(children: ReactNode) {
  const child = Children.toArray(children)[0];
  if (!isValidElement<{ className?: string; children?: ReactNode }>(child)) {
    return { language: "", code: "" };
  }

  const className = child.props.className || "";
  const match = /language-([\w+-]+)/.exec(className);
  const language = match?.[1] || "";
  const code = String(child.props.children ?? "").replace(/\n$/, "");

  return { language, code, className };
}

export function CodeBlock({ children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { language, code } = getCodeMeta(children);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      window.prompt("Copy code:", code);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="code-block">
      <div className="code-block__toolbar">
        <span className="code-block__lang">{language || "code"}</span>
        <button
          type="button"
          className="code-block__copy"
          onClick={copyCode}
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? <Check size={14} strokeWidth={2.2} /> : <Copy size={14} strokeWidth={2.2} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="prose__pre">{children}</pre>
    </div>
  );
}
