// ================================
// pages/api/submit-contact.js (safe version, no @vercel/blob)
// ================================

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const data = req.body;

    // For now we only echo back the payload.
    // You can later integrate a database or API here.

    return res.status(200).json({ ok: true, persisted: false, data });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Failed to process submission" });
  }
}

