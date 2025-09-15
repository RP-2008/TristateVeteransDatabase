// ================================
// pages/api/submit-contact.js (Vercel Blob integration, fixed)
// ================================

import { put } from "@vercel/blob";

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

    // Ensure we got something
    if (!data) {
      return res.status(400).json({ ok: false, error: "No data received" });
    }

    // Save submission as JSON in Blob storage
    const filename = `submissions/${Date.now()}.json`;
    await put(filename, JSON.stringify(data, null, 2), {
      access: "public",
      contentType: "application/json",
      token: process.env.BLOB_READ_WRITE_TOKEN, // use token from env var
    });

    return res.status(200).json({ ok: true, persisted: true });
  } catch (err) {
    console.error("Blob error:", err);
    return res.status(500).json({ ok: false, error: "Failed to save to Vercel Blob" });
  }
}

// ================================
// How to set up
// ================================
// 1. Add @vercel/blob to your package.json dependencies:
//    "@vercel/blob": "latest"
//
// 2. In Vercel, go to your project → Settings → Environment Variables.
//    Add: BLOB_READ_WRITE_TOKEN with the token you generate in the Vercel dashboard.
//
// 3. Save & Redeploy.
//
// Every submission will now be saved as a JSON file in Vercel Blob under `submissions/`.
// You can browse/download them later from the Vercel dashboard or via the API.


