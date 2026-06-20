"use client";

import { useMemo, useState } from "react";
import "./formula1.css";

type Circuit = "Australia" | "China" | "Japan";

type Model =
  | "Bayesian Ridge"
  | "Linear Regression"
  | "Transformer"
  | "LambdaRank";

interface DriverPrediction {
  driver: string;
  abbreviation: string;
  team: string;
  probability: number;
  predictedTime: string;
  delta: string;
}

interface PipelineStage {
  label: string;
  title: string;
  description: string;
}

const circuitPredictions: Record<Circuit, DriverPrediction[]> = {
  Australia: [
    {
      driver: "Oscar Piastri",
      abbreviation: "PIA",
      team: "McLaren",
      probability: 23.2,
      predictedTime: "1:15.281",
      delta: "—",
    },
    {
      driver: "Lando Norris",
      abbreviation: "NOR",
      team: "McLaren",
      probability: 20.2,
      predictedTime: "1:15.346",
      delta: "+0.065",
    },
    {
      driver: "Charles Leclerc",
      abbreviation: "LEC",
      team: "Ferrari",
      probability: 18.6,
      predictedTime: "1:15.402",
      delta: "+0.121",
    },
    {
      driver: "Max Verstappen",
      abbreviation: "VER",
      team: "Red Bull Racing",
      probability: 17.4,
      predictedTime: "1:15.449",
      delta: "+0.168",
    },
    {
      driver: "George Russell",
      abbreviation: "RUS",
      team: "Mercedes",
      probability: 10.7,
      predictedTime: "1:15.588",
      delta: "+0.307",
    },
  ],

  China: [
    {
      driver: "Max Verstappen",
      abbreviation: "VER",
      team: "Red Bull Racing",
      probability: 24,
      predictedTime: "1:30.194",
      delta: "—",
    },
    {
      driver: "Lando Norris",
      abbreviation: "NOR",
      team: "McLaren",
      probability: 22.2,
      predictedTime: "1:30.251",
      delta: "+0.057",
    },
    {
      driver: "Oscar Piastri",
      abbreviation: "PIA",
      team: "McLaren",
      probability: 16.7,
      predictedTime: "1:30.337",
      delta: "+0.143",
    },
    {
      driver: "Charles Leclerc",
      abbreviation: "LEC",
      team: "Ferrari",
      probability: 15.4,
      predictedTime: "1:30.401",
      delta: "+0.207",
    },
    {
      driver: "George Russell",
      abbreviation: "RUS",
      team: "Mercedes",
      probability: 9.8,
      predictedTime: "1:30.516",
      delta: "+0.322",
    },
  ],

  Japan: [
    {
      driver: "Max Verstappen",
      abbreviation: "VER",
      team: "Red Bull Racing",
      probability: 24.8,
      predictedTime: "1:27.801",
      delta: "—",
    },
    {
      driver: "Lando Norris",
      abbreviation: "NOR",
      team: "McLaren",
      probability: 21.4,
      predictedTime: "1:27.856",
      delta: "+0.055",
    },
    {
      driver: "Oscar Piastri",
      abbreviation: "PIA",
      team: "McLaren",
      probability: 19.1,
      predictedTime: "1:27.929",
      delta: "+0.128",
    },
    {
      driver: "Charles Leclerc",
      abbreviation: "LEC",
      team: "Ferrari",
      probability: 14.2,
      predictedTime: "1:28.011",
      delta: "+0.210",
    },
    {
      driver: "George Russell",
      abbreviation: "RUS",
      team: "Mercedes",
      probability: 10.1,
      predictedTime: "1:28.143",
      delta: "+0.342",
    },
  ],
};

const pipelineStages: PipelineStage[] = [
  {
    label: "Track",
    title: "Track geometry",
    description:
      "The circuit raceline is loaded from GeoJSON, converted into meters, evenly resampled, and transformed into curvature values.",
  },
  {
    label: "Telemetry",
    title: "Driver telemetry",
    description:
      "The system processes speed, throttle, brake, RPM, gear, coordinates, tyre compound, lap number, and environmental conditions.",
  },
  {
    label: "Segments",
    title: "Circuit segmentation",
    description:
      "Curvature and speed changes divide the lap into meaningful sections such as straights, braking zones, and corners.",
  },
  {
    label: "Model",
    title: "Machine-learning model",
    description:
      "Regression, ranking, and Transformer-based models learn relationships between driver performance, track shape, and historical results.",
  },
  {
    label: "Prediction",
    title: "Qualifying prediction",
    description:
      "The model produces predicted lap times, grid rankings, and pole-position probabilities for each driver.",
  },
];

