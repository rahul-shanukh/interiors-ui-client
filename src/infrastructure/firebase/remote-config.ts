import { initializeApp } from "firebase/app";
import {
  getRemoteConfig,
  fetchAndActivate,
  getValue,
} from "firebase/remote-config";

import type { RemoteConfig } from "firebase/remote-config";

// Your web app's Firebase configuration (safe to include in frontend code)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
};

const app = initializeApp(firebaseConfig);
const remoteConfig: RemoteConfig = getRemoteConfig(app);

// Set settings: e.g., cache for development vs production
remoteConfig.settings.minimumFetchIntervalMillis = 300000; // 5 minutes (or 0 for instant testing)

// Define sensible fallback defaults
remoteConfig.defaultConfig = {
  traceSamplingRate: 0.1,
  maxUploadSizeMb: 10,
  featureFlagNewUI: false,
};

// Initialize and fetch immediately
export const initializeRemoteConfig = async () => {
  try {
    await fetchAndActivate(remoteConfig);
    console.log("Remote config fetched and activated successfully.");
  } catch (error) {
    console.error("Failed to fetch remote config, using defaults:", error);
  }
};

// Helper getter to grab a config string value
export const getConfigValue = (key: string): string => {
  return getValue(remoteConfig, key).asString();
};

export const getTraceSamplingRate = (): number => {
  return getValue(remoteConfig, "traceSamplingRate").asNumber();
};

export const getFeatureFlag = (key: string): boolean => {
  return getValue(remoteConfig, key).asBoolean();
};
