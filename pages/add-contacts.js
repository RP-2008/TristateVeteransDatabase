import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

export default function AddContacts() {
  const [form, setForm] = useState({
    organization: "VFW",
    state: "NJ",
    postNumber: "",
    email: "",
    phone: "",
    address: "",
    notes: ""
  });
  const [status, setStatus] = useState("");

  useEffect(() => setStatus(""), [form.organization, form.state]);

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form, submittedAt: new Date().toISOString() };

    // 1) Try to persist to a serverless endpoint (Vercel Blob if configured)
    try {
      const resp = await fetch("/api/submit-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      if (data.ok) setStatus(data.persisted ? "Saved online" : "Saved locally");
    } catch (_) {
      // ignore
    }

    // 2) Always keep a local backup so you can export later
    try {
      const key = "tvod_submissions";
      const current = JSON.parse(localStorage.getItem(key) || "[]");
      current.push(payload);
      localStorage.setItem(key, JSON.stringify(current));
    } catch (_) {}

    setForm({ ...form, postNumber: "", email: "", phone: "", address: "", notes: "" });
  }

  function downloadJSON() {
    try {
      const key = "tvod_submissions";
      const data = localStorage.getItem(key) || "[]";
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "contact-submissions.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (_) {}
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b4a9e" }}>
      <Head>
        <title>Add Contacts • Tristate Veterans Organizations Database</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&family=Roboto+Slab:wght@400;700&family=Roboto+Condensed:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <header style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center" }}>
          <Link href="/" style={{ color: "#fff", textDecoration: "none", fontFamily: "Roboto Condensed" }}>
            ← Back
          </Link>
          <h1 style={{ color: "#fff", margin: "0 auto", fontFamily: "Roboto Slab", fontSize: 22 }}>
            Add Contacts
          </h1>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span>Organization</span>
              <select
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
              >
                <option>VFW</option>
                <option>ELKS</option>
                <option>American Legion</option>
              </select>
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>State</span>
              <select
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
              >
                <option>NJ</option>
                <option>NY</option>
                <option>PA</option>
              </select>
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Post Number</span>
              <input
                required
                value={form.postNumber}
                onChange={(e) => setForm({ ...form, postNumber: e.target.value })}
                placeholder="e.g., 101"
                style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="contact@example.org"
                style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Phone</span>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(555) 123-4567"
                style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Address (optional)</span>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Street, City, ZIP"
                style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
              />
            </label>

            <label style={{ gridColumn: "1 / -1", display: "grid", gap: 6 }}>
              <span>Notes (optional)</span>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={4}
                placeholder="Anything else we should know..."
                style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc", resize: "vertical" }}
              />
            </label>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
            <button
              type="submit"
              style={{
                background: "#0b4a9e",
                color: "#fff",
                border: 0,
                borderRadius: 10,
                padding: "10px 16px",
                cursor: "pointer",
                fontFamily: "Roboto Condensed"
              }}
            >
              Submit Contact
            </button>
            <button
              type="button"
              onClick={downloadJSON}
              style={{
                background: "#fff",
                color: "#0b4a9e",
                border: "1px solid #0b4a9e",
                borderRadius: 10,
                padding: "10px 16px",
                cursor: "pointer",
                fontFamily: "Roboto Condensed"
              }}
            >
              Download Submissions (JSON)
            </button>
            {status && (
              <span style={{ alignSelf: "center", color: "#0b4a9e" }}>{status}</span>
            )}
          </div>
        </form>

        <p style={{ color: "#fff", marginTop: 16 }}>
          Tip: for automatic server-side saving, add a Vercel env var named
          <code style={{ padding: 4, background: "rgba(0,0,0,0.2)", marginLeft: 6 }}>BLOB_READ_WRITE_TOKEN</code>
          and redeploy. Without it, submissions are saved locally and downloadable.
        </p>
      </main>
    </div>
  );
}

