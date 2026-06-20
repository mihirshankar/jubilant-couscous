"use client";

import { useMemo, useState } from "react";
import "./loadforecasting.css";

type Region = "CAISO" | "SCE" | "PGE" | "SDGE" | "VEA";

type ForecastModel =
  | "Linear Regression"
  | "Random Forest"
  | "XGBoost"
  | "Bidirectional LSTM"
  | "ST-CALNet";

type ForecastStrategy = "Direct" | "Bottom-up";

interface RegionProfile {
  name: string;
  fullName: string;
  shortDescription: string;
  meanLoad: number;
  unit: "MW";
  actual: number[];
  temperature: number[];
}

interface ModelProfile {
  family: string;
  shortLabel: string;
  description: string;
  recruiterTakeaway: string;
  strength: string;
  tradeoff: string;
  reportedResult: string;
  errorScale: number;
}

interface PipelineStage {
  label: string;
  title: string;
  description: string;
  detail: string;
}

interface SkillCard {
  number: string;
  title: string;
  description: string;
}

const HOURS = Array.from({ length: 24 }, (_, index) => index);

const regionProfiles: Record<Region, RegionProfile> = {
  CAISO: {
    name: "CAISO",
    fullName: "California Independent System Operator",
    shortDescription:
      "The system-wide view combines several climates, customer groups, and regional demand patterns.",
    meanLoad: 25443,
    unit: "MW",
    actual: [
      22350, 21680, 21120, 20740, 20560, 20840, 21920, 23580, 25150, 26320,
      27080, 27440, 27610, 27890, 28320, 29140, 30580, 31940, 32680, 32120,
      30540, 28320, 25980, 23940,
    ],
    temperature: [
      59, 58, 57, 56, 55, 55, 57, 60, 64, 68, 72, 75, 78, 80, 82, 83, 82, 80,
      77, 73, 69, 66, 63, 61,
    ],
  },
  SCE: {
    name: "SCE",
    fullName: "Southern California Edison",
    shortDescription:
      "A large Southern California region where heat-driven cooling demand creates pronounced afternoon peaks.",
    meanLoad: 12148,
    unit: "MW",
    actual: [
      10140, 9820, 9610, 9480, 9520, 9750, 10340, 11120, 11980, 12540, 12920,
      13280, 13610, 14040, 14580, 15120, 15840, 16420, 16640, 16180, 15120,
      13780, 12340, 11160,
    ],
    temperature: [
      62, 61, 60, 59, 58, 58, 60, 63, 67, 71, 75, 79, 82, 84, 86, 87, 86, 84,
      81, 77, 73, 69, 66, 64,
    ],
  },
  PGE: {
    name: "PGE",
    fullName: "Pacific Gas and Electric",
    shortDescription:
      "Northern California demand mixes coastal weather, inland heat, and a different daily load shape.",
    meanLoad: 10920,
    unit: "MW",
    actual: [
      10020, 9680, 9440, 9310, 9260, 9420, 9810, 10480, 11240, 11780, 12090,
      12240, 12180, 12260, 12540, 13120, 13980, 14720, 15080, 14640, 13620,
      12410, 11380, 10540,
    ],
    temperature: [
      54, 53, 52, 51, 50, 50, 52, 55, 59, 63, 67, 70, 73, 75, 77, 78, 77, 75,
      72, 68, 64, 61, 58, 56,
    ],
  },
  SDGE: {
    name: "SDGE",
    fullName: "San Diego Gas & Electric",
    shortDescription:
      "A smaller coastal region with smoother demand and less extreme temperature variation.",
    meanLoad: 2248,
    unit: "MW",
    actual: [
      1960, 1890, 1840, 1810, 1825, 1880, 1990, 2140, 2260, 2330, 2370, 2395,
      2410, 2440, 2490, 2580, 2690, 2780, 2815, 2760, 2630, 2440, 2250, 2090,
    ],
    temperature: [
      61, 60, 59, 58, 58, 58, 60, 62, 65, 68, 70, 72, 74, 75, 76, 77, 76, 75,
      73, 71, 68, 66, 64, 62,
    ],
  },
  VEA: {
    name: "VEA",
    fullName: "Valley Electric Association",
    shortDescription:
      "A much smaller regional system where modest absolute errors can represent a meaningful share of total load.",
    meanLoad: 90,
    unit: "MW",
    actual: [
      72, 69, 67, 66, 67, 71, 77, 84, 90, 94, 97, 99, 100, 102, 105, 109, 114,
      118, 120, 116, 108, 97, 87, 78,
    ],
    temperature: [
      67, 65, 63, 62, 61, 61, 64, 69, 75, 81, 86, 90, 93, 95, 97, 98, 96, 92,
      87, 81, 76, 72, 69, 67,
    ],
  },
};

