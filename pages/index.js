import React, { useState } from "react";
import DocumentForm from "../components/DocumentForm";
import DocumentPreview from "../components/DocumentPreview";

export default function Home() {
  const [draftContent, setDraftContent] = useState("");

  async function handleGenerate(variables) {
    try {
      // Client sends a POST to the serverless API route
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(variables),
      });

      if (!res.ok) {
        // Show any JSON error returned by the server
        const err = await res.json();
        console.error("Server error:", err);
        alert("Failed to generate draft. See console for details.");
        return;
      }

      // If OK, response JSON is { text: "…generated draft…" }
      const { text } = await res.json();
      setDraftContent(text);
    } catch (error) {
      console.error("Client fetch error:", error);
      alert("Error generating draft. Please check console for details.");
    }
  }

  return (
    <div>
      <DocumentForm onGenerate={handleGenerate} />
      <DocumentPreview content={draftContent} />
    </div>
  );
}
