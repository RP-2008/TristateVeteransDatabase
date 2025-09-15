// ================================
// pages/api/submit-contact.js (Vercel Blob integration, fixed import path)
// ================================

import { put } from "vercel/blob"; // correct import

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
    await put(filename, JSON.stringify(data, null, 2), {
      access: "public",
      contentType: "application/json",
      token: process.env.BLOB_READ_WRITE_TOKEN, // set in Vercel env vars
    });

    return res.status(200).json({ ok: true, persisted: true });
  } catch (err) {
    console.error("Blob error:", err);
    return res.status(500).json({ ok: false, error: "Failed to save to Vercel Blob" });
  }
}

// ================================
// Setup Instructions
// ================================
// 1. Add "vercel": "latest" to dependencies in package.json.
// 2. In Vercel → Project Settings → Environment Variables:
//    - Name: BLOB_READ_WRITE_TOKEN
//    - Value: (generate from Vercel dashboard → Storage → Blob)
// 3. Save & Redeploy.
//
// Submissions will be stored as JSON in your Blob storage under `submissions/`. You can view/download them later from the Vercel dashboard or via API.


