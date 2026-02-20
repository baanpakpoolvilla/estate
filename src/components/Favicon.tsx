"use client";

import { useEffect } from "react";

export default function Favicon({ href }: { href: string | null }) {
  useEffect(() => {
    if (!href) return;
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = href;
  }, [href]);
  return null;
}
