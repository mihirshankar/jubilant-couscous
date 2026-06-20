"use client";

import { ChangeEvent, useEffect, useState } from "react";
import "./emotion-detection.css";

type Emotion =
  | "ANGRY"
  | "HAPPY"
  | "SAD"
  | "SURPRISE"
  | "NEUTRAL";

type ModelType = "CNN" | "MLP" | "LANDMARK";

interface EmotionScore {
  emotion: Emotion;
  score: number;
}

interface PipelineStage {
  title: string;
  shortTitle: string;
  description: string;
}

const pipelineStages: PipelineStage[] = [
  {
    shortTitle: "Input",
    title: "Facial Image Input",
    description:
      "The model begins with a 48 × 48 grayscale facial image. Reducing the image to grayscale allows the model to focus on facial structure rather than color.",
  },
  {
    shortTitle: "Prepare",
    title: "Data Preparation",
    description:
      "Invalid samples are removed, emotion labels are converted into five categories, and the dataset is divided into training and testing groups.",
  },
  {
    shortTitle: "Features",
    title: "Feature Extraction",
    description:
      "Depending on the selected model, the system analyzes raw pixels, facial landmarks, or spatial image patterns learned through convolutional layers.",
  },
  {
    shortTitle: "Model",
    title: "Neural Network Classification",
    description:
      "The processed features pass through a neural network. The final softmax layer produces a probability for each supported emotion.",
  },
  {
    shortTitle: "Result",
    title: "Emotion Prediction",
    description:
      "The emotion with the highest confidence becomes the model's predicted classification.",
  },
];

const sampleResults: Record<Emotion, EmotionScore[]> = {
  HAPPY: [
    { emotion: "HAPPY", score: 86 },
    { emotion: "NEUTRAL", score: 7 },
    { emotion: "SURPRISE", score: 4 },
    { emotion: "SAD", score: 2 },
    { emotion: "ANGRY", score: 1 },
  ],
  SAD: [
    { emotion: "SAD", score: 77 },
    { emotion: "NEUTRAL", score: 12 },
    { emotion: "ANGRY", score: 6 },
    { emotion: "HAPPY", score: 3 },
    { emotion: "SURPRISE", score: 2 },
  ],
  ANGRY: [
    { emotion: "ANGRY", score: 81 },
    { emotion: "NEUTRAL", score: 8 },
    { emotion: "SAD", score: 6 },
    { emotion: "SURPRISE", score: 3 },
    { emotion: "HAPPY", score: 2 },
  ],
  SURPRISE: [
    { emotion: "SURPRISE", score: 84 },
    { emotion: "HAPPY", score: 7 },
    { emotion: "NEUTRAL", score: 5 },
    { emotion: "ANGRY", score: 2 },
    { emotion: "SAD", score: 2 },
  ],
  NEUTRAL: [
    { emotion: "NEUTRAL", score: 73 },
    { emotion: "SAD", score: 9 },
    { emotion: "HAPPY", score: 8 },
    { emotion: "ANGRY", score: 6 },
    { emotion: "SURPRISE", score: 4 },
  ],
};

const emotionIcons: Record<Emotion, string> = {
  HAPPY: "😊",
  SAD: "😔",
  ANGRY: "😠",
  SURPRISE: "😮",
  NEUTRAL: "😐",
};

const modelDescriptions: Record<ModelType, string> = {
  CNN:
    "The convolutional neural network examines nearby groups of pixels to learn facial patterns such as mouth shape, eyebrow position, and eye structure.",
  MLP:
    "The multilayer perceptron receives standardized pixel values and passes them through fully connected layers to classify the facial expression.",
  LANDMARK:
    "The landmark model uses 68 facial coordinates to analyze the relative position of the eyes, jaw, nose, eyebrows, and mouth.",
};