const modelProfiles: Record<ForecastModel, ModelProfile> = {
  "Linear Regression": {
    family: "Classical baseline",
    shortLabel: "LR",
    description:
      "Assigns one coefficient to each weather, calendar, hour, and lag feature. The prediction is a weighted sum of those inputs.",
    recruiterTakeaway:
      "Established a transparent baseline and made it possible to measure whether added complexity produced meaningful value.",
    strength: "Fast, explainable, and easy to debug.",
    tradeoff:
      "Cannot naturally capture nonlinear demand behavior or ordered temporal memory.",
    reportedResult: "613.9 MW pooled MAE",
    errorScale: 1,
  },
  "Random Forest": {
    family: "Tree ensemble",
    shortLabel: "RF",
    description:
      "Averages hundreds of decision trees, allowing the forecast to respond differently across temperatures, hours, and regions.",
    recruiterTakeaway:
      "Demonstrated that nonlinear feature interactions materially improve forecasting over a linear baseline.",
    strength: "Strong nonlinear performance with practical training time.",
    tradeoff:
      "Uses lag features but does not carry an internal memory across the sequence.",
    reportedResult: "488.3 MW pooled MAE",
    errorScale: 0.76,
  },
  XGBoost: {
    family: "Boosted trees",
    shortLabel: "XGB",
    description:
      "Builds trees sequentially so each new tree focuses on correcting the residual errors left by the previous ensemble.",
    recruiterTakeaway:
      "Created the strongest classical benchmark and provided a high bar for evaluating deep sequence models.",
    strength:
      "Excellent tabular-data performance and efficient feature interaction learning.",
    tradeoff:
      "Can associate lagged load with future load, but cannot fully learn order-dependent weekly behavior.",
    reportedResult: "1,014 MW bottom-up CAISO MAE",
    errorScale: 0.66,
  },
  "Bidirectional LSTM": {
    family: "Deep sequence model",
    shortLabel: "BiLSTM",
    description:
      "Processes a 168-hour window in both directions, learning daily and weekly demand patterns from an ordered sequence.",
    recruiterTakeaway:
      "Proved that temporal sequence learning adds signal beyond a carefully tuned tree-based benchmark.",
    strength:
      "Captures weekly seasonality and order-dependent demand transitions.",
    tradeoff:
      "More expensive to train and showed a validation-to-test gap under distribution shift.",
    reportedResult: "827 MW MAE · 3.08% MAPE",
    errorScale: 0.48,
  },
  "ST-CALNet": {
    family: "CNN + LSTM + attention",
    shortLabel: "ST",
    description:
      "Combines convolutional feature extraction, recurrent sequence learning, and attention over the most relevant historical moments.",
    recruiterTakeaway:
      "Delivered the project’s strongest final result by integrating local patterns, long-range temporal context, and selective attention.",
    strength:
      "Best final accuracy and a modular architecture for future feature expansion.",
    tradeoff:
      "Higher computational cost and still limited by the absence of future weather forecasts.",
    reportedResult: "520 MW final MAE",
    errorScale: 0.3,
  },
};

const pipelineStages: PipelineStage[] = [
  {
    label: "Load",
    title: "Collect historical electricity demand",
    description:
      "Hourly CAISO and subregion demand becomes the foundation of the forecast.",
    detail:
      "The pipeline preserves chronological order so the model only learns from information that would have existed at prediction time.",
  },
  {
    label: "Weather",
    title: "Join weather and external context",
    description:
      "Temperature and other environmental conditions help explain heating and cooling demand.",
    detail:
      "Weather affects each region differently, which is one reason region-specific forecasting can outperform a single global model.",
  },
  {
    label: "Features",
    title: "Construct calendar and lag features",
    description:
      "Hour, weekday, seasonality, recent load, and weekly lag values turn raw observations into model-ready inputs.",
    detail:
      "A 168-hour window gives sequence models one complete week of context, including daily cycles and weekend behavior.",
  },
  {
    label: "Model",
    title: "Run the selected forecasting model",
    description:
      "The project compares interpretable baselines, nonlinear tree ensembles, recurrent networks, and ST-CALNet.",
    detail:
      "Every model is judged against the same goal: reduce forecast error without hiding limitations or introducing data leakage.",
  },
  {
    label: "Forecast",
    title: "Generate the next-day load curve",
    description:
      "The output is a sequence of expected megawatt values rather than a single prediction.",
    detail:
      "Operators care about the timing and size of peaks because those periods influence generation planning and grid reliability.",
  },
  {
    label: "Score",
    title: "Compare predictions with actual demand",
    description:
      "MAE, RMSE, MAPE, and R² reveal different aspects of model performance.",
    detail:
      "MAE is easy to interpret in megawatts, while RMSE emphasizes larger misses and MAPE makes errors comparable as percentages.",
  },
];

const skillCards: SkillCard[] = [
  {
    number: "01",
    title: "Data engineering",
    description:
      "Built a reproducible workflow for aligning hourly grid demand, regional observations, weather, calendar variables, and lag features.",
  },
  {
    number: "02",
    title: "Model benchmarking",
    description:
      "Compared simple baselines with Random Forest, XGBoost, LSTM variants, and ST-CALNet using chronological evaluation.",
  },
  {
    number: "03",
    title: "Time-series reasoning",
    description:
      "Used full-week windows, no-shuffle data splits, train-only scaling, and lag construction to prevent future-data leakage.",
  },
  {
    number: "04",
    title: "Product communication",
    description:
      "Translated technical results into operational questions: peak demand, regional specialization, reliability, and deployment tradeoffs.",
  },
];

