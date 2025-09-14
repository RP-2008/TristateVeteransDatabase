import { useState, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";

// Import JSON datasets by section
import njAmericanLegion from "../data/nj_american_legion_posts.json";
import njVfw from "../data/nj_vfw_posts.json";
import njElks from "../data/nj_elks_posts.json";
import nyVfw from "../data/ny_vfw_posts.json";
import nyElks from "../data/ny_elks_posts.json";
import paVfw from "../data/pa_vfw_posts.json";
import paElks from "../data/pa_elks_posts.json";

const SECTIONS = [
  { label: "All", org: null, state: null },
  { label: "NJ • VFW", org: "VFW", state: "NJ" },
  { label: "NJ • ELKS", org: "ELKS", state: "NJ" },
  { label: "NJ • American Legion", org: "American Legion", state: "NJ" },
  { label: "NY • VFW", org: "VFW", state: "NY" },
  { label: "NY • ELKS", org: "ELKS", state: "NY" },
  { label: "PA • VFW", org: "VFW", state: "PA" },
  { label: "PA • ELKS", org: "ELKS", state: "PA" }
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(SECTIONS[0]); // default "All"

  // Collect all posts (all 7 sections)
  const allPosts = useMemo(
    () => [
      ...njAmericanLegion,
      ...njVfw,
      ...njElks,
      ...nyVfw,
      ...nyElks,
      ...paVfw,
      ...paElks
    ],
    []
  );

  // Apply section filter first
  const sectionFiltered = useMemo(() => {
    if (!active.org || !active.state) return allPosts;
    return allPosts.filter(
      (p) => p.organization === active.org && p.state === active.state
    );
  }, [allPosts, active]);

  // Then apply keyword search (global, includes org/state)
  const filteredPosts = useMemo(() => {
    const searchStr = query.trim().toLowerCase();
    if (!searchStr) return sectionFiltered;
    return sectionFiltered.filter((post) =>
      [
        post.postNumber,
        post.address,
        post.organization,
        post.state,
        post.email,
        post.phone,
        (post.name || "")
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchStr)
    );
  }, [sectionFiltered, query]);

  // Group posts by Organization + State (only used for "All" view w/out search)
  const grouped = useMemo(() => {
    return allPosts.reduce((acc, post) => {
      const key = `${post.organization} – ${post.state}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(post);
      return acc;
    }, {});
  }, [allPosts]);

  const hasSearch = query.trim().length > 0;
  const isAll = !active.org && !active.state;

  return (
    <div style={{ minHeight: "200vh", background: "#0b4a9e" }}>
      <Head>
        <title>Tristate Veterans Organizations Database</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&family=Roboto+Slab:wght@400;700&family=Roboto+Condensed:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Top Nav / Tabs */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#0b4a9e",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          padding: "12px 16px"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            maxWidth: 1100,
            margin: "0 auto"
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#fff",
              fontFamily: "Roboto Slab, Roboto, sans-serif",
              fontWeight: 700,
              fontSize: 22
            }}
          >
            Tristate Veterans Organizations Database
          </h1>
          <nav style={{ display: "flex", gap: 8, flexWrap: "wrap", marginLeft: "auto" }}>
            {SECTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => setActive(s)}
                style={{
                  border: "1px solid rgba(255,255,255,0.6)",
                  background:
                    active.label === s.label ? "#ffffff" : "rgba(255,255,255,0.12)",
                  color: active.label === s.label ? "#0b4a9e" : "#fff",
                  padding: "6px 10px",
                  borderRadius: 999,
                  fontFamily: "Roboto Condensed, Roboto, sans-serif",
                  fontSize: 13,
                  cursor: "pointer",
                  backdropFilter: "blur(4px)"
                }}
              >
                {s.label}
              </button>
            ))}
            <Link href="/add-contacts" style={{ textDecoration: "none" }}>
              <span
                style={{
                  border: "1px solid #fff",
                  background: "#fff",
                  color: "#0b4a9e",
                  padding: "6px 10px",
                  borderRadius: 999,
                  fontFamily: "Roboto Condensed, Roboto, sans-serif",
                  fontSize: 13,
                  cursor: "pointer"
                }}
              >
                Add Contacts
              </span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "20px" }}>
        <input
          type="text"
          placeholder="Search by post number, town, email, etc..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 14px",
            fontSize: 16,
            border: "1px solid rgba(255,255,255,0.5)",
            borderRadius: 10,
            outline: "none",
            margin: "12px 0 20px",
            fontFamily: "Roboto, sans-serif",
            background: "rgba(255,255,255,0.9)"
          }}
        />

        {hasSearch || !isAll ? (
          filteredPosts.length > 0 ? (
            filteredPosts.map((post, idx) => (
              <div
                key={idx}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.12)"
                }}
              >
                <h2
                  style={{
                    margin: "0 0 6px",
                    color: "#0b4a9e",
                    fontFamily: "Roboto Slab, Roboto, sans-serif",
                    fontSize: 20
                  }}
                >
                  {post.postNumber}
                </h2>
                {post.name && post.name !== "N/A" && (
                  <p style={{ margin: "0 0 6px", fontWeight: 600 }}>{post.name}</p>
                )}
                <p style={{ margin: "0 0 6px" }}>{post.address}</p>
                <p style={{ margin: "0 0 6px" }}>
                  <a href={`mailto:${post.email}`} style={{ color: "#0b4a9e" }}>
                    {post.email}
                  </a>
                </p>
                <p style={{ margin: 0 }}>
                  <a href={`tel:${post.phone}`} style={{ color: "#0b4a9e" }}>
                    {post.phone}
                  </a>
                </p>
              </div>
            ))
          ) : (
            <p style={{ color: "#fff" }}>No results found.</p>
          )
        ) : (
          Object.entries(grouped).map(([section, posts]) => (
            <section key={section} style={{ marginBottom: 28 }}>
              <h2
                style={{
                  color: "#fff",
                  background: "rgba(255,255,255,0.15)",
                  display: "inline-block",
                  padding: "6px 10px",
                  borderRadius: 8,
                  fontFamily: "Roboto Condensed, Roboto, sans-serif",
                  marginBottom: 10
                }}
              >
                {section}
              </h2>
              {posts.map((post, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)"
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 6px",
                      color: "#0b4a9e",
                      fontFamily: "Roboto Slab, Roboto, sans-serif",
                      fontSize: 18
                    }}
                  >
                    {post.postNumber}
                  </h3>
                  {post.name && post.name !== "N/A" && (
                    <p style={{ margin: "0 0 6px", fontWeight: 600 }}>{post.name}</p>
                  )}
                  <p style={{ margin: "0 0 6px" }}>{post.address}</p>
                  <p style={{ margin: "0 0 6px" }}>
                    <a href={`mailto:${post.email}`} style={{ color: "#0b4a9e" }}>
                      {post.email}
                    </a>
                  </p>
                  <p style={{ margin: 0 }}>
                    <a href={`tel:${post.phone}`} style={{ color: "#0b4a9e" }}>
                      {post.phone}
                    </a>
                  </p>
                </div>
              ))}
            </section>
          ))
        )}
      </main>
    </div>
  );
}
