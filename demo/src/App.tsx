import ChariotConnect from "react-chariot-connect";

const CustomLoadingComponent = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      background: "#f0f9ff",
      border: "2px solid #0ea5e9",
      borderRadius: "8px",
      padding: "8px 16px",
      fontSize: "14px",
      color: "#0369a1",
      fontWeight: "500",
    }}
  >
    <div
      style={{
        width: "16px",
        height: "16px",
        border: "2px solid #0ea5e9",
        borderTop: "2px solid transparent",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    ></div>
    Loading Chariot...
  </div>
);

export default function App() {
  return (
    <div
      style={{
        padding: 24,
        fontFamily: "ui-sans-serif, system-ui, -apple-system",
      }}
    >
      <h1>react-chariot-connect demo</h1>
      <p>
        Shows the pre-upgrade skeleton (pulsing pill), then upgrades after the
        script loads via react-script-hook.
      </p>
      <p style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>
        The script loading is handled automatically by the ChariotConnect
        component.
      </p>

      <h2>Default Loading State</h2>
      <p style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>
        Uses the built-in pulsing skeleton when no loadingComponent is provided.
      </p>
      <ChariotConnect
        cid="DEMO_CID"
        theme="DefaultTheme"
        onDonationRequest={() => ({})}
        onSuccess={() => console.log("success")}
        onExit={() => console.log("exit")}
        onError={(e) => console.error(e)}
      />
    </div>
  );
}
