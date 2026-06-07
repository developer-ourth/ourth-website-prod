"use client";

import { useEffect, useRef } from "react";
import { getOperationsEcho } from "@/lib/realtime/operations-echo";

export function useOperationsLiveRefresh(
  refetch: () => void | Promise<void>,
  intervalMs = 45000,
) {
  const refetchRef = useRef(refetch);

  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const handleRefresh = () => {
    void refetchRef.current();
  };

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      handleRefresh();
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [intervalMs]);

  useEffect(() => {
    let isCancelled = false;
    let cleanup = () => {};

    const subscribe = async () => {
      const echo = await getOperationsEcho();
      if (!echo || isCancelled) {
        return;
      }

      const eventName = ".operations.dashboard.updated";
      const channel = echo.channel("operations.dashboard");
      channel.listen(eventName, () => {
        handleRefresh();
      });

      cleanup = () => {
        channel.stopListening(eventName);
        echo.leaveChannel("operations.dashboard");
      };
    };

    void subscribe();

    return () => {
      isCancelled = true;
      cleanup();
    };
  }, []);
}