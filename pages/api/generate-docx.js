// pages/api/generate.js

export default function handler(req, res) {
  console.log("🔔 [API] /api/generate was hit");
  res.status(200).json({ message: "Hello from /api/generate" });
}
