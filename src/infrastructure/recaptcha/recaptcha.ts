interface GrecaptchaInstance {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
}

declare global {
  interface Window {
    grecaptcha?: GrecaptchaInstance;
  }
}

const SCRIPT_ID = "google-recaptcha-v3-script";
let loadingPromise: Promise<void> | null = null;

const loadRecaptcha = (siteKey: string): Promise<void> => {
  if (window.grecaptcha?.execute) return Promise.resolve();
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(
      SCRIPT_ID,
    ) as HTMLScriptElement | null;
    const script = existingScript ?? document.createElement("script");

    const handleLoad = () => {
      if (window.grecaptcha?.execute) {
        resolve();
      } else {
        loadingPromise = null;
        reject(new Error("reCAPTCHA loaded without exposing its API"));
      }
    };
    const handleError = () => {
      loadingPromise = null;
      reject(new Error("Failed to load reCAPTCHA script"));
    };

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existingScript) {
      script.id = SCRIPT_ID;
      script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });

  return loadingPromise;
};

export const getRecaptchaToken = async (
  action = "quote_submit",
): Promise<string> => {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;
  console.log(import.meta.env.VITE_RECAPTCHA_SITE_KEY);
  if (!siteKey) {
    throw new Error("VITE_RECAPTCHA_SITE_KEY is not configured");
  }

  if (typeof window === "undefined") {
    throw new Error("reCAPTCHA is only available in the browser");
  }

  await loadRecaptcha(siteKey);

  const recaptcha = window.grecaptcha;
  if (!recaptcha) throw new Error("reCAPTCHA API is unavailable");

  await new Promise<void>((resolve) => {
    recaptcha.ready(resolve);
  });

  return recaptcha.execute(siteKey, { action });
};
