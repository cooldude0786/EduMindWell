"use client";

import { Analytics } from "@vercel/analytics/next";

export function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        const pathname = new URL(event.url, "https://analytics-filter.invalid").pathname;
        const isLoginPage = pathname === "/login";
        const isDashboardPage = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

        return isLoginPage || isDashboardPage ? null : event;
      }}
    />
  );
}