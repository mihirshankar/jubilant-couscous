"use client";

import { useEffect, useRef, useState } from "react";
import "./pokersolver.css";
import "xterm/css/xterm.css";

export default function PokerSolverPage() {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const [connectionStatus, setConnectionStatus] = useState("Disconnected");

  useEffect(() => {
    let term: any = null;
    let fitAddon: any = null;
    let socket: WebSocket | null = null;

    async function startTerminal() {
      if (!terminalRef.current) return;

      const xtermModule = await import("xterm");
      const fitModule = await import("xterm-addon-fit");

      const Terminal = xtermModule.Terminal;
      const FitAddon = fitModule.FitAddon;

      term = new Terminal({
        cursorBlink: true,
        fontSize: 15,
        fontFamily: "Menlo, Monaco, Consolas, monospace",
        convertEol: true,
        theme: {
          background: "#07140d",
          foreground: "#f5f5f5",
          cursor: "#ffffff",
        },
      });

      fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      term.open(terminalRef.current);
      fitAddon.fit();

      term.writeln("Connecting to Poker Solver backend...");
      term.writeln("");

      socket = new WebSocket("wss://poker-website-0cq2.onrender.com/ws/poker");
      socketRef.current = socket;

      socket.onopen = () => {
        setConnectionStatus("Connected");
        term.writeln("Connected to OCaml Poker Solver.");
        term.writeln("");
      };

      socket.onmessage = (event) => {
        term.write(event.data);
      };

      socket.onerror = () => {
        setConnectionStatus("Connection Error");
        term.writeln("");
        term.writeln(
          "Unable to connect to the Poker Solver backend. Please try again.",
        );
      };

      socket.onclose = () => {
        setConnectionStatus("Disconnected");
        term.writeln("");
        term.writeln("Connection closed.");
      };

      term.onData((data: string) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(data);
        }
      });

      window.addEventListener("resize", () => {
        fitAddon.fit();
      });
    }

    startTerminal();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }

      if (term) {
        term.dispose();
      }
    };
  }, []);

  function restartGame() {
    if (socketRef.current) {
      socketRef.current.close();
    }

    window.location.reload();
  }

  return (
    <div>
      <div className="box" />
      <main className="poker-page">
        <section className="poker-hero">
          <p className="poker-label">OCaml</p>

          <h1>No Limit Texas Hold&apos;em Poker Solver</h1>

          <p className="poker-description">
            Play against an OCaml-powered push/fold poker bot that uses strategy
            ranges, equity calculation, bankroll tracking, and terminal-style
            game flow.
          </p>

          <div className="poker-actions">
            <button className="restart-button" onClick={restartGame}>
              Restart Game
            </button>

            <span className="connection-pill">Status: {connectionStatus}</span>
          </div>
        </section>

        <section className="terminal-section">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <p>Poker Solver Terminal</p>
          </div>

          <div className="terminal-container" ref={terminalRef}></div>
        </section>

        <section className="poker-info-grid">
          <div className="poker-info-card">
            <h2>How to Play</h2>
            <p>
              Type directly into the terminal. Enter your name, bankroll, small
              blind, and decisions like <strong>all</strong> or{" "}
              <strong>fold</strong>.
            </p>
          </div>

          <div className="poker-info-card">
            <h2>Backend</h2>
            <p>
              The browser connects to a FastAPI WebSocket, which runs your OCaml
              poker executable and streams the output into this page.
            </p>
          </div>

          <div className="poker-info-card">
            <h2>Strategy</h2>
            <p>
              The bot uses push/fold strategy ranges, hand evaluation, equity
              calculation, and bankroll updates from your OCaml game engine.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
