// pages/index.js

import React, { useState } from "react";
import DocumentForm from "../components/DocumentForm";
import DocumentPreview from "../components/DocumentPreview";

export default function Home() {
  const [draftContent, setDraftContent] = useState("");

  async function handleGenerate(variables) {
    console.log("🔔 handleGenerate called with:", variables);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(variables),
      });
      console.log("📡 /api/generate status:", res.status);

      if (!res.ok) {
        let errMsg = "<no JSON>";
        try {
          const errJson = await res.json();
          errMsg = JSON.stringify(errJson);
        } catch {
          errMsg = "<failed to parse JSON>";
        }
        console.error("⚠️ Server returned non-200:", errMsg);
        alert("Failed to generate draft. Check console for details.");
        return;
      }

      const { text } = await res.json();
      console.log("✅ Received draft text (first 100 chars):", text.substring(0, 100));
      setDraftContent(text);
    } catch (fetchError) {
      console.error("❌ Client fetch error:", fetchError);
      alert("Error generating draft. Check console for details.");
    }
  }

  return (
    <div>
      <DocumentForm onGenerate={handleGenerate} />
      <DocumentPreview content={draftContent} />
    </div>
  );
}
