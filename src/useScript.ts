import { useEffect, useState } from "react";

type ScriptStatus = {
  loading: boolean;
  error: ErrorEvent | null;
  element: HTMLScriptElement;
};

type UseScriptOptions = {
  src: string;
  checkForExisting?: boolean;
};

const scripts: Record<string, ScriptStatus> = {};

const isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined";

function getStatus(
  src: string,
  checkForExisting: boolean
): ScriptStatus | undefined {
  if (scripts[src] || !checkForExisting || !isBrowser) return scripts[src];

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${src}"]`
  );
  if (existing) {
    scripts[src] = { loading: false, error: null, element: existing };
  }
  return scripts[src];
}

function loadScript(src: string): ScriptStatus {
  const element = document.createElement("script");
  element.src = src;
  const status: ScriptStatus = { loading: true, error: null, element };
  element.addEventListener("load", () => {
    status.loading = false;
  });
  element.addEventListener("error", (e) => {
    status.error = e;
  });
  scripts[src] = status;
  document.body.appendChild(element);
  return status;
}

export default function useScript({
  src,
  checkForExisting = false,
}: UseScriptOptions): [boolean, ErrorEvent | null] {
  const [loading, setLoading] = useState(
    () => getStatus(src, checkForExisting)?.loading ?? true
  );
  const [error, setError] = useState(
    () => getStatus(src, checkForExisting)?.error ?? null
  );

  useEffect(() => {
    const status = getStatus(src, checkForExisting) ?? loadScript(src);
    const sync = () => {
      setLoading(status.loading);
      setError(status.error);
    };

    sync();
    if (!status.loading || status.error) return;

    status.element.addEventListener("load", sync);
    status.element.addEventListener("error", sync);
    return () => {
      status.element.removeEventListener("load", sync);
      status.element.removeEventListener("error", sync);
    };
  }, [src, checkForExisting]);

  return [loading, error];
}
