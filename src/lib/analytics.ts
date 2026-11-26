import { IS_PRODUCTION } from "./seo";
export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
declare global { interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; freshbagGaConfigured?: boolean } }
export function initializeAnalytics() {
  if (!IS_PRODUCTION || !GA_ID || !/^G-[A-Z0-9]+$/.test(GA_ID) || typeof window === "undefined") return false;
  window.dataLayer ??= [];
  window.gtag ??= (...args: unknown[]) => { window.dataLayer!.push(args); };
  if (!window.freshbagGaConfigured) {
    window.gtag("js",new Date());
    window.gtag("config",GA_ID);
    window.freshbagGaConfigured = true;
  }
  return true;
}
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (initializeAnalytics()) window.gtag?.("event",name,params);
}
