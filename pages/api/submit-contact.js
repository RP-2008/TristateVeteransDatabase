export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  const payload = req.body || {};

  let persisted = false;
  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const key = `submissions/${Date.now()}-${Math.random().toString(36).slice(2)}.json`;
      await put(key, JSON.stringify(payload, null, 2), {
        access: "public",
        addRandomSuffix: false,
        contentType: "application/json",
        token: process.env.BLOB_READ_WRITE_TOKEN
      });
      persisted = true;
    }
  } catch (e) {
    console.error("Blob save failed", e);
  }

  return res.status(200).json({ ok: true, persisted });
}

