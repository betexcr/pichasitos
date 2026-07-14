interface Window {
  FIREBASE_CONFIG?: {
    apiKey?: string;
    authDomain?: string;
    databaseURL?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    appCheckSiteKey?: string;
    errorBeacon?: boolean;
  };
}

declare var ScoreSanitizer: any;
declare var CONST: any;
declare var PICHASITOS_CACHE_VERSION: string | undefined;
declare var firebase: any;
declare var fetchWithTimeout: (
  url: string,
  opts?: { timeoutMs?: number; retries?: number; cache?: RequestCache }
) => Promise<Response>;
declare var Runtime: {
  isTestMode: () => boolean;
};
declare var Logger: {
  debug: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (err: any, context?: string) => void;
  isDebug: () => boolean;
  setBeacon: (fn: ((payload: { message?: string; stack?: string; context?: string }) => void) | null) => void;
};
