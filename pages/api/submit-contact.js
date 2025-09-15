// ================================
// pages/api/submit-contact.js (Vercel Blob integration, corrected import)
// ================================

import { put } from "@vercel/blob"; // official import path

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const data = req.body;

    if (!data) {
      return res.status(400).json({ ok: false, error: "No data received" });
    }

    const filename = `submissions/${Date.now()}.json`;
    const { url } = await put(filename, JSON.stringify(data, null, 2), {
      access: "public",
      contentType: "application/json",
    });

    return res.status(200).json({ ok: true, persisted: true, url });
  } catch (err) {
    console.error("Blob error:", err);
    return res.status(500).json({ ok: false, error: "Failed to save to Vercel Blob" });
  }
}

// ================================
// Setup Instructions
// ================================
// 1. Add "@vercel/blob": "latest" to dependencies in package.json.
// 2. In Vercel → Project Settings → Environment Variables:
//    - (No token required for public writes, unless you want private control)
// 3. Save & Redeploy.
//
// Submissions will be stored as JSON in your Blob storage under `submissions/`. You can view/download them later from the Vercel dashboard or via API.
