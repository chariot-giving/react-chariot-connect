import ChariotConnect from "react-chariot-connect";

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

      <h2>Default Theme Loading State</h2>
      <p style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>
        Uses the built-in pulsing skeleton with default dimensions (240px ×
        48px).
      </p>
      <div style={{ width: "100%", padding: "20px" }}>
        <ChariotConnect
          cid="DEMO_CID"
          theme="DefaultTheme"
          onDonationRequest={() => ({})}
          onSuccess={() => console.log("success")}
          onExit={() => console.log("exit")}
          onError={(e) => console.error(e)}
        />
      </div>
    </div>
  );
}
