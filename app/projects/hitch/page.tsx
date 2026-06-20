"use client";

import { useState } from "react";
import styles from "./hitch.module.css";

export default function HitchPage() {
  const [isLoading, setIsLoading] = useState(true);

  const hitchUrl = process.env.NEXT_PUBLIC_HITCH_URL || "http://localhost:3002";

  return (
    <div>
      <div className={styles.box} />
      <main className={styles.page}>
        <section className={styles.introduction}>
          <div>
            <p className={styles.eyebrow}>Interactive Project</p>

            <h1 className={styles.title}>Hitch</h1>

            <p className={styles.description}>
              A ride-sharing and travel companion application featuring trip
              discovery, messaging, user profiles, and an AI-powered travel
              companion.
            </p>
            <p className={styles.demoNote}>
              To test out this demo, create any random username and password.
              For example: <strong>demoUser123</strong> and{" "}
              <strong>HitchDemo123!</strong>
            </p>
          </div>

          <a
            href={hitchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.openButton}
          >
            Open full app
          </a>
        </section>

        <section className={styles.demoSection}>
          <div className={styles.phone}>
            <div className={styles.phoneTop}>
              <span className={styles.speaker} />
            </div>

            <div className={styles.screen}>
              {isLoading && (
                <div className={styles.loading}>
                  <div className={styles.spinner} />
                  <span>Loading Hitch...</span>
                </div>
              )}

              <iframe
                src={hitchUrl}
                title="Hitch application demo"
                className={styles.iframe}
                onLoad={() => setIsLoading(false)}
                allow="microphone; camera; geolocation; clipboard-read; clipboard-write"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
