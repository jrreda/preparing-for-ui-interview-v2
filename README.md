# Prepare for UI Interview V2

This is repo is for the [Interviewing for Frontend Engineers, v2 course on Frontend Masters](https://frontendmasters.com/courses/interviewing-frontend-v2/). 

Here you will find problems that we solve together on the course along with additional materials and reference solutions for DOM API Based / React based challenges.

## 🎓 Course Structure

The course is divided into multiple sections, and with each section, we will gradually increase the difficulty.

### 1. Classic JavaScript Problems

This section serves as a warm-up. We will start with short (5–10 minute) problems that provide an overview of common JavaScript utilities and patterns frequently tested in interviews.

### 2. Practical UI Problems

Here, we will get our hands dirty and implement real UI patterns, components, and parts of applications.
We will actively use **HTML**, **CSS**, **TypeScript**, and **React**.

Each problem will have:

- A vanilla (framework-free) solution
- A React-based solution

During the workshop, we will intentionally switch between vanilla JavaScript and React to strengthen both skill sets.
I strongly advise you to **disable** all AI assistance and practice the problems on your own. The goal of this section is to acquire all the necessary skills to solve UI component problems using both React and Vanilla approaches.

### 3. TypeScript Problems

Finally, we will cover essential TypeScript type-level programming—the kind often asked in senior and staff-level frontend interviews. This is often called "type programming". You can even code the Doom game in TypeScript types! But, luckily for us, we won't get that deep :)

## 🧠 Problem Difficulty

The problems in this workshop are intentionally **slightly** harder than real interview questions.
The idea is simple: **If you train on harder problems, real interviews will feel calmer and more manageable.**

Problems are grouped into the following difficulty levels:

### 🧘 Warm-up

- Very basic problems that you should solve quickly.
- **Expected time**: 2–4 minutes.

### 🟢 Easy

- Small 5–10 minute problems.
- Some companies may give 3–4 easy problems in a 45-minute screening interview.

### 🟡 Medium

- 15–20 minute problems.
- The majority of frontend interview questions fall into this category.

### 🔴 Hard

- 45+ minute problems that require practice and familiarity with specific browser APIs.
- During the workshop, we will aim to solve them in 20–25 minutes to save time, but in real interviews, you would typically spend 45–60 minutes.
- **Examples**:
  - Observer APIs
  - Drag & Drop
  - Event handling

### 🚀 Extreme

- 1–2 hour end-to-end problems.
- These usually involve building a minimal version of a real product feature from scratch.
- You may be provided with a mock server or API, and the focus shifts heavily toward architecture and structure.
- **Examples**:
  - Figma-like canvas
  - Google Sheets–style grid
  - To-do application
  - Chat application (e.g., ChatGPT-like UI)

## 🚀 Running Instructions

This project uses **[pnpm](https://pnpm.io/)** as the package manager, Vite for the dev server, and Vitest for tests.

### Prerequisites

- Install pnpm: [https://pnpm.io/installation](https://pnpm.io/installation)

### Commands

**Install Dependencies:**

```bash
pnpm install
```

**Run Development Server:**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

**Run Tests:**

```bash
pnpm test
```

**Type Check:**

```bash
pnpm exec tsc --noEmit
```

## 📚 Table of Contents

You can find the list of problems and solutions here. During the workshop, we'll solve each problem
either in React or Vanilla TS, but this repo contains both solutions for reference :)

### 1. Vanilla JS / DOM API

Low-level DOM manipulation tasks and vanilla JavaScript implementations of common UI patterns.

| #   | Problem         | Difficulty | Concepts                                                | Links                                     |
| --- | --------------- | ---------- | ------------------------------------------------------- | ----------------------------------------- |
| 1   | **Detect Type** | 🟢 Easy    | `typeof`, `instanceof`, `Object.prototype.toString`     | [Solution](./src/problems/01-detect-type) |
| 2   | **Debounce**    | 🟢 Easy    | Closures, `setTimeout`, Higher-order Functions          | [Solution](./src/problems/02-debounce)    |
| 3   | **Throttle**    | 🟢 Easy    | Closures, Time-based Logic, Rate Limiting               | [Solution](./src/problems/05-throttle)    |
| 4   | **ES5 Extends** | 🟡 Medium  | Prototypal Inheritance, `prototype` chain, `call/apply` | [Solution](./src/problems/06-es5-extends) |
| 5   | **Deep Equals** | 🟡 Medium  | Recursion, Type Checking, Object Traversal              | [Solution](./src/problems/09-deep-equals) |
| 6   | **Deep Clone**  | 🟡 Medium  | Recursion, Circular References, `WeakMap`               | [Solution](./src/problems/10-deep-clone)  |
| 7   | **Stringify**   | 🟡 Medium  | Recursion, JSON Spec, Edge Cases                        | [Solution](./src/problems/13-stringify)   |
| 8   | **Promise**     | 🔴 Hard    | Asynchrony, Microtasks, State Machine                   | [Solution](./src/problems/14-promise)     |
| 9   | **Tree Select** | 🔴 Hard    | DOM Traversal, Event Bubbling / Delegation              | [Solution](./src/problems/17-tree-select) |

### 2. UI Components

Reusable UI components and widgets implemented in both React and Vanilla TypeScript.

| #   | Component                        | Difficulty | Concepts                                    | Links                                                    |
| --- | -------------------------------- | ---------- | ------------------------------------------- | -------------------------------------------------------- |
| 1   | **Accordion**                    | 🟢 Easy    | State Management, Compound Components       | [Solution](./src/problems/21-accordion)                  |
| 2   | **Star Rating**                  | 🟢 Easy    | State, Hover Effects, Array Rendering       | [Solution](./src/problems/22-star-rating)                |
| 3   | **Tabs**                         | 🟢 Easy    | State, Composition, Accessibility           | [Solution](./src/problems/25-tabs)                       |
| 4   | **Dialog**                       | 🟢 Easy    | HTMLDialogElement, Ref, Portals             | [Solution](./src/problems/26-dialog)                     |
| 5   | **Tooltip**                      | 🟢 Easy    | Portals, Refs, Coordinate Math              | [Solution](./src/problems/29-tooltip)                    |
| 6   | **Table**                        | 🟡 Medium  | Array Manipulation, Sorting/Filtering       | [Solution](./src/problems/30-table)                      |
| 7   | **Reddit Thread**                | 🟡 Medium  | Recursion, Data Normalization               | [Solution](./src/problems/33-reddit-thread)              |
| 8   | **Gallery**                      | 🟡 Medium  | Image Loading, Modal/Overlay                | [Solution](./src/problems/34-gallery)                    |
| 9   | **Nested Checkboxes**            | 🔴 Hard    | Recursion, Tree Data, Derived State         | [Solution](./src/problems/37-nested-checkboxes)          |
| 10  | **Toast**                        | 🔴 Hard    | React Context, Timers, Portals              | [Solution](./src/problems/38-toast)                      |
| 11  | **Calculator**                   | 🔴 Hard    | String Parsing, State Machine               | [Solution](./src/problems/41-calculator)                 |
| 12  | **Square Game**                  | 🔴 Hard    | Grid Rendering, Game State                  | [Solution](./src/problems/42-square-game)                |
| 13  | **Typeahead**                    | 🔴 Hard    | Debouncing, Async Data, Keyboard Nav        | [Solution](./src/problems/45-typeahead)                  |
| 14  | **Progress Bar**                 | 🔴 Hard    | CSS Transitions, Props Control              | [Solution](./src/problems/46-progress-bar)               |
| 15  | **File Upload Hook**             | 🔴 Hard    | XMLHttpRequest, Progress Tracking           | [Solution](./src/problems/49-use-file-upload)            |
| 16  | **Upload Component**             | 🔴 Hard    | Drag & Drop API, File API                   | [Solution](./src/problems/50-upload-component)           |
| 17  | **Portfolio Visualizer (UX)**    | 🚀 Extreme | Data Visualization, Event Delegation        | [Solution](./src/problems/53-portfolio-visualizer-ux)    |
| 18  | **Portfolio Visualizer (Logic)** | 🚀 Extreme | Tree Flattening, State Management           | [Solution](./src/problems/54-portfolio-visualizer-logic) |
| 19  | **Markdown Editor**              | 🚀 Extreme | Text Processing, Regex, Syntax Highlighting | [Solution](./src/problems/55-markdown)                   |
| 20  | **GPT Chat Interface**           | 🚀 Extreme | Streaming Responses, Auto-scroll            | [Solution](./src/problems/56-gpt-chat)                   |
| 21  | **GS: Basic**                    | 🟡 Medium  | Map, Setup, Getters                         | [Solution](./src/problems/57-google-sheet-basic)         |
| 22  | **GS: Compile**                  | 🟡 Medium  | Tokenizer, RPN, AST Compile                 | [Solution](./src/problems/58-google-sheet-compile)       |
| 23  | **GS: Topo Sort**                | 🔴 Hard    | Topological Sort, Cycle Detection           | [Solution](./src/problems/59-google-sheet-topo)          |
| 24  | **GS: Eval**                     | 🔴 Hard    | RPN Evaluation, basic formula               | [Solution](./src/problems/60-google-sheet-eval)          |
| 25  | **GS: Recompute**                | 🚀 Extreme | Graph Dependency, Full Engine               | [Solution](./src/problems/61-google-sheet-recompute)     |
| 26  | **GS: UX**                       | 🚀 Extreme | Virtual Grid, Cell Editing, Formatting      | [Solution](./src/problems/62-google-sheet-ux)            |

### 3. TypeScript Challenges

TypeScript type challenges are **interleaved throughout the course** alongside the JavaScript and Component problems. After every 2 core problems, you'll find 2 TypeScript type challenges to practice type-level programming. Look for folders with the `-challenge-` suffix in `src/problems/` (e.g., `03-tuple-length-challenge-1`).

The challenges cover topics including: Basics, Mapped Types, Conditional Types, Infer, Template Literals, Recursive Types, Distributive Conditionals, Advanced Patterns, and Expert Techniques.

---

## 🙏 Credits

Some problems in this course are inspired by or adapted from the following open-source resources:

- **[BFE.dev](https://bfe.dev/)** — A platform for frontend interview preparation with a great collection of JavaScript and UI coding challenges.
- **[type-challenges](https://github.com/type-challenges/type-challenges)** — A collection of TypeScript type challenges by Anthony Fu. Our TypeScript challenges are based on problems from this repository.

---

_Found an issue or want to contribute? Feel free to open a PR!_
