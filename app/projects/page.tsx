import { Container, Row } from "react-bootstrap";
import React from "react";

import BottomBar from "../component/bottombar";

const Project = () => {
  return (
    <div className="project-background2">
      <h1 className="title-header">Projects</h1>

      <div className="bar-container">
        <BottomBar />
      </div>

      {/* 8 projects */}
      {/* Load Forecasting */}
      <Container className="container-wrapper">
        <div className="small-grid">
          <div className="small-text">
            <h3>Overview</h3>
            <p>
              A time-series machine-learning project that predicts future
              electricity demand using historical load data. The model is
              designed to identify repeating patterns and estimate how energy
              usage will change over time.
            </p>
          </div>

          <div className="small-text">
            <h3>How It Works</h3>
            <p>
              Historical demand data is cleaned and organized into time-based
              features such as hour, day, season, and previous load values.
              These features are used to train forecasting models and compare
              predicted demand against actual demand.
            </p>
          </div>

          <div className="small-text">
            <h3>Key Features</h3>
            <p>
              The project includes interactive time-series graphs,
              actual-versus-predicted comparisons, error analysis, and
              demand-pattern visualization. It allows viewers to see both
              overall trends and periods where the model performs differently.
            </p>
          </div>

          <div className="small-text">
            <h3>What I Learned</h3>
            <p>
              This project gave me practical experience with time-series data,
              lag features, forecasting, and model validation. It also taught me
              why chronological data must be evaluated differently from randomly
              sampled datasets.
            </p>
          </div>
        </div>
        <a href="/projects/loadforecasting">
          <img
            className="big-img"
            src="loadforecasting2.png"
            alt="Load Forecasting Project"
          />
        </a>
      </Container>

      {/* Formula 1 */}
      <Container className="container-wrapper">
        <a href="/projects/formula1">
          <img className="big-img" src="formula12.png" alt="Formula 1 Model" />
        </a>

        <div className="small-grid">
          <div className="small-text">
            <h3>Overview</h3>
            <p>
              A data-analysis and machine-learning project that explores Formula
              1 race performance using historical racing data. The goal is to
              identify patterns and estimate outcomes based on driver,
              constructor, circuit, and race information.
            </p>
          </div>

          <div className="small-text">
            <h3>How It Works</h3>
            <p>
              Race data is cleaned, transformed, and converted into features
              that can be analyzed or used by predictive models. The results are
              displayed through graphs and charts that make comparisons and
              performance trends easier to understand.
            </p>
          </div>

          <div className="small-text">
            <h3>Key Features</h3>
            <p>
              The project includes driver comparisons, constructor analysis,
              performance visualizations, and predictive modeling. Users can
              explore how qualifying position, recent form, and circuit history
              may affect race results.
            </p>
          </div>

          <div className="small-text">
            <h3>What I Learned</h3>
            <p>
              This project taught me how to work with large real-world datasets
              that contain missing, inconsistent, and interconnected
              information. I also gained experience with feature engineering,
              model evaluation, and communicating results visually.
            </p>
          </div>
        </div>
      </Container>

      {/* World Wide Web */}
      <Container className="container-wrapper">
        <div className="small-grid">
          <div className="small-text">
            <h3>Overview</h3>
            <p>
              World Wide Web is a web-development project focused on reproducing
              the core experience of browsing and navigating connected content.
              It demonstrates how pages, links, user interactions, and shared
              application state can be organized within a modern website.
            </p>
          </div>

          <div className="small-text">
            <h3>How It Works</h3>
            <p>
              The application uses reusable frontend components to display
              interconnected pages and respond to user navigation. Routing
              controls which content is displayed while maintaining a consistent
              layout across the application.
            </p>
          </div>

          <div className="small-text">
            <h3>Key Features</h3>
            <p>
              The project includes responsive page layouts, reusable navigation
              components, interactive content, and organized routing. It was
              designed to remain usable across different screen sizes and
              devices.
            </p>
          </div>

          <div className="small-text">
            <h3>What I Learned</h3>
            <p>
              This project helped me understand how the web connects pages,
              content, and user actions into one experience. I also improved my
              skills in responsive design, component organization, and frontend
              architecture.
            </p>
          </div>
        </div>
        <a href="/projects/www">
          <img
            className="big-img"
            src="www4.png"
            alt="World Wide Web Project"
          />
        </a>
      </Container>

      {/* Hitch */}
      <Container className="container-wrapper">
        <a href="/projects/hitch">
          <img className="big-img" src="hitch3.png" alt="Hitch Project" />
        </a>

        <div className="small-grid">
          <div className="small-text">
            <h3>Overview</h3>
            <p>
              Hitch is a full-stack platform designed to help users connect with
              other people through profiles, preferences, and location-based
              information. It includes account creation, authentication, profile
              management, and an interactive user interface.
            </p>
          </div>

          <div className="small-text">
            <h3>How It Works</h3>
            <p>
              The frontend sends profile and authentication requests to an
              Express backend, which validates the data and communicates with a
              database. JWT authentication is used to keep users signed in and
              protect private routes.
            </p>
          </div>

          <div className="small-text">
            <h3>Key Features</h3>
            <p>
              Users can create an account, log in, edit their profile, upload
              information, and select locations using Google Maps. The
              application also includes reusable frontend components and
              centralized user-state management.
            </p>
          </div>

          <div className="small-text">
            <h3>What I Learned</h3>
            <p>
              Hitch gave me experience building and debugging a larger
              application with several connected systems. I learned how frontend
              state, backend routes, databases, authentication, and third-party
              APIs work together.
            </p>
          </div>
        </div>
      </Container>

      {/* Poker Solver */}
      <Container className="container-wrapper">
        <div className="small-grid">
          <div className="small-text">
            <h3>Overview</h3>
            <p>
              A two-player No-Limit Texas Hold’em simulator and poker-solving
              application originally developed in OCaml. The game focuses on
              simplified all-in or fold decisions using predefined solver
              ranges.
            </p>
          </div>

          <div className="small-text">
            <h3>How It Works</h3>
            <p>
              The program tracks player stacks, blinds, pot size, cards, betting
              decisions, and game outcomes through an immutable game state. JSON
              strategy files determine how the computer responds to different
              starting hands and positions.
            </p>
          </div>

          <div className="small-text">
            <h3>Key Features</h3>
            <p>
              The solver includes deck generation, hand evaluation, randomized
              dealing, bankroll tracking, input validation, and computer
              decision-making. It was later connected to a FastAPI WebSocket
              backend to support an interactive web version.
            </p>
          </div>

          <div className="small-text">
            <h3>What I Learned</h3>
            <p>
              This project strengthened my understanding of functional
              programming, recursion, state transitions, and modular software
              design. It also taught me how to connect an OCaml program to a
              web-based frontend.
            </p>
          </div>
        </div>

        <a href="/projects/pokersolver">
          <div className="big-img-pokersolver">
            <h2 className="poker-solver-title">NLH Poker Game</h2>

            <div className="poker-solver-image-wrapper">
              <img
                src="pokersolver2.png"
                alt="NLH Poker Game"
                className="poker-solver-img"
              />
            </div>
          </div>
        </a>
      </Container>

      {/* Emotion Detection */}
      <Container className="container-wrapper">
        <a href="/projects/emotion_detection">
          <div className="big-image-container">
            <img
              className="big-img3"
              src="emotions3.png"
              alt="Emotion Detection Model"
            />
          </div>
        </a>

        <div className="small-grid">
          <div className="small-text">
            <h3>Overview</h3>
            <p>
              A computer-vision model that identifies facial emotions from
              images. It was created to explore how emotion recognition could
              help instructors better understand student engagement during
              virtual learning.
            </p>
          </div>

          <div className="small-text">
            <h3>How It Works</h3>
            <p>
              Images are processed with OpenCV and dlib to locate faces and
              extract facial landmarks. Multiple machine-learning models,
              including KNN, logistic regression, an MLP, and a CNN, were
              trained to classify five emotions.
            </p>
          </div>

          <div className="small-text">
            <h3>Key Features</h3>
            <p>
              The model recognizes anger, happiness, sadness, surprise, and
              neutral expressions. The project includes image preprocessing,
              facial-landmark extraction, model comparison, accuracy
              measurements, and confusion-matrix visualizations.
            </p>
          </div>

          <div className="small-text">
            <h3>What I Learned</h3>
            <p>
              This project taught me how to build an end-to-end computer-vision
              pipeline from raw data to model evaluation. I also learned how
              preprocessing choices, label consistency, and input dimensions can
              significantly affect model performance.
            </p>
          </div>
        </div>
      </Container>

      {/* Password Manager */}
      <Container className="container-wrapper">
        <div className="small-grid">
          <div className="small-text">
            <h3>Overview</h3>
            <p>
              A secure password manager that allows users to store and retrieve
              account credentials from an encrypted database. The project began
              as a Python command-line application and was later connected to a
              web interface.
            </p>
          </div>

          <div className="small-text">
            <h3>How It Works</h3>
            <p>
              A master password is processed with PBKDF2 to generate an
              encryption key. Account passwords are encrypted with Fernet before
              being saved to a JSON file, ensuring that plaintext passwords are
              never stored.
            </p>
          </div>

          <div className="small-text">
            <h3>Key Features</h3>
            <p>
              Users can add, view, search for, and delete stored accounts. The
              project also includes a FastAPI backend that allows the original
              Python functionality to communicate with a modern frontend.
            </p>
          </div>

          <div className="small-text">
            <h3>What I Learned</h3>
            <p>
              This project taught me how encryption, password-derived keys,
              salts, APIs, and persistent storage work together. It also gave me
              experience converting a standalone Python program into a
              full-stack application.
            </p>
          </div>
        </div>
        <a href="/projects/passwordmanager">
          <div className="big-img-container">
            <img
              className="big-img3"
              src="passwordmanager2.png"
              alt="Password Manager Project"
            />
          </div>
        </a>
      </Container>
    </div>
  );
};

export default Project;
