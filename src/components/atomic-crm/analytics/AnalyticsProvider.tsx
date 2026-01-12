import type { ReactNode } from "react";
import { useAnalytics } from "./useAnalytics";

interface AnalyticsProviderProps {
  children: ReactNode;
}

/**
 * Component that initializes analytics and tracks page views
 * Must be rendered inside a Router context
 */
function AnalyticsInitializer() {
  useAnalytics();
  return null;
}

/**
 * Analytics provider wrapper
 * Renders children and initializes analytics tracking
 */
export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  return (
    <>
      <AnalyticsInitializer />
      {children}
    </>
  );
}
