# Data Structure & Algorithm Visualizer

An interactive web app for learning data structures and algorithms through step-by-step visualization.

## Live demo

- Deployed on Vercel: `https://dsa-visualizer-one-rho.vercel.app/`
- Source code: `https://github.com/ryanngu-dev/DSA-Visualizer`

## Features

- **Linked List** (current): Insert (at head, tail, or index), remove (by index or value), and search with step-by-step visualization.
- **Theme**: Light / Dark / System toggle.
- **Planned**: Binary search tree, graph traversals, and more.

## Run locally

```bash
git clone https://github.com/ryanngu-dev/DSA-Visualizer.git
cd DSA-Visualizer
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

Output is in `dist/`.

## Tech

- React 18, TypeScript, Vite
- Tailwind CSS, Framer Motion

## Adding another data structure

1. Add a new folder under `src/data-structures/` (e.g. `binary-search-tree/`).
2. Implement the model, step types, step generators, and a view component.
3. Register the new structure in the app nav and render its visualizer when selected.
