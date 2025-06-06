// pages/index.js

import React, { useState } from "react";
import DocumentForm from "../components/DocumentForm";
import DocumentPreview from "../components/DocumentPreview";

export default function Home() {
  const [apiMessage, setApiMessage] = useState("");
  const [draftContent, setDraftContent] = useState("");

  // This handler just calls /api/generate and shows the "message" field
  async function handleGenerate(variables) {
    console.log("🔔 handleGenerate called with:", variables);

    try {
      const res = await fetch("/api/generate", {
        method: "POST", // or GET, whichever; our minimal endpoint accepts anything
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(variables),
      });

      console.log("📡 /api/generate status:", res.status);

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        console.error("⚠️ Server returned non-200:", errJson);
        setApiMessage(`Error: ${res.status}`);
        return;
      }

      const json = await res.json();
      console.log("✅ Received from /api/generate:", json);
      setApiMessage(json.message || "<no message>");
      // We won’t set draftContent yet—just display apiMessage for now
    } catch (fetchError) {
      console.error("❌ Client fetch error:", fetchError);
      setApiMessage("Client fetch error (see console).");
    }
  }

  return (
    <div>
      <DocumentForm onGenerate={handleGenerate} />
      <div style={{ margin: "2rem auto", maxWidth: "600px", textAlign: "center" }}>
        <p><strong>API says:</strong> {apiMessage}</p>
      </div>
      {/* We won’t render DocumentPreview for now */}
    </div>
  );
}
