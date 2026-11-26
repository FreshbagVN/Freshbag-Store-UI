"use client";
import Script from "next/script";
import { useEffect } from "react";
import { IS_PRODUCTION } from "@/lib/seo";
import { GA_ID, trackEvent, initializeAnalytics } from "@/lib/analytics";
export function Analytics() {
  useEffect(() => {
    if(!initializeAnalytics()) return;
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest?.("a");
      if(anchor && (anchor.href.startsWith("tel:") || anchor.hostname === "zalo.me")) trackEvent("generate_lead",{ lead_type: anchor.href.includes("0906818084") ? "b2b" : "b2c", method: anchor.hostname === "zalo.me" ? "zalo" : "phone" });
    };
    document.addEventListener("click",onClick); return () => document.removeEventListener("click",onClick);
  },[]);
  if(!IS_PRODUCTION || !GA_ID || !/^G-[A-Z0-9]+$/.test(GA_ID)) return null;
  return <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive"/>;
}
export function ConversionEvent({ name, params, transactionId }: { name: string; params: Record<string,unknown>; transactionId?: string }) {
  const serialized = JSON.stringify(params);
  useEffect(() => {
    if(!IS_PRODUCTION || !GA_ID) return;
    const key = transactionId ? `freshbag-purchase-${transactionId}` : "";
    if(key && sessionStorage.getItem(key)) return;
    trackEvent(name,JSON.parse(serialized));
    if(key) sessionStorage.setItem(key,"1");
  },[name,serialized,transactionId]);
  return null;
}
