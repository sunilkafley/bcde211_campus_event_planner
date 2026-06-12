# Campus Event Planner

**BCDE211 Assessment 3**
**Author:** Sunil Kafley

## Overview

Campus Event Planner is a Progressive Web Application (PWA) developed using React, TypeScript, Vite, and IndexedDB.

The application allows users to create, edit, delete, search, sort, and manage campus events through a responsive web interface. Event data is stored locally using IndexedDB and the application supports installation and offline functionality through Progressive Web App technologies.

---

## Technology Stack

- React
- TypeScript
- Vite
- IndexedDB
- Vitest
- React Testing Library

---

## Vite React + TypeScript Setup

```bash
npm create vite@latest bcde211_campus_event_planner -- --template react-ts
cd bcde211_campus_event_planner
```

If converting an existing JS project:

```bash
npm install -D typescript @types/react @types/react-dom
```

If installing dependencies for an existing project with package-lock.json:

```bash
npm ci
```

## Installation

Install project dependencies:

```bash
npm install
```

---

## Running the Project

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

---

## Building the Project

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Testing

Run unit tests:

```bash
npm test
```

Run coverage:

```bash
npm run test:coverage
```

---

## Foundation and Implementation

- The project builds upon the architecture developed in first iteration
  Campus Event and Event Planner Domain Model, Repository Contract.
- The application uses IndexedDB for local data persistence.
- Event data is stored within the browser and does not require a backend server.
- PWA functionality is best tested using the production build:

```bash
npm run build
npm run preview
```

- The application includes:
  - Event CRUD operations
  - Search and sorting features
  - Statistics dashboard functionality
  - TypeScript implementation
  - Unit tests
  - Progressive Web App support

---

## Project Structure

```text
React Components
       ↓
Event Planner Service
       ↓
CampusEvent Model
       ↓
IndexedDB Repository
```

---

## Author

Sunil Kafley

BCDE211 Software Engineering

2026, Ara Institute of Canterbury