const errorPattern = [
  -0.5, -0.35, -0.2, 0.1, 0.32, 0.5, 0.42, 0.18, -0.12, -0.38, -0.48, -0.28,
  0.05, 0.27, 0.44, 0.33, 0.06, -0.25, -0.42, -0.31, -0.02, 0.25, 0.38, 0.12,
];

const strategyPattern = [
  0.12, 0.08, -0.04, -0.06, 0.02, 0.1, 0.08, -0.02, -0.06, -0.1, -0.08, -0.02,
  0.04, 0.08, 0.1, 0.04, -0.04, -0.08, -0.12, -0.08, 0, 0.06, 0.08, 0.03,
];

const classicalResults = [
  {
    model: "Linear Regression",
    mae: "613.9 MW",
    rmse: "1,071.6 MW",
    note: "Pooled across CAISO and four subregions",
  },
  {
    model: "Random Forest",
    mae: "488.3 MW",
    rmse: "868.9 MW",
    note: "Pooled across CAISO and four subregions",
  },
  {
    model: "XGBoost",
    mae: "483.7 MW",
    rmse: "870.2 MW",
    note: "Best pooled classical MAE",
  },
];

const directVsBottomUp = [
  {
    model: "Linear Regression",
    direct: 1446,
    bottomUp: 1359,
    improvement: "6.1%",
  },
  {
    model: "Random Forest",
    direct: 1131,
    bottomUp: 1031,
    improvement: "8.8%",
  },
  {
    model: "XGBoost",
    direct: 1146,
    bottomUp: 1014,
    improvement: "11.6%",
  },
];

const architectureSteps = [
  {
    code: "01",
    name: "Historical inputs",
    description: "Seven days of load, weather, lag, and time features.",
  },
  {
    code: "02",
    name: "Convolution",
    description: "Detects local ramps, spikes, and short-term hourly patterns.",
  },
  {
    code: "03",
    name: "LSTM memory",
    description: "Learns how demand evolves across daily and weekly sequences.",
  },
  {
    code: "04",
    name: "Attention",
    description: "Weights the historical moments most useful for the forecast.",
  },
  {
    code: "05",
    name: "Load forecast",
    description: "Produces the expected future demand in megawatts.",
  },
];

const modelOrder: ForecastModel[] = [
  "Linear Regression",
  "Random Forest",
  "XGBoost",
  "Bidirectional LSTM",
  "ST-CALNet",
];

const regionOrder: Region[] = ["CAISO", "SCE", "PGE", "SDGE", "VEA"];

