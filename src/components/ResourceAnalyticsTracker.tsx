"use client";

import { useEffect } from "react";

interface ResourceAnalyticsTrackerProps {
  resourceId: string;
}

export default function ResourceAnalyticsTracker({ resourceId }: ResourceAnalyticsTrackerProps) {
  useEffect(() => {
    // Track view when component mounts
    const trackView = async () => {
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resource_id: resourceId,
            event_type: "view",
          }),
        });
      } catch (error) {
        console.error("Failed to track view:", error);
      }
    };

    trackView();
  }, [resourceId]);

  return null; // This component doesn't render anything
}