const modelDescriptions: Record<Model, string> = {
  "Bayesian Ridge":
    "A regularized linear model that produced the most consistent pole-position results across the evaluated seasons.",

  "Linear Regression":
    "A straightforward qualifying-time model that performed strongly in certain seasons but showed greater year-to-year variation.",

  Transformer:
    "Processes the entire lap as a sequence, combining telemetry and track curvature at each resampled point.",

  LambdaRank:
    "Learns relative driver order using pairwise comparisons rather than predicting each position independently.",
};

const modelMetrics = [
  {
    model: "Bayesian Ridge",
    accuracy: 46,
    detail: "29 of 65 pole positions",
  },
  {
    model: "F1ML1 Baseline",
    accuracy: 40,
    detail: "Previous project benchmark",
  },
  {
    model: "Champion Heuristic",
    accuracy: 35,
    detail: "Approximate benchmark",
  },
  {
    model: "Random Guess",
    accuracy: 5,
    detail: "One driver among twenty",
  },
];

const telemetryPoints = [
  40, 45, 52, 60, 73, 88, 96, 91, 74, 55, 42, 48, 67, 84, 94, 86, 63, 47, 51,
  69, 81, 89, 76, 58, 43, 49, 66, 85, 97, 92, 79, 62, 55, 71, 88, 95, 82, 59,
  44, 50,
];