export default function EmotionDetectionPage() {
  const [selectedEmotion, setSelectedEmotion] =
    useState<Emotion>("HAPPY");

  const [selectedModel, setSelectedModel] =
    useState<ModelType>("CNN");

  const [currentStage, setCurrentStage] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const results = sampleResults[selectedEmotion];

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const runWalkthrough = () => {
    if (isRunning) return;

    setIsRunning(true);
    setHasFinished(false);
    setCurrentStage(0);

    let nextStage = 0;

    const interval = window.setInterval(() => {
      nextStage += 1;

      if (nextStage >= pipelineStages.length) {
        window.clearInterval(interval);
        setCurrentStage(pipelineStages.length - 1);
        setIsRunning(false);
        setHasFinished(true);
        return;
      }

      setCurrentStage(nextStage);
    }, 850);
  };

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setHasFinished(false);
    setCurrentStage(0);
  };

  return (
    <div> 

    <div className = "box"> 

        </div>
    <main className="emotion-page">
       
      <section className="emotion-hero">
       
        <div className="emotion-hero-copy">
          <p className="emotion-eyebrow">
            MACHINE LEARNING PROJECT
          </p>

          <h1>Facial Emotion Detection</h1>

          <p className="emotion-hero-description">
            A machine-learning system that compares multiple neural
            network architectures to classify facial expressions as
            angry, happy, sad, surprised, or neutral.
          </p>

          <div className="emotion-tags">
            <span>Python</span>
            <span>TensorFlow</span>
            <span>Keras</span>
            <span>OpenCV</span>
            <span>dlib</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="scanner-frame">
            <div className="scanner-line" />

            <div className="face-display">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Uploaded facial preview"
                />
              ) : (
                <span>{emotionIcons[selectedEmotion]}</span>
              )}
            </div>

            <div className="corner corner-top-left" />
            <div className="corner corner-top-right" />
            <div className="corner corner-bottom-left" />
            <div className="corner corner-bottom-right" />

            <p>FACIAL ANALYSIS</p>
          </div>
        </div>
      </section>

      <section className="project-summary-grid">
        <article>
          <span className="summary-number">01</span>
          <h2>The Problem</h2>
          <p>
            Facial expressions can be difficult to interpret during
            virtual communication. This project explores whether
            machine learning can automatically recognize common
            emotional states.
          </p>
        </article>

        <article>
          <span className="summary-number">02</span>
          <h2>The Data</h2>
          <p>
            Facial images are converted into grayscale pixel arrays
            and categorized into five emotion classes. Invalid
            samples are removed before creating training and testing
            datasets.
          </p>
        </article>

        <article>
          <span className="summary-number">03</span>
          <h2>The Models</h2>
          <p>
            The project compares a pixel-based MLP, a facial-landmark
            neural network, and a convolutional neural network that
            learns spatial image features.
          </p>
        </article>

        <article>
          <span className="summary-number">04</span>
          <h2>The Evaluation</h2>
          <p>
            Each model is evaluated using test accuracy, validation
            loss, training curves, confidence scores, and a
            five-class confusion matrix.
          </p>
        </article>
      </section>

      <section className="interactive-section">
        <div className="section-heading">
          <p className="emotion-eyebrow">
            INTERACTIVE WALKTHROUGH
          </p>
          <h2>Explore the classification pipeline</h2>
          <p>
            Select a model and sample expression, then run the
            walkthrough to see how an image moves through the system.
          </p>
        </div>

        <div className="interactive-layout">
          <div className="control-panel">
            <div className="control-group">
              <h3>1. Select a model</h3>

              <div className="model-buttons">
                {(["CNN", "MLP", "LANDMARK"] as ModelType[]).map(
                  (model) => (
                    <button
                      key={model}
                      type="button"
                      className={
                        selectedModel === model ? "active" : ""
                      }
                      onClick={() => {
                        setSelectedModel(model);
                        setHasFinished(false);
                      }}
                    >
                      {model === "LANDMARK"
                        ? "Landmarks"
                        : model}
                    </button>
                  )
                )}
              </div>

              <p className="model-explanation">
                {modelDescriptions[selectedModel]}
              </p>
            </div>

            <div className="control-group">
              <h3>2. Select a sample expression</h3>

              <div className="emotion-selector">
                {(Object.keys(emotionIcons) as Emotion[]).map(
                  (emotion) => (
                    <button
                      type="button"
                      key={emotion}
                      className={
                        selectedEmotion === emotion ? "active" : ""
                      }
                      onClick={() => {
                        setSelectedEmotion(emotion);
                        setHasFinished(false);
                        setCurrentStage(0);
                      }}
                    >
                      <span>{emotionIcons[emotion]}</span>
                      {emotion}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="control-group">
              <h3>3. Or upload an image</h3>

              <label className="upload-button">
                Choose image
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageUpload}
                />
              </label>

              <p className="upload-note">
                Uploaded images are displayed locally and are not sent
                to a server.
              </p>
            </div>

            <button
              className="run-button"
              type="button"
              onClick={runWalkthrough}
              disabled={isRunning}
            >
              {isRunning
                ? "Analyzing pipeline..."
                : "Run interactive walkthrough"}
            </button>
          </div>

          <div className="demonstration-panel">
            <div className="pipeline-progress">
              {pipelineStages.map((stage, index) => (
                <button
                  type="button"
                  key={stage.shortTitle}
                  className={[
                    "pipeline-step",
                    currentStage === index ? "current" : "",
                    currentStage > index || hasFinished
                      ? "complete"
                      : "",
                  ].join(" ")}
                  onClick={() => {
                    if (!isRunning) {
                      setCurrentStage(index);
                    }
                  }}
                >
                  <span>{index + 1}</span>
                  <small>{stage.shortTitle}</small>
                </button>
              ))}
            </div>

            <div className="stage-card">
              <div className="stage-copy">
                <span className="stage-label">
                  STAGE {currentStage + 1}
                </span>
                <h3>{pipelineStages[currentStage].title}</h3>
                <p>{pipelineStages[currentStage].description}</p>
              </div>

              <div className="stage-animation">
                <div
                  className={`model-visual stage-${currentStage}`}
                >
                  <span>
                    {imagePreview
                      ? "IMAGE"
                      : emotionIcons[selectedEmotion]}
                  </span>
                </div>

                <div className="data-arrow">→</div>

                <div className="network-visual">
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                </div>
              </div>
            </div>

            <div
              className={`results-card ${
                hasFinished ? "visible" : ""
              }`}
            >
              <div className="prediction-header">
                <div>
                  <span>DEMONSTRATION RESULT</span>
                  <h3>{selectedEmotion}</h3>
                </div>

                <strong>{results[0].score}%</strong>
              </div>

              <div className="confidence-list">
                {results.map((result) => (
                  <div
                    className="confidence-row"
                    key={result.emotion}
                  >
                    <div className="confidence-label">
                      <span>{result.emotion}</span>
                      <span>{result.score}%</span>
                    </div>

                    <div className="confidence-track">
                      <div
                        className="confidence-fill"
                        style={{
                          width: hasFinished
                            ? `${result.score}%`
                            : "0%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="demo-disclaimer">
                These scores demonstrate how model output is
                visualized. They are not generated by live inference.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="architecture-section">
        <div className="section-heading">
          <p className="emotion-eyebrow">MODEL COMPARISON</p>
          <h2>Three approaches to the same problem</h2>
        </div>

        <div className="architecture-grid">
          <article>
            <span>01</span>
            <h3>Pixel MLP</h3>
            <p>
              Standardized image pixels are flattened into a feature
              vector and passed through fully connected neural-network
              layers.
            </p>
            <div className="architecture-flow">
              Pixels → Dense Layers → Softmax
            </div>
          </article>

          <article>
            <span>02</span>
            <h3>Facial Landmarks</h3>
            <p>
              Sixty-eight facial coordinates represent important
              locations around the eyes, nose, jaw, eyebrows, and
              mouth.
            </p>
            <div className="architecture-flow">
              Coordinates → Dense Layers → Softmax
            </div>
          </article>

          <article>
            <span>03</span>
            <h3>Convolutional Network</h3>
            <p>
              Convolution, normalization, pooling, and dropout layers
              learn progressively more complex visual patterns.
            </p>
            <div className="architecture-flow">
              Image → Convolution → Classification
            </div>
          </article>
        </div>
      </section>
    </main>
    </div>
  );
}