import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { useGetIdentity } from "ra-core";
import {
  initJitsu,
  trackPageView,
  identifyUser,
  setGroup,
  resetAnalytics,
} from "./jitsu";

/**
 * Hook to initialize analytics and track page views
 * Automatically identifies user and tracks route changes
 */
export function useAnalytics() {
  const location = useLocation();
  const { data: identity } = useGetIdentity();
  const initializedRef = useRef(false);
  const identifiedRef = useRef<string | null>(null);

  // Initialize Jitsu on mount
  useEffect(() => {
    if (!initializedRef.current) {
      initJitsu();
      initializedRef.current = true;
    }
  }, []);

  // Identify user when identity changes
  useEffect(() => {
    if (identity?.id && identifiedRef.current !== String(identity.id)) {
      identifyUser(String(identity.id), {
        email: identity.email,
        fullName: identity.fullName,
        avatar: identity.avatar,
      });

      // Set organization group if available
      if (identity.organization_id) {
        setGroup("organization", String(identity.organization_id), {
          name: identity.organization_name,
        });
      }

      identifiedRef.current = String(identity.id);
    }
  }, [identity]);

  // Track page views on route change
  useEffect(() => {
    if (initializedRef.current) {
      trackPageView(location.pathname, {
        path: location.pathname,
        search: location.search,
      });
    }
  }, [location.pathname, location.search]);

  // Reset on unmount (logout)
  useEffect(() => {
    return () => {
      if (identifiedRef.current) {
        resetAnalytics();
        identifiedRef.current = null;
      }
    };
  }, []);
}