export default function F1ModelPage() {
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit>("Australia");

  const [selectedModel, setSelectedModel] = useState<Model>("Bayesian Ridge");

  const [currentStage, setCurrentStage] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasResults, setHasResults] = useState(true);

  const predictions = circuitPredictions[selectedCircuit];

  const telemetryPath = useMemo(() => {
    const width = 700;
    const height = 180;

    return telemetryPoints
      .map((point, index) => {
        const x = (index / (telemetryPoints.length - 1)) * width;

        const y = height - (point / 100) * height;

        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }, []);

  const runPrediction = () => {
    if (isRunning) return;

    setIsRunning(true);
    setHasResults(false);
    setCurrentStage(0);

    let stage = 0;

    const interval = window.setInterval(() => {
      stage += 1;

      if (stage >= pipelineStages.length) {
        window.clearInterval(interval);
        setCurrentStage(pipelineStages.length - 1);
        setIsRunning(false);
        setHasResults(true);
        return;
      }

      setCurrentStage(stage);
    }, 700);
  };

  return (
    <div>
      <div className="box" />
      <main className="f1-page">
        <section className="f1-hero">
          <div className="f1-hero-copy">
            <p className="f1-eyebrow">FORMULA 1 × MACHINE LEARNING</p>

            <h1>
              Predicting the
              <span> qualifying grid.</span>
            </h1>

            <p className="f1-description">
              An end-to-end machine-learning system that combines historical
              race data, circuit geometry, weather, and high-frequency driver
              telemetry to predict Formula 1 qualifying performance.
            </p>

            <div className="f1-hero-actions">
              <a href="#prediction-lab">Explore the model</a>

              <div className="headline-metric">
                <strong>46%</strong>
                <span>pole-position accuracy</span>
              </div>
            </div>
          </div>

          <div className="f1-hero-visual">
            <div className="speed-ring">
              <div className="speed-ring-inner">
                <span>MODEL</span>
                <strong>F1</strong>
                <small>QUALIFYING</small>
              </div>
            </div>

            <div className="floating-stat floating-stat-one">
              <span>INPUT FEATURES</span>
              <strong>187</strong>
            </div>

            <div className="floating-stat floating-stat-two">
              <span>SESSIONS TESTED</span>
              <strong>65</strong>
            </div>

            <div className="floating-stat floating-stat-three">
              <span>TOP MODEL</span>
              <strong>Bayesian Ridge</strong>
            </div>
          </div>
        </section>

        <section className="project-overview">
          <article>
            <span>01</span>
            <h2>Data collection</h2>
            <p>
              FastF1 data provides speed, throttle, braking, gear, RPM, GPS
              position, tyres, weather, and session information.
            </p>
          </article>

          <article>
            <span>02</span>
            <h2>Track engineering</h2>
            <p>
              GeoJSON racelines are resampled and converted into curvature,
              corner, segment, and circuit-level features.
            </p>
          </article>

          <article>
            <span>03</span>
            <h2>Model development</h2>
            <p>
              Linear models, neural networks, Transformers, and ranking
              algorithms were compared across historical Formula 1 seasons.
            </p>
          </article>

          <article>
            <span>04</span>
            <h2>Evaluation</h2>
            <p>
              The project evaluates overall grid fit separately from the more
              difficult objective of correctly predicting pole position.
            </p>
          </article>
        </section>

        <section className="prediction-section" id="prediction-lab">
          <div className="section-heading">
            <p className="f1-eyebrow">INTERACTIVE PREDICTION LAB</p>
            <h2>Build a qualifying prediction</h2>
            <p>
              Choose a race and model, then watch the data move through the
              prediction pipeline.
            </p>
          </div>

          <div className="prediction-layout">
            <aside className="prediction-controls">
              <div className="control-block">
                <span className="control-label">01 / Circuit</span>

                <div className="circuit-options">
                  {(["Australia", "China", "Japan"] as Circuit[]).map(
                    (circuit) => (
                      <button
                        type="button"
                        key={circuit}
                        className={circuit === selectedCircuit ? "active" : ""}
                        onClick={() => {
                          setSelectedCircuit(circuit);
                          setHasResults(true);
                        }}
                      >
                        <span>{circuit.slice(0, 3).toUpperCase()}</span>
                        {circuit}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div className="control-block">
                <span className="control-label">02 / Model</span>

                <div className="model-select">
                  {(
                    [
                      "Bayesian Ridge",
                      "Linear Regression",
                      "Transformer",
                      "LambdaRank",
                    ] as Model[]
                  ).map((model) => (
                    <button
                      type="button"
                      key={model}
                      className={model === selectedModel ? "active" : ""}
                      onClick={() => setSelectedModel(model)}
                    >
                      {model}
                    </button>
                  ))}
                </div>

                <p className="selected-model-description">
                  {modelDescriptions[selectedModel]}
                </p>
              </div>

              <button
                type="button"
                className="run-prediction-button"
                onClick={runPrediction}
                disabled={isRunning}
              >
                <span>
                  {isRunning ? "Processing race data" : "Run prediction"}
                </span>
                <strong>→</strong>
              </button>
            </aside>

            <div className="prediction-workspace">
              <div className="pipeline-navigation">
                {pipelineStages.map((stage, index) => (
                  <button
                    type="button"
                    key={stage.label}
                    className={[
                      currentStage === index ? "current" : "",
                      currentStage > index || hasResults ? "complete" : "",
                    ].join(" ")}
                    onClick={() => {
                      if (!isRunning) setCurrentStage(index);
                    }}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <small>{stage.label}</small>
                  </button>
                ))}
              </div>

              <div className="pipeline-display">
                <div className="pipeline-copy">
                  <span>STAGE {String(currentStage + 1).padStart(2, "0")}</span>

                  <h3>{pipelineStages[currentStage].title}</h3>

                  <p>{pipelineStages[currentStage].description}</p>
                </div>

                <div className="pipeline-animation">
                  <div className="track-visual">
                    <div className="track-path" />
                    <div className="moving-car">▰</div>
                  </div>

                  <div className="data-stream">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="model-core">
                    <span>{selectedModel.slice(0, 2)}</span>
                  </div>
                </div>
              </div>

              <div
                className={`prediction-results ${hasResults ? "visible" : ""}`}
              >
                <div className="results-header">
                  <div>
                    <span>2026 QUALIFYING FORECAST</span>
                    <h3>{selectedCircuit} Grand Prix</h3>
                  </div>

                  <div className="prediction-status">
                    <span />
                    Prediction ready
                  </div>
                </div>

                <div className="leaderboard">
                  {predictions.map((prediction, index) => (
                    <div className="leaderboard-row" key={prediction.driver}>
                      <strong className="position">P{index + 1}</strong>

                      <div className="driver-code">
                        {prediction.abbreviation}
                      </div>

                      <div className="driver-information">
                        <strong>{prediction.driver}</strong>
                        <span>{prediction.team}</span>
                      </div>

                      <div className="driver-probability">
                        <div>
                          <span>POLE PROBABILITY</span>
                          <strong>{prediction.probability.toFixed(1)}%</strong>
                        </div>

                        <div className="probability-track">
                          <div
                            style={{
                              width: hasResults
                                ? `${prediction.probability * 3}%`
                                : "0%",
                            }}
                          />
                        </div>
                      </div>

                      <div className="lap-time">
                        <strong>{prediction.predictedTime}</strong>
                        <span>{prediction.delta}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="simulation-note">
                  The interface demonstrates how the project’s predictions could
                  be presented. Values are static portfolio examples rather than
                  live Formula 1 forecasts.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="telemetry-section">
          <div className="section-heading">
            <p className="f1-eyebrow">TELEMETRY PIPELINE</p>
            <h2>A lap becomes a sequence.</h2>
            <p>
              Each point contains information about what the track is doing and
              how the driver is responding.
            </p>
          </div>

          <div className="telemetry-card">
            <div className="telemetry-header">
              <div>
                <span>CHANNEL</span>
                <strong>VELOCITY TRACE</strong>
              </div>

              <div>
                <span>RESOLUTION</span>
                <strong>2,048 POINTS</strong>
              </div>

              <div>
                <span>MAX SPEED</span>
                <strong>337 KM/H</strong>
              </div>
            </div>

            <div className="telemetry-graph">
              <div className="graph-grid" />

              <svg
                viewBox="0 0 700 180"
                preserveAspectRatio="none"
                aria-label="Example telemetry velocity graph"
              >
                <path
                  className="telemetry-area"
                  d={`${telemetryPath} L 700 180 L 0 180 Z`}
                />

                <path className="telemetry-line" d={telemetryPath} />
              </svg>

              <div className="graph-label label-one">Turn 1 braking</div>

              <div className="graph-label label-two">High-speed sector</div>

              <div className="graph-label label-three">Final corner</div>
            </div>

            <div className="telemetry-channels">
              {[
                "Speed",
                "Throttle",
                "Brake",
                "Gear",
                "RPM",
                "Curvature",
                "Tyre",
                "Weather",
              ].map((channel) => (
                <span key={channel}>{channel}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="model-results-section">
          <div className="section-heading">
            <p className="f1-eyebrow">MODEL COMPARISON</p>
            <h2>Pole accuracy matters more than R².</h2>
            <p>
              A model can approximate the entire grid well while still failing
              to identify the driver starting in first place.
            </p>
          </div>

          <div className="model-comparison">
            {modelMetrics.map((metric, index) => (
              <article key={metric.model}>
                <div className="model-ranking">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="model-name">
                  <h3>{metric.model}</h3>
                  <p>{metric.detail}</p>
                </div>

                <div className="model-accuracy">
                  <strong>{metric.accuracy}%</strong>

                  <div className="accuracy-track">
                    <div
                      style={{
                        width: `${metric.accuracy * 2}%`,
                      }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="transformer-section">
          <div className="transformer-copy">
            <p className="f1-eyebrow">TRANSFORMER ARCHITECTURE</p>

            <h2>The lap is treated like a sentence.</h2>

            <p>
              Instead of words, every token represents one point along the
              circuit. Each token combines track curvature with the
              corresponding speed, throttle, and driver telemetry.
            </p>

            <p>
              The Transformer examines relationships across the full lap and
              compresses them into a lap fingerprint used to predict qualifying
              time.
            </p>
          </div>

          <div className="transformer-flow">
            <div>
              <span>01</span>
              <strong>Track geometry</strong>
              <small>Curvature and distance</small>
            </div>

            <i>+</i>

            <div>
              <span>02</span>
              <strong>Driver telemetry</strong>
              <small>Speed and throttle</small>
            </div>

            <i>→</i>

            <div className="transformer-highlight">
              <span>03</span>
              <strong>Transformer</strong>
              <small>Lap fingerprint</small>
            </div>

            <i>→</i>

            <div>
              <span>04</span>
              <strong>Qualifying time</strong>
              <small>Predicted grid</small>
            </div>
          </div>
        </section>

        <section className="next-steps-section">
          <div>
            <p className="f1-eyebrow">NEXT ITERATION</p>
            <h2>Where the model goes next.</h2>
          </div>

          <div className="next-steps-list">
            <article>
              <span>01</span>
              <p>Experiment with pairwise and listwise ranking loss.</p>
            </article>

            <article>
              <span>02</span>
              <p>Improve the use of segmented corner and track data.</p>
            </article>

            <article>
              <span>03</span>
              <p>Add additional practice sessions to Transformer training.</p>
            </article>

            <article>
              <span>04</span>
              <p>
                Include weather, strategy, and event context directly in the
                sequence model.
              </p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
