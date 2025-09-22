import React, { useEffect, useRef, useState } from "react";
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

// Type definitions for the new DAFpay API
declare global {
  interface Window {
    ChariotDafpay: (config?: {
      cid?: string;
      theme?: ChariotTheme | "customTheme";
    }) => {
      loading: boolean;
      error: Error | null;
      ready: boolean;
      load: () => Promise<void>;
      createElement: (elementConfig?: {
        cid?: string;
        theme?: ChariotTheme | "customTheme";
        disabled?: boolean;
      }) => HTMLElement | null;
      isReady: () => boolean;
      onStateChange: (
        callback: (state: {
          loading: boolean;
          loaded: boolean;
          error: Error | null;
          ready: boolean;
        }) => void
      ) => () => void; // Returns unsubscribe function
      initialize: (initConfig?: {
        cid?: string;
        theme?: ChariotTheme | "customTheme";
        disabled?: boolean;
      }) => Promise<HTMLElement | boolean>;
    };
  }
}

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

  const [loading, error] = useScript({
    src: "https://cdn.givechariot.com/initialize-dafpay.js",
    checkForExisting: true,
  });

  const elementRef = useRef<HTMLDivElement | null>(null);
  const dafpayInstanceRef = useRef<ReturnType<
    typeof window.ChariotDafpay
  > | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  // Initialize DAFpay instance and handle state changes
  useEffect(() => {
    if (typeof window === "undefined" || loading) return;

    console.debug("Attempting to initialize DAFpay");

    if (!window.ChariotDafpay) {
      console.warn("ChariotDafpay not available on window object");
      onError?.({
        type: "SCRIPT_LOAD_ERROR",
        message: "ChariotDafpay not available on window after script load",
        sourceEvent: new Error("ChariotDafpay not found") as any,
      });
      return;
    }

    let unsubscribe: (() => void) | null = null;

    try {
      // Create DAFpay instance with initial config
      const dafpay = window.ChariotDafpay({
        cid,
        theme: typeof theme === "string" ? theme : "customTheme",
      });

      dafpayInstanceRef.current = dafpay;

      // Register custom theme if provided
      if (typeof theme !== "string") {
        // Note: Custom theme registration will need to be handled by the DAFpay API
        // This may need to be updated based on the actual API implementation
        console.warn(
          "Custom theme registration needs to be implemented in new DAFpay API"
        );
      }

      // Subscribe to state changes - this will be called immediately with current state
      unsubscribe = dafpay.onStateChange((state) => {
        setIsLoading(state.loading);
        setIsReady(state.ready);

        if (state.error) {
          console.error("DAFpay error:", state.error);
          onError?.({
            type: "SCRIPT_LOAD_ERROR",
            message: "DAFpay script error",
            sourceEvent: state.error as any,
          });
        }
      });

      unsubscribeRef.current = unsubscribe;
    } catch (err) {
      console.error("Error creating DAFpay instance:", err);
      onError?.({
        type: "SCRIPT_LOAD_ERROR",
        message: "Failed to create DAFpay instance",
        sourceEvent: err as any,
      });
    }

    // Cleanup function
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [loading, cid, theme, onError]);

  // Create element and set up event listeners when ready
  useEffect(() => {
    if (!isReady || !dafpayInstanceRef.current) return;

    try {
      console.log("Creating DAFpay element with config:", {
        cid,
        theme: typeof theme === "string" ? theme : "customTheme",
        disabled,
      });

      // Create element with configuration
      const element = dafpayInstanceRef.current.createElement({
        cid,
        theme: typeof theme === "string" ? theme : "customTheme",
        disabled,
      });

      console.log("Created element:", element);

      if (!element) {
        console.error("createElement returned null");
        onError?.({
          type: "SCRIPT_LOAD_ERROR",
          message:
            "Failed to create DAFpay element - createElement returned null",
          sourceEvent: new Error("createElement returned null") as any,
        });
        return;
      }

      const container = elementRef.current;
      if (container) {
        console.log("Appending element to container");
        // Clear any existing content
        container.innerHTML = "";
        container.appendChild(element);

        // Set up event listeners on the created element
        const onSucc = (e: Event) => onSuccess?.(e as any);
        const onEx = (e: Event) => onExit?.(e as any);

        element.addEventListener("CHARIOT_SUCCESS", onSucc);
        element.addEventListener("CHARIOT_EXIT", onEx);

        // Handle onDonationRequest callback
        if (onDonationRequest && (element as any).onDonationRequest) {
          (element as any).onDonationRequest(onDonationRequest);
        }

        return () => {
          element.removeEventListener("CHARIOT_SUCCESS", onSucc);
          element.removeEventListener("CHARIOT_EXIT", onEx);
        };
      }
    } catch (err) {
      console.error("Error creating/setting up DAFpay element:", err);
      onError?.({
        type: "SCRIPT_LOAD_ERROR",
        message: "Failed to create or setup DAFpay element",
        sourceEvent: err as any,
      });
    }

    return () => {}; // Return empty cleanup function for all paths
  }, [
    isReady,
    cid,
    theme,
    disabled,
    onDonationRequest,
    onSuccess,
    onExit,
    onError,
  ]);

  return (
    <>
      <div
        ref={elementRef}
        className={isLoading ? "chariot-loading" : "chariot-ready"}
      />
      <style>{`
        .chariot-loading {
          display:inline-block;border-radius:4px;
          height:var(--loading-height, 48px);
          width:var(--loading-width, 240px);
          box-shadow:0 0 0 1px rgba(0,0,0,.08) inset;background:rgba(0,0,0,.05);
          animation:pulse 1.2s ease-in-out infinite;
        }
        .chariot-ready {
          display:inline-block;
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
