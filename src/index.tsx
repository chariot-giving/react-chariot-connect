import React, { useEffect, useRef } from "react";
import useScript from "react-script-hook";
import type {
  ChariotTheme,
  CustomTheme,
  DonationRequestReturnType,
  SuccessEvent,
  ExitEvent,
  GrantIntent,
  Grant,
  RecurringGrant,
  ChariotError,
} from "./types";

const noop = () => {};

type ChariotConnectProps = {
  cid: string;
  theme?: ChariotTheme | CustomTheme;
  onDonationRequest?: () => DonationRequestReturnType;
  onSuccess?: (e: SuccessEvent) => void;
  onExit?: (e: ExitEvent) => void;
  onError?: (e: ChariotError) => void;
  disabled?: boolean;
};

function ChariotConnect(props: ChariotConnectProps) {
  const {
    cid,
    theme = "DefaultTheme",
    onDonationRequest = noop,
    onSuccess = noop,
    onExit = noop,
    onError = noop,
    disabled = false,
  } = props;

  const [, error] = useScript({
    src: "https://cdn.givechariot.com/chariot-connect.umd.js",
    checkForExisting: true,
  });

  const elementRef = useRef<HTMLElement | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Maintaining the original behavior
  useEffect(() => {
    if (error) {
      onError?.({
        type: "SCRIPT_LOAD_ERROR",
        message: "Failed to load Chariot Connect script",
        sourceEvent: error,
      });
    }
  }, [error, onError]);

  useEffect(() => {
    const el = elementRef.current as any;
    if (!el || typeof window === "undefined" || !("customElements" in window))
      return;

    let cleanup = () => {};

    customElements
      .whenDefined("chariot-connect")
      .then(() => {
        try {
          if (onDonationRequest) el.onDonationRequest(onDonationRequest);
          if (typeof theme !== "string") {
            el.registerTheme("customTheme", theme);
          }

          const onInit = () => {};
          const onSucc = (e: Event) => onSuccess?.(e as any);
          const onEx = (e: Event) => onExit?.(e as any);

          el.addEventListener("CHARIOT_INIT", onInit);
          el.addEventListener("CHARIOT_SUCCESS", onSucc);
          el.addEventListener("CHARIOT_EXIT", onEx);

          cleanup = () => {
            el.removeEventListener("CHARIOT_INIT", onInit);
            el.removeEventListener("CHARIOT_SUCCESS", onSucc);
            el.removeEventListener("CHARIOT_EXIT", onEx);
          };
        } catch (err) {
          onError?.({
            type: "SCRIPT_LOAD_ERROR",
            message: "Failed to initialize Chariot Connect",
            sourceEvent: err as any,
          });
        }
      })
      .catch((err) => {
        onError?.({
          type: "SCRIPT_LOAD_ERROR",
          message: "Failed to define custom element chariot-connect",
          sourceEvent: err as any,
        });
      });

    return () => cleanup();
  }, [onDonationRequest, onSuccess, onExit, onError, theme]);

  const elementProps: Record<string, unknown> = {
    ref: elementRef,
    cid,
    theme: typeof theme === "string" ? theme : "customTheme",
  };
  if (disabled) {
    (elementProps as any).disabled = "";
  }

  return (
    <>
      {React.createElement("chariot-connect", {
        ref: elementRef,
        cid,
        theme: typeof theme === "string" ? theme : "customTheme",
        ...(disabled ? { disabled: "" } : {}),
      })}
      <style>{`
        chariot-connect:not(:defined){
          display:inline-block;border-radius:4px;
          height:var(--loading-height, 48px);
          width:var(--loading-width, 240px);
          box-shadow:0 0 0 1px rgba(0,0,0,.08) inset;background:rgba(0,0,0,.05);
          animation:pulse 1.2s ease-in-out infinite;
        }
        @keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}
      `}</style>
    </>
  );
}

export function isGrant(e: CustomEvent["detail"]): e is Grant {
  return typeof e === "object" && "grant" in e;
}

export function isRecurringGrant(
  e: CustomEvent["detail"]
): e is RecurringGrant {
  return typeof e === "object" && "recurringGrant" in e;
}

export function isGrantIntent(e: CustomEvent["detail"]): e is GrantIntent {
  return typeof e === "object" && "grantIntent" in e;
}

export function isRecurringGrantIntent(
  e: CustomEvent["detail"]
): e is GrantIntent {
  return typeof e === "object" && "recurringGrantIntent" in e;
}

export default ChariotConnect;
