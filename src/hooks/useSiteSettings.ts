"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config"; // adjust this import to your firebase config file

export interface SiteSettings {
  siteName: string;
  logo: string;
  footerText: string;

  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  youtube: string;

  phone: string;
  email: string;
  address: string;
  website: string;
}

const defaultSettings: SiteSettings = {
  siteName: "Zentovia Tech",
  logo: "",
  footerText: "",

  facebook: "",
  instagram: "",
  linkedin: "",
  twitter: "",
  youtube: "",

  phone: "{settings.phone}",
  email: "{settings.email}",
  address: "{settings.address}",
  website: "{settings.website}",
};

export function useSiteSettings() {
  const [settings, setSettings] =
    useState<SiteSettings>(defaultSettings);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "settings", "site"),
      (snapshot) => {
        if (snapshot.exists()) {
          setSettings({
            ...defaultSettings,
            ...snapshot.data(),
          });
        }

        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    settings,
    loading,
  };
}