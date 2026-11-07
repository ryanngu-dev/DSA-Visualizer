# DSA Visualizer

**An interactive, step-by-step visualizer for the data structures and algorithms taught in CS24.**

[**Live Demo →**](https://dsa-visualizer-one-rho.vercel.app/)

Learning data structures from slides and static diagrams can be tough. DSA Visualizer lets you run operations yourself and watch exactly what happens at each step: which node is visited, which pointer moves, which line of pseudocode is running. It was built to give CS24 students the hands-on, visual intuition that's hard to get from lectures alone.

---

## Features

### Supported data structures & algorithms

| Structure | Operations |
|---|---|
| **Linked List** | Create from values, insert at head / tail / index, remove by index or value, search |
| **Binary Search Tree** | Create, insert, search, remove, and pre-order / in-order / post-order traversal |
| **Binary Heap** | Min-heap or max-heap mode; insert (sift up), extract root (sift down), delete by value |
| **Stack** | Create, push, pop, peek, clear |
| **Queue** | Create, enqueue, dequeue, peek, clear |
| **Hash Map** | Create, insert, search, remove using a modulo hash function with separate chaining for collisions |
| **Graph Traversal** | Breadth-first search (BFS) and depth-first search (DFS) on a random connected graph or one you build from your own edges, with the live queue/stack and visit order shown at every step |

### Learning tools

- **Step-by-step playback**: move forward and backward through every operation, or let it auto-play.
- **Synced pseudocode**: the line of pseudocode that matches the current step is highlighted, so you can connect the code to what's happening visually.
- **Step explanations**: each step comes with a short message describing what the algorithm is doing and why.
- **Smooth animations**: nodes, pointers, and elements animate into place so changes are easy to follow.
- **Light / Dark / System themes**.

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** for development and builds
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- Deployed on **Vercel**

---

## Run Locally

```bash
git clone https://github.com/ryanngu-dev/DSA-Visualizer.git
cd DSA-Visualizer
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

### Other scripts

| Command | What it does |
|---|---|
| `npm run build` | Production build (output in `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |
| `npm run lint` | Lint the project with ESLint |

---

## Project Structure

```
src/
├── components/         # Shared UI: layout, canvas, theme menu, controls
├── hooks/              # Visualization state per structure (steps, playback)
├── data-structures/
│   ├── linked-list/
│   ├── binary-search-tree/
│   ├── binary-heap/
│   ├── stack/
│   ├── queue/
│   ├── hash-map/
│   └── graph-traversal/
└── types/              # Shared types
```

Each data structure folder follows the same pattern:

- **Model** (e.g. `BinarySearchTree.ts`): the actual data structure logic
- **`types.ts`**: the operations and step types
- **`stepGenerators.ts`**: turns an operation into a list of visual steps
- **`pseudocode.ts`**: the pseudocode shown alongside the visualization
- **View, control panel, and pseudocode panel components**: the UI

---

## Adding a New Data Structure

1. Create a new folder under `src/data-structures/` (e.g. `avl-tree/`).
2. Implement the model, step types, step generators, and pseudocode.
3. Build the view, control panel, and pseudocode panel components.
4. Add a visualization hook in `src/hooks/` if needed.
5. Register it in the navigation in `src/App.tsx`.

---

## Roadmap

New topics will be added as the CS24 curriculum evolves. Ideas and suggestions are welcome; feel free to open an issue.

---

## Author

Built by [@ryanngu-dev](https://github.com/ryanngu-dev).
