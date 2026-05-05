# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Create the Vite React shell

```code
npm create vite@latest bcde211-week08-react-starter -- --template react
cd bcde211-week08-react-starter
npm install
npm run dev
```

## Folder structure

This is a pretty standard Vite + React starter structure, just with a bit of custom organization added. Here’s how to understand it without getting lost in the tree.

### Top-level files (project config)

These control how your project runs and builds:

- **`.gitignore`** – tells Git what *not* to track (e.g. `node_modules`)
- **`package.json` / `package-lock.json`** – dependencies + scripts (`npm run dev`, etc.)
- **`vite.config.js`** – Vite configuration (dev server, plugins)
- **`eslint.config.js`** – linting rules (code quality)
- **`index.html`** – the single HTML page React mounts into
- **`README.md`** – project info/instructions

---

#### `public/` (static files)

Files here are served *as-is*:

- `favicon.svg` – browser tab icon  
- `icons.svg` – reusable SVG icons  

These are not processed by React or Vite—just delivered directly.

---

#### `src/` (your actual app)

This is where all your React code lives.

##### Core entry files

- **`main.jsx`**  
  Entry point. It renders your React app into `index.html`.

- **`App.jsx`**  
  The root component. Think of this as the “main layout” of your app.

- **`App.css` / `index.css`**  
  Styling (component-level and global styles)

---

#### `assets/` (images used in code)

- `hero.png`, `react.svg`, `vite.svg`  

These are imported into components like:

```js
import hero from './assets/hero.png'
```

Unlike `public/`, these go through the build system.

---

#### `components/` (reusable UI pieces)

Each file is a React component:

- PageHeader.jsx – top section of the page
- FooterNote.jsx – footer area
- TodoCard.jsx – displays a single todo
- TodoListSection.jsx – displays a list of todos

This is where most UI logic lives.

---

#### `data/` (mock or static data)

- mockTodos.js

  Likely contains sample todo items, e.g.:

```js
export const mockTodos = [
  {
    id: 'todo-001',
    title: 'Finish JSX repair exercise',
    dueDate: '2026-04-28',
    priority: 'High',
    category: 'Study',
    completed: false
  },
  {
    id: 'todo-002',
    title: 'Refactor TodoCard component',
    dueDate: '2026-04-29',
    priority: 'Medium',
    category: 'Coding',
    completed: true
  }
]
```

Useful for development before connecting to a backend.

#### How it all connects

1. `index.html` loads  
2. `main.jsx` mounts React into the page  
3. `App.jsx` becomes the root UI  
4. `App.jsx` imports components like:
   - `PageHeader`
   - `TodoListSection`  
5. Components may use:
   - images from `assets/`
   - data from `data/mockTodos.js`

---

#### Mental model

Think of it like this:

- Top level → project setup  
- `public/` → static files  
- `src/` → your app  
  - `components/` → UI building blocks  
  - `data/` → fake data  
  - `assets/` → images  
