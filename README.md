# Data Structure & Algorithm Visualizer

A web app that visualizes data structures and algorithms step by step. Built to demonstrate understanding of DS&A and clean frontend architecture.

## Features

- **Linked List** (current): Insert (at head, tail, or index), remove (by index or value), and search with step-by-step visualization.
- **Planned**: Binary search tree, graph traversals, and more.

## Run locally

```bash
git clone <repo-url>
cd data-structure-visualizer
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

Output is in `dist/`. You can deploy to GitHub Pages, Vercel, or any static host.

## Tech

- React 18, TypeScript, Vite
- Tailwind CSS, Framer Motion

## Adding another data structure

1. Add a new folder under `src/data-structures/` (e.g. `binary-search-tree/`).
2. Implement the model, step types, step generators, and a view component.
3. Register the new structure in the app nav and render its visualizer when selected.
