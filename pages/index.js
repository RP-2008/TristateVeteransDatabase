import { useState } from "react";

// Import JSON datasets by section
import njAmericanLegion from "../data/nj_american_legion_posts.json";
import njVfw from "../data/nj_vfw_posts.json";
import njElks from "../data/nj_elks_posts.json";
import nyVfw from "../data/ny_vfw_posts.json";
import nyElks from "../data/ny_elks_posts.json";
import paVfw from "../data/pa_vfw_posts.json";
import paElks from "../data/pa_elks_posts.json";

export default function Home() {
  const [query, setQuery] = useState("");

  // Collect all posts (all 7 sections)
  const allPosts = [
    ...njAmericanLegion,
    ...njVfw,
    ...njElks,
    ...nyVfw,
    ...nyElks,
    ...paVfw,
    ...paElks
  ];

  const filteredPosts = allPosts.filter((post) => {
    const searchStr = query.toLowerCase();
    return (
      post.postNumber.toLowerCase().includes(searchStr) ||
      (post.name && post.name.toLowerCase().includes(searchStr)) ||
      post.address.toLowerCase().includes(searchStr) ||
      post.organization.toLowerCase().includes(searchStr) ||
      post.state.toLowerCase().includes(searchStr) ||
      post.email.toLowerCase().includes(searchStr) ||
      post.phone.toLowerCase().includes(searchStr)
    );
  });

  // Group posts by Organization + State
  const grouped = allPosts.reduce((acc, post) => {
    const key = `${post.organization} – ${post.state}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(post);
    return acc;
  }, {});

  const hasSearch = query.trim().length > 0;

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        padding: "20px",
        background: "#ffffff",
        minHeight: "100vh"
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#b22234",
          marginBottom: "20px",
          borderBottom: "4px solid #3c3b6e",
          paddingBottom: "10px"
        }}
      >
        VFW, ELKS & American Legion Directory
      </h1>

      <input
        type="text"
        placeholder="Search by post number, town, email, etc..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          margin: "20px 0",
          border: "2px solid #3c3b6e",
          borderRadius: "8px",
          outlineColor: "#b22234"
        }}
      />

      {hasSearch ? (
        filteredPosts.length > 0 ? (
          filteredPosts.map((post, idx) => (
            <div
              key={idx}
              style={{
                border: "2px solid #3c3b6e",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "15px",
                background: "#f5f5f5"
              }}
            >
              <h2 style={{ color: "#b22234" }}>{post.postNumber}</h2>
              {post.name && <p><strong>{post.name}</strong></p>}
              <p>{post.address}</p>
              <p>
                <a href={`mailto:${post.email}`} style={{ color: "#3c3b6e" }}>
                  {post.email}
                </a>
              </p>
              <p>
                <a href={`tel:${post.phone}`} style={{ color: "#3c3b6e" }}>
                  {post.phone}
                </a>
              </p>
            </div>
          ))
        ) : (
          <p style={{ color: "#777" }}>No results found.</p>
        )
      ) : (
        Object.entries(grouped).map(([section, posts]) => (
          <div key={section} style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#3c3b6e", borderBottom: "2px solid #b22234" }}>
              {section}
            </h2>
            {posts.map((post, idx) => (
              <div
                key={idx}
                style={{
                  border: "2px solid #3c3b6e",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "15px",
                  background: "#f5f5f5"
                }}
              >
                <h3 style={{ color: "#b22234" }}>{post.postNumber}</h3>
                {post.name && <p><strong>{post.name}</strong></p>}
                <p>{post.address}</p>
                <p>
                  <a href={`mailto:${post.email}`} style={{ color: "#3c3b6e" }}>
                    {post.email}
                  </a>
                </p>
                <p>
                  <a href={`tel:${post.phone}`} style={{ color: "#3c3b6e" }}>
                    {post.phone}
                  </a>
                </p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
