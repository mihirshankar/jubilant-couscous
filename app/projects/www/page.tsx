"use client";

import "./world-wide-web-2.css";

const STREAMLIT_URL =
  process.env.NEXT_PUBLIC_WORLD_MODEL_URL || "http://localhost:8501";

export default function WorldWideWebTwoPage() {
  return (
    <div>
      <div className="box" />
      <main className="world-wide-web-page">
        <section className="world-wide-web-header">
          <p className="world-wide-web-label">Interactive Project Demo</p>

          <h1>WorldWideWeb Dream Environment</h1>

          <p>
            Explore a simulated web environment where an agent takes actions and
            a world model predicts the next page, reward, and episode outcome.
          </p>
        </section>

        <section className="streamlit-container">
          <iframe
            src={STREAMLIT_URL}
            title="WorldWideWeb Dream Environment Simulator"
            className="streamlit-frame"
            allow="clipboard-read; clipboard-write"
          />
        </section>
      </main>
    </div>
  );
}
