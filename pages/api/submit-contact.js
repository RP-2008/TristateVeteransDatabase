// ================================
// pages/api/submit-contact.js (Google Sheets integration)
// ================================

import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const data = req.body;

    // Authenticate with Google Sheets using env variables from your service account JSON
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Replace with your Google Sheet ID
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Define row data
    const row = [
      new Date().toISOString(),
      data.organization || "",
      data.state || "",
      data.postNumber || "",
      data.email || "",
      data.phone || "",
      data.address || "",
      data.notes || ""
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:H", // assumes columns A–H
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    });

    return res.status(200).json({ ok: true, persisted: true });
  } catch (err) {
    console.error("Google Sheets error:", err);
    return res.status(500).json({ ok: false, error: "Failed to save to Google Sheets" });
  }
}


