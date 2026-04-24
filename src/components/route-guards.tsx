"use client";

import { PropsWithChildren, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useKrishak } from "@/components/krishak-provider";

export function RequireUser({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, loading } = useKrishak();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!currentUser) {
      router.replace("/auth");
      return;
    }

    if (!currentUser.preferences.hasSelectedLanguage && pathname !== "/language") {
      router.replace("/language");
    }
  }, [currentUser, loading, pathname, router]);

  if (loading || !currentUser) {
    return <div className="screen-center">Loading Krishak...</div>;
  }

  if (!currentUser.preferences.hasSelectedLanguage && pathname !== "/language") {
    return <div className="screen-center">Preparing your language options...</div>;
  }

  return <>{children}</>;
}

export function PublicOnly({ children }: PropsWithChildren) {
  const router = useRouter();
  const { currentUser, loading } = useKrishak();

  useEffect(() => {
    if (loading || !currentUser) {
      return;
    }

    router.replace(currentUser.preferences.hasSelectedLanguage ? "/marketplace" : "/language");
  }, [currentUser, loading, router]);

  if (loading) {
    return <div className="screen-center">Loading Krishak...</div>;
  }

  if (currentUser) {
    return <div className="screen-center">Redirecting...</div>;
  }

  return <>{children}</>;
}