function toChartPath(
  values: number[],
  minValue: number,
  maxValue: number,
  width: number,
  height: number,
) {
  const valueRange = Math.max(maxValue - minValue, 1);

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - minValue) / valueRange) * height;

      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function formatLoad(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatHour(hour: number) {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
}

export default function LoadForecastingPage() {
  const [selectedRegion, setSelectedRegion] = useState<Region>("CAISO");
  const [selectedModel, setSelectedModel] =
    useState<ForecastModel>("ST-CALNet");
  const [selectedStrategy, setSelectedStrategy] =
    useState<ForecastStrategy>("Bottom-up");
  const [currentStage, setCurrentStage] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasResults, setHasResults] = useState(true);
  const [activeMetric, setActiveMetric] = useState<"MAE" | "RMSE" | "MAPE">(
    "MAE",
  );

  const region = regionProfiles[selectedRegion];
  const model = modelProfiles[selectedModel];

  const predicted = useMemo(() => {
    const regionalScale = Math.max(region.meanLoad * 0.035, 4);
    const strategyMultiplier =
      selectedStrategy === "Bottom-up" && selectedRegion === "CAISO" ? 0.88 : 1;

    return region.actual.map((actual, index) => {
      const modelError =
        errorPattern[index] *
        regionalScale *
        model.errorScale *
        strategyMultiplier;
      const strategyAdjustment =
        selectedStrategy === "Bottom-up" && selectedRegion === "CAISO"
          ? strategyPattern[index] * regionalScale * 0.25
          : 0;

      return Math.max(0, Math.round(actual + modelError + strategyAdjustment));
    });
  }, [model.errorScale, region, selectedRegion, selectedStrategy]);

  const chart = useMemo(() => {
    const width = 960;
    const height = 300;
    const allValues = [...region.actual, ...predicted];
    const rawMin = Math.min(...allValues);
    const rawMax = Math.max(...allValues);
    const padding = Math.max((rawMax - rawMin) * 0.14, rawMax * 0.02, 2);
    const minValue = Math.max(0, rawMin - padding);
    const maxValue = rawMax + padding;

    return {
      width,
      height,
      minValue,
      maxValue,
      actualPath: toChartPath(region.actual, minValue, maxValue, width, height),
      predictedPath: toChartPath(predicted, minValue, maxValue, width, height),
    };
  }, [predicted, region.actual]);

  const metrics = useMemo(() => {
    const absoluteErrors = region.actual.map((actual, index) =>
      Math.abs(actual - predicted[index]),
    );
    const squaredErrors = region.actual.map((actual, index) =>
      Math.pow(actual - predicted[index], 2),
    );
    const percentageErrors = region.actual.map((actual, index) =>
      actual === 0 ? 0 : Math.abs((actual - predicted[index]) / actual),
    );

    const mae =
      absoluteErrors.reduce((total, value) => total + value, 0) /
      absoluteErrors.length;
    const rmse = Math.sqrt(
      squaredErrors.reduce((total, value) => total + value, 0) /
        squaredErrors.length,
    );
    const mape =
      (percentageErrors.reduce((total, value) => total + value, 0) /
        percentageErrors.length) *
      100;

    const actualPeak = Math.max(...region.actual);
    const predictedPeak = Math.max(...predicted);
    const actualPeakHour = region.actual.indexOf(actualPeak);
    const predictedPeakHour = predicted.indexOf(predictedPeak);

    return {
      mae,
      rmse,
      mape,
      actualPeak,
      predictedPeak,
      actualPeakHour,
      predictedPeakHour,
    };
  }, [predicted, region.actual]);

  const displayedMetric = {
    MAE: `${formatLoad(metrics.mae)} MW`,
    RMSE: `${formatLoad(metrics.rmse)} MW`,
    MAPE: `${metrics.mape.toFixed(2)}%`,
  }[activeMetric];

  const runForecast = () => {
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
    }, 620);
  };

  return (
    <main className="lf-page">
      <div className="box" />
      <section className="lf-hero" aria-labelledby="lf-page-title">
        <div className="lf-hero-copy">
          <p className="lf-eyebrow">CAISO × ELECTRICITY LOAD FORECASTING</p>

          <h1 id="lf-page-title">
            Predicting tomorrow’s demand,
            <span> one hour at a time.</span>
          </h1>

          <p className="lf-hero-description">
            An end-to-end forecasting project that transforms historical grid
            demand, weather, calendar context, and weekly patterns into hourly
            electricity-load predictions for California and four subregions.
          </p>

          <div className="lf-hero-actions">
            <a href="#forecast-lab">Explore the forecast</a>
            <a className="lf-secondary-link" href="#model-story">
              See the model progression
            </a>
          </div>

          <div className="lf-context-line">
            <span>Team research project</span>
            <span aria-hidden="true">•</span>
            <span>Presented at Millennium Management Global Investment</span>
          </div>
        </div>

        <div className="lf-hero-visual" aria-label="Project headline metrics">
          <div className="lf-demand-ring">
            <div className="lf-demand-ring-inner">
              <span>BEST FINAL</span>
              <strong>520</strong>
              <small>MW MAE</small>
            </div>
          </div>

          <div className="lf-floating-stat lf-floating-stat-one">
            <span>FORECAST WINDOW</span>
            <strong>168 hours</strong>
          </div>

          <div className="lf-floating-stat lf-floating-stat-two">
            <span>REGIONS</span>
            <strong>5</strong>
          </div>

          <div className="lf-floating-stat lf-floating-stat-three">
            <span>TOP MODEL</span>
            <strong>ST-CALNet</strong>
          </div>
        </div>
      </section>

      <section className="lf-recruiter-summary" aria-label="Project summary">
        <div className="lf-summary-heading">
          <p className="lf-eyebrow">RECRUITER SNAPSHOT</p>
          <h2>What this project demonstrates</h2>
        </div>

        <div className="lf-summary-grid">
          {skillCards.map((card) => (
            <article key={card.number}>
              <span>{card.number}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="lf-problem-section">
        <div className="lf-section-heading">
          <p className="lf-eyebrow">THE BUSINESS PROBLEM</p>
          <h2>Electricity must be available before customers ask for it.</h2>
          <p>
            Grid operators need an accurate view of future demand to plan
            generation, manage reserves, and prepare for peak hours. Forecast
            too low and reliability is at risk. Forecast too high and resources
            may be scheduled inefficiently.
          </p>
        </div>

        <div className="lf-tension-grid">
          <article className="lf-tension-card">
            <span>01 / ACCURACY</span>
            <h3>Reduce the size of forecasting errors</h3>
            <p>
              Better forecasts help operators anticipate morning ramps,
              afternoon cooling demand, and evening peaks.
            </p>
            <div className="lf-tension-meter">
              <span style={{ width: "88%" }} />
            </div>
          </article>

          <article className="lf-tension-card">
            <span>02 / INTERPRETABILITY</span>
            <h3>Explain why the model made its prediction</h3>
            <p>
              Simpler models expose coefficients and feature effects, making
              them easier to audit and communicate.
            </p>
            <div className="lf-tension-meter">
              <span style={{ width: "72%" }} />
            </div>
          </article>

          <article className="lf-tension-card lf-tension-card-featured">
            <span>THE CORE QUESTION</span>
            <h3>When is additional complexity worth it?</h3>
            <p>
              The project benchmarks each architecture to verify that gains in
              accuracy are real—not simply the result of a more complicated
              model.
            </p>
          </article>
        </div>
      </section>

      <section className="lf-forecast-section" id="forecast-lab">
        <div className="lf-section-heading lf-heading-light">
          <p className="lf-eyebrow">INTERACTIVE FORECAST LAB</p>
          <h2>See how an hourly load forecast is built.</h2>
          <p>
            Select a region, model, and forecasting strategy. The interface then
            walks through the same conceptual pipeline used in the project.
          </p>
        </div>

        <div className="lf-forecast-layout">
          <aside className="lf-controls" aria-label="Forecast controls">
            <div className="lf-control-block">
              <span className="lf-control-label">01 / REGION</span>
              <div className="lf-region-options">
                {regionOrder.map((regionName) => (
                  <button
                    type="button"
                    key={regionName}
                    className={selectedRegion === regionName ? "is-active" : ""}
                    onClick={() => {
                      setSelectedRegion(regionName);
                      setHasResults(true);
                    }}
                  >
                    <strong>{regionName}</strong>
                    <small>{regionProfiles[regionName].fullName}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="lf-control-block">
              <span className="lf-control-label">02 / MODEL</span>
              <div className="lf-model-options">
                {modelOrder.map((modelName) => (
                  <button
                    type="button"
                    key={modelName}
                    className={selectedModel === modelName ? "is-active" : ""}
                    onClick={() => setSelectedModel(modelName)}
                  >
                    {modelName}
                  </button>
                ))}
              </div>

              <div className="lf-selected-model-copy">
                <span>{model.family}</span>
                <p>{model.description}</p>
              </div>
            </div>

            <div className="lf-control-block">
              <span className="lf-control-label">03 / STRATEGY</span>
              <div className="lf-strategy-toggle">
                {(["Direct", "Bottom-up"] as ForecastStrategy[]).map(
                  (strategy) => (
                    <button
                      type="button"
                      key={strategy}
                      className={
                        selectedStrategy === strategy ? "is-active" : ""
                      }
                      onClick={() => setSelectedStrategy(strategy)}
                    >
                      {strategy}
                    </button>
                  ),
                )}
              </div>
              <p className="lf-control-help">
                Bottom-up means forecasting each subregion separately and then
                summing the predictions for CAISO.
              </p>
            </div>

            <button
              type="button"
              className="lf-run-button"
              onClick={runForecast}
              disabled={isRunning}
            >
              <span>{isRunning ? "Building forecast" : "Run forecast"}</span>
              <strong aria-hidden="true">→</strong>
            </button>
          </aside>

          <div className="lf-workspace">
            <div className="lf-pipeline-navigation">
              {pipelineStages.map((stage, index) => (
                <button
                  type="button"
                  key={stage.label}
                  className={[
                    currentStage === index ? "is-current" : "",
                    currentStage > index || hasResults ? "is-complete" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => {
                    if (!isRunning) setCurrentStage(index);
                  }}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <small>{stage.label}</small>
                </button>
              ))}
            </div>

            <div className="lf-pipeline-display">
              <div className="lf-pipeline-copy">
                <span>STAGE {String(currentStage + 1).padStart(2, "0")}</span>
                <h3>{pipelineStages[currentStage].title}</h3>
                <p>{pipelineStages[currentStage].description}</p>
                <small>{pipelineStages[currentStage].detail}</small>
              </div>

              <div className="lf-pipeline-visual" aria-hidden="true">
                <div className="lf-data-column">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="lf-data-lines">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="lf-model-core">
                  <span>{model.shortLabel}</span>
                  <small>FORECAST</small>
                </div>
                <div className="lf-output-wave">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>

            <div
              className={`lf-results-panel ${hasResults ? "is-visible" : ""}`}
            >
              <div className="lf-results-header">
                <div>
                  <span>24-HOUR PORTFOLIO DEMONSTRATION</span>
                  <h3>{region.fullName}</h3>
                  <p>{region.shortDescription}</p>
                </div>

                <div className="lf-ready-status">
                  <span />
                  Forecast ready
                </div>
              </div>

              <div className="lf-chart-card">
                <div className="lf-chart-toolbar">
                  <div className="lf-chart-legend">
                    <span className="lf-legend-item lf-legend-actual">
                      <i /> Actual load
                    </span>
                    <span className="lf-legend-item lf-legend-predicted">
                      <i /> Predicted load
                    </span>
                  </div>

                  <div className="lf-chart-context">
                    <span>{selectedModel}</span>
                    <span>{selectedStrategy}</span>
                  </div>
                </div>

                <div className="lf-load-chart">
                  <div className="lf-chart-grid" />
                  <svg
                    viewBox={`0 0 ${chart.width} ${chart.height}`}
                    preserveAspectRatio="none"
                    role="img"
                    aria-label={`Actual and predicted hourly electricity load for ${region.fullName}`}
                  >
                    <path
                      className="lf-chart-area"
                      d={`${chart.actualPath} L ${chart.width} ${chart.height} L 0 ${chart.height} Z`}
                    />
                    <path className="lf-chart-actual" d={chart.actualPath} />
                    <path
                      className="lf-chart-predicted"
                      d={chart.predictedPath}
                    />
                  </svg>

                  <div className="lf-chart-y-label lf-chart-y-top">
                    {formatLoad(chart.maxValue)} MW
                  </div>
                  <div className="lf-chart-y-label lf-chart-y-bottom">
                    {formatLoad(chart.minValue)} MW
                  </div>

                  <div className="lf-chart-hours" aria-hidden="true">
                    {[0, 4, 8, 12, 16, 20, 23].map((hour) => (
                      <span key={hour}>{formatHour(hour)}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lf-result-metrics">
                <article className="lf-primary-metric">
                  <div
                    className="lf-metric-tabs"
                    role="group"
                    aria-label="Metric"
                  >
                    {(["MAE", "RMSE", "MAPE"] as const).map((metric) => (
                      <button
                        type="button"
                        key={metric}
                        className={activeMetric === metric ? "is-active" : ""}
                        onClick={() => setActiveMetric(metric)}
                      >
                        {metric}
                      </button>
                    ))}
                  </div>
                  <strong>{displayedMetric}</strong>
                  <p>
                    Demonstration metric calculated from the representative
                    chart above.
                  </p>
                </article>

                <article>
                  <span>ACTUAL PEAK</span>
                  <strong>{formatLoad(metrics.actualPeak)} MW</strong>
                  <p>{formatHour(metrics.actualPeakHour)}</p>
                </article>

                <article>
                  <span>PREDICTED PEAK</span>
                  <strong>{formatLoad(metrics.predictedPeak)} MW</strong>
                  <p>{formatHour(metrics.predictedPeakHour)}</p>
                </article>

                <article>
                  <span>REPORTED PROJECT RESULT</span>
                  <strong>{model.reportedResult}</strong>
                  <p>{model.family}</p>
                </article>
              </div>

              <p className="lf-simulation-note">
                The chart uses representative portfolio data to demonstrate the
                product experience. Reported project metrics are labeled
                separately and come from the team’s completed model evaluation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="lf-data-story">
        <div className="lf-section-heading">
          <p className="lf-eyebrow">FROM RAW DATA TO FORECAST</p>
          <h2>The model does not begin with a neural network.</h2>
          <p>
            Reliable forecasting starts with a disciplined data pipeline. The
            project aligns each observation to the correct hour, region, and
            historical context before any model is trained.
          </p>
        </div>

        <div className="lf-data-flow">
          <article>
            <span>01</span>
            <div>
              <h3>Hourly grid demand</h3>
              <p>
                CAISO and regional load observations provide the target the
                models learn to predict.
              </p>
            </div>
          </article>
          <i aria-hidden="true">→</i>
          <article>
            <span>02</span>
            <div>
              <h3>Weather context</h3>
              <p>
                Temperature and environmental variables explain cooling and
                heating behavior.
              </p>
            </div>
          </article>
          <i aria-hidden="true">→</i>
          <article>
            <span>03</span>
            <div>
              <h3>Time features</h3>
              <p>
                Hour, weekday, season, and lagged demand expose repeated daily
                and weekly patterns.
              </p>
            </div>
          </article>
          <i aria-hidden="true">→</i>
          <article>
            <span>04</span>
            <div>
              <h3>Chronological split</h3>
              <p>
                Training, validation, and test sets remain ordered to prevent
                information from the future leaking backward.
              </p>
            </div>
          </article>
        </div>

        <div className="lf-feature-board">
          <div className="lf-feature-board-copy">
            <span>MODEL INPUTS</span>
            <h3>What the forecast can see</h3>
            <p>
              Classical models receive engineered tabular features. Sequence
              models also receive an ordered 168-hour history so they can learn
              transitions across an entire week.
            </p>
          </div>

          <div className="lf-feature-tags">
            {[
              "Historical load",
              "Temperature",
              "Hour of day",
              "Day of week",
              "Seasonality",
              "Weekly lag",
              "Rolling context",
              "Region",
              "Future-known time features",
            ].map((feature) => (
              <span key={feature}>{feature}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="lf-regional-section">
        <div className="lf-section-heading">
          <p className="lf-eyebrow">A KEY FINDING</p>
          <h2>Forecast locally, then add the regions together.</h2>
          <p>
            A single CAISO model must compromise across several climates and
            customer mixes. Separate regional models can specialize before their
            forecasts are summed into one system-level prediction.
          </p>
        </div>

        <div className="lf-bottom-up-layout">
          <div
            className="lf-region-map"
            aria-label="Regional forecasting concept"
          >
            <div className="lf-region-node lf-region-sce">SCE</div>
            <div className="lf-region-node lf-region-pge">PGE</div>
            <div className="lf-region-node lf-region-sdge">SDGE</div>
            <div className="lf-region-node lf-region-vea">VEA</div>
            <div className="lf-region-lines" aria-hidden="true" />
            <div className="lf-region-total">
              <span>SUM</span>
              <strong>CAISO</strong>
              <small>system forecast</small>
            </div>
          </div>

          <div className="lf-bottom-up-results">
            <div className="lf-bottom-up-header">
              <span>DIRECT VS. BOTTOM-UP CAISO FORECASTING</span>
              <strong>Lower MAE is better</strong>
            </div>

            {directVsBottomUp.map((result) => (
              <article key={result.model}>
                <div className="lf-bottom-up-model">
                  <strong>{result.model}</strong>
                  <span>{result.improvement} improvement</span>
                </div>

                <div className="lf-comparison-bars">
                  <div>
                    <span>Direct</span>
                    <i style={{ width: `${(result.direct / 1500) * 100}%` }} />
                    <strong>{result.direct.toLocaleString()} MW</strong>
                  </div>
                  <div>
                    <span>Bottom-up</span>
                    <i
                      style={{ width: `${(result.bottomUp / 1500) * 100}%` }}
                    />
                    <strong>{result.bottomUp.toLocaleString()} MW</strong>
                  </div>
                </div>
              </article>
            ))}

            <div className="lf-bottom-up-explanation">
              <div>
                <span>01</span>
                <p>
                  <strong>Specialization:</strong> each regional model learns
                  its own climate and demand shape.
                </p>
              </div>
              <div>
                <span>02</span>
                <p>
                  <strong>Error cancellation:</strong> some regional over- and
                  under-predictions offset when summed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lf-model-section" id="model-story">
        <div className="lf-section-heading lf-heading-light">
          <p className="lf-eyebrow">MODEL PROGRESSION</p>
          <h2>Complexity had to earn its place.</h2>
          <p>
            Each model answered a different question—from whether simple
            coefficients were sufficient to whether attention could identify the
            most useful moments in a full week of history.
          </p>
        </div>

        <div className="lf-model-timeline">
          {modelOrder.map((modelName, index) => {
            const profile = modelProfiles[modelName];

            return (
              <article
                key={modelName}
                className={modelName === "ST-CALNet" ? "is-highlighted" : ""}
              >
                <div className="lf-model-index">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="lf-model-card-copy">
                  <span>{profile.family}</span>
                  <h3>{modelName}</h3>
                  <p>{profile.description}</p>
                </div>
                <div className="lf-model-facts">
                  <div>
                    <span>WHY IT MATTERED</span>
                    <p>{profile.recruiterTakeaway}</p>
                  </div>
                  <div>
                    <span>REPORTED RESULT</span>
                    <strong>{profile.reportedResult}</strong>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="lf-classical-table">
          <div className="lf-table-heading">
            <div>
              <span>CLASSICAL MODEL BENCHMARK</span>
              <h3>Pooled performance across five regions</h3>
            </div>
            <p>
              These values belong to the pooled classical evaluation and should
              not be compared as though every later model used the identical
              aggregation context.
            </p>
          </div>

          <div
            className="lf-table"
            role="table"
            aria-label="Classical model results"
          >
            <div className="lf-table-row lf-table-header" role="row">
              <span role="columnheader">Model</span>
              <span role="columnheader">MAE</span>
              <span role="columnheader">RMSE</span>
              <span role="columnheader">Context</span>
            </div>
            {classicalResults.map((result) => (
              <div className="lf-table-row" role="row" key={result.model}>
                <strong role="cell">{result.model}</strong>
                <span role="cell">{result.mae}</span>
                <span role="cell">{result.rmse}</span>
                <span role="cell">{result.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lf-architecture-section">
        <div className="lf-section-heading">
          <p className="lf-eyebrow">BEST FINAL MODEL</p>
          <h2>Inside ST-CALNet</h2>
          <p>
            The final architecture combines three complementary ideas: a CNN for
            local patterns, an LSTM for sequence memory, and attention for
            deciding which historical moments deserve the most weight.
          </p>
        </div>

        <div className="lf-architecture-flow">
          {architectureSteps.map((step, index) => (
            <div className="lf-architecture-step" key={step.code}>
              <article>
                <span>{step.code}</span>
                <h3>{step.name}</h3>
                <p>{step.description}</p>
              </article>
              {index < architectureSteps.length - 1 && (
                <i aria-hidden="true">→</i>
              )}
            </div>
          ))}
        </div>

        <div className="lf-architecture-result">
          <div className="lf-architecture-score">
            <span>FINAL ST-CALNET RESULT</span>
            <strong>520 MW</strong>
            <small>mean absolute error</small>
          </div>

          <div className="lf-architecture-notes">
            <article>
              <span>CNN</span>
              <p>
                Extracts rapid hourly fluctuations and short local patterns.
              </p>
            </article>
            <article>
              <span>LSTM</span>
              <p>Tracks how demand evolves across the seven-day sequence.</p>
            </article>
            <article>
              <span>ATTENTION</span>
              <p>
                Focuses the forecast on the most relevant historical moments.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="lf-evaluation-section">
        <div className="lf-section-heading">
          <p className="lf-eyebrow">EVALUATION WITHOUT THE JARGON</p>
          <h2>Four metrics answer four different questions.</h2>
        </div>

        <div className="lf-metric-explainer-grid">
          <article>
            <span>MAE</span>
            <h3>How far off are we, on average?</h3>
            <p>
              Mean Absolute Error reports the typical miss in megawatts. It is
              the most intuitive headline metric for this project.
            </p>
          </article>
          <article>
            <span>RMSE</span>
            <h3>Are there any especially large misses?</h3>
            <p>
              Root Mean Squared Error penalizes large errors more heavily,
              making it useful when peak-hour mistakes are especially costly.
            </p>
          </article>
          <article>
            <span>MAPE</span>
            <h3>What percentage of demand did we miss?</h3>
            <p>
              Mean Absolute Percentage Error normalizes the error, but it must
              be interpreted carefully for very small regional loads.
            </p>
          </article>
          <article>
            <span>R²</span>
            <h3>How much demand variation is explained?</h3>
            <p>
              R² measures how well the forecast captures the overall rises,
              falls, and recurring patterns in electricity demand.
            </p>
          </article>
        </div>
      </section>

      <section className="lf-honesty-section">
        <div className="lf-section-heading lf-heading-light">
          <p className="lf-eyebrow">HONEST LIMITATIONS</p>
          <h2>A strong metric is not the end of the analysis.</h2>
          <p>
            The presentation treats limitations as part of the engineering
            result rather than hiding them behind the best number.
          </p>
        </div>

        <div className="lf-limitations-grid">
          <article>
            <span>01</span>
            <h3>No future weather forecast</h3>
            <p>
              Historical weather helps explain past demand, but production
              forecasting should include the weather expected during the target
              horizon.
            </p>
            <strong>Next step: forecast-weather integration</strong>
          </article>

          <article>
            <span>02</span>
            <h3>Distribution shift</h3>
            <p>
              The Bidirectional LSTM’s validation-to-test gap suggests that
              late-period demand differed from the data used to fit the model.
            </p>
            <strong>Next step: rolling retraining</strong>
          </article>

          <article>
            <span>03</span>
            <h3>Missing event features</h3>
            <p>
              Holidays, wildfire periods, unusual heat events, and changing EV
              demand can alter load in ways ordinary calendar features miss.
            </p>
            <strong>Next step: event-aware features</strong>
          </article>

          <article>
            <span>04</span>
            <h3>Computational cost</h3>
            <p>
              ST-CALNet improves accuracy but requires more training and
              inference resources than the classical models.
            </p>
            <strong>Next step: latency and cost benchmarking</strong>
          </article>
        </div>
      </section>

      <section className="lf-deployment-section">
        <div className="lf-section-heading">
          <p className="lf-eyebrow">FROM NOTEBOOK TO SYSTEM</p>
          <h2>How the research could become a live forecasting service.</h2>
        </div>

        <div className="lf-deployment-flow">
          <article>
            <span>LIVE DATA</span>
            <h3>GridStatus.io</h3>
            <p>Collect the latest CAISO demand observations on a schedule.</p>
          </article>
          <i aria-hidden="true">→</i>
          <article>
            <span>FEATURE JOB</span>
            <h3>Hourly pipeline</h3>
            <p>
              Build the newest 168-hour window and future-known time inputs.
            </p>
          </article>
          <i aria-hidden="true">→</i>
          <article>
            <span>INFERENCE</span>
            <h3>Saved model weights</h3>
            <p>Load the selected model and generate the next forecast curve.</p>
          </article>
          <i aria-hidden="true">→</i>
          <article>
            <span>MONITORING</span>
            <h3>Hourly scoring</h3>
            <p>Compare predictions with actual load and watch for drift.</p>
          </article>
        </div>
      </section>

      <section className="lf-takeaways-section">
        <div className="lf-takeaway-copy">
          <p className="lf-eyebrow">PROJECT TAKEAWAYS</p>
          <h2>The final result is more than one model score.</h2>
        </div>

        <div className="lf-takeaway-list">
          <article>
            <span>01</span>
            <p>
              <strong>Nonlinearity matters.</strong> Tree ensembles reduced
              pooled error substantially compared with the linear baseline.
            </p>
          </article>
          <article>
            <span>02</span>
            <p>
              <strong>Geography matters.</strong> Regional specialization and
              bottom-up aggregation improved the CAISO forecast.
            </p>
          </article>
          <article>
            <span>03</span>
            <p>
              <strong>Sequence matters.</strong> Full-week context allowed deep
              models to learn recurring demand patterns that static features
              only approximate.
            </p>
          </article>
          <article>
            <span>04</span>
            <p>
              <strong>Data still matters most.</strong> Better architecture
              cannot fully compensate for missing future weather or major
              external events.
            </p>
          </article>
        </div>
      </section>

      <section className="lf-final-cta">
        <div>
          <p className="lf-eyebrow">CAISO LOAD FORECASTING</p>
          <h2>
            Data engineering, machine learning, and product thinking in one
            system.
          </h2>
        </div>
        <a href="#forecast-lab">Return to forecast lab ↑</a>
      </section>
    </main>
  );
}
