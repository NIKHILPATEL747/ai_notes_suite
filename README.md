# 🧠 AI Notes Suite: Interactive Study Companion

An elegant, full-stack, AI-powered study companion that transforms any topic, raw lecture transcripts, syllabus bullet-points, or book chapters into a comprehensive, beautifully structured interactive study suite. Designed with a gorgeous modern dark theme, smooth motion feedback, and robust spatial visualizations.

---

## ✨ Features

The application automatically partitions generated academic materials into five distinct study modes:

### 1. 📖 Modular Study Guide
- **Comprehensive Summary**: Deep narrative overviews of the input material.
- **Topic Sub-sections**: Auto-categorized sub-topics with clear, human-legible explanations.
- **Interactive Review Takeaways**: Checklists to tick off mastered concepts.
- **Custom Notepad**: Real-time persistent student notes and annotations saved to local storage.

### 2. 📊 Cornell Notes Sheet
- **Active Recall Layout**: Separated columns following the prestigious Cornell Method.
- **Cue Column**: Left-hand trigger questions and recall prompts.
- **Explanation Column**: Detailed answers paired directly with recall prompts.
- **Self-Test Mode**: Interactively blur/reveal answers with a single click to test your active memory.

### 3. 🗂️ 3D Flippable Flashcards
- **Tactile Learning**: Fully 3D flippable cards showing terms on the front and detailed definitions on the back.
- **Mastery Tracker**: Live progress bar indicating your percentage of memorization.
- **Review Loop**: Easily separate mastered concepts from items that still need review.

### 4. 📝 Practice Quiz
- **Multiple Choice**: Comprehensive interactive quiz generated specifically from your study material.
- **Immediate Explanation**: Explains *why* the correct answer is right as soon as you submit.
- **Grade & High Score**: Automatic scorecard calculation with persistent session high-score recording.

### 5. 🌿 Spatial Mind Map
- **Visual Topic Nodes**: Interactive node canvas displaying structural hierarchies of concepts.
- **Intuitive Zoom & Pan**: Easily inspect connection lines, zoom in/out, and drag the canvas to navigate.
- **Concept Detail Drawer**: Hover or click on nodes to reveal immediate explanations in an side panel.

---

## 🎨 Visual Identity & Theme

The app features a custom **Cosmic Slate Theme** meticulously crafted for eye comfort during long study sessions:
- **Dark Aesthetic**: Sleek deep obsidian (`#0A0A0A`) background paired with high-contrast neutral borders.
- **Tailored Typography**: Clean display headings using "Space Grotesk" or "Inter" paired with monospace metrics ("JetBrains Mono") for precise visual alignment.
- **Micro-Animations**: Staggered cards, fade-in transition layouts, and tactile button feedback using `motion` hooks.
- **Print Friendly**: Dedicated print layout styles to print out clean physical study guides with a single tap.

---

## ⚙️ Tech Stack & Architecture

- **Frontend**: React 18 with Vite and TypeScript.
- **Styling**: Tailwind CSS with custom theme variables.
- **Icons**: Clean vector indicators from `lucide-react`.
- **Backend**: Express custom server configured for high-throughput API routing and static asset proxying.
- **AI Integration**: Server-side Gemini API routing utilizing the modern `@google/genai` TypeScript SDK, ensuring API keys are kept secure and never exposed to the client.

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
First, clone the repository and install npm packages:
```bash
npm install
```

### 2. Set Up Environment Variables
Define your Gemini API key in a `.env` file at the root of your project:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
Start the Express + Vite server locally:
```bash
npm run dev
```
The server will boot and run on port **3000** (e.g. `http://localhost:3000`).

---

## 📂 Project Structure

```text
├── src/
│   ├── components/
│   │   ├── NotesSetup.tsx         # Academic input panel & sample loader
│   │   ├── StudyGuideView.tsx     # Narrative guides & checklists
│   │   ├── CornellNotesView.tsx   # Left/Right recall layout with Self-Test
│   │   ├── FlashcardsView.tsx     # Tactile 3D card flips & mastery tracking
│   │   ├── QuizView.tsx           # Practice tests & explanation drawers
│   │   └── MindMapView.tsx        # SVG-based interactive zoom/pan concept tree
│   ├── App.tsx                    # Main navigation workspace and session states
│   ├── types.ts                   # Strongly-typed TypeScript interfaces
│   └── main.tsx                   # Frontend entry point
├── server.ts                      # Custom Express server with Gemini API endpoint
└── package.json                   # Dependency manager and script definitions
```

---

*This study companion is fully responsive and supports offline state persistence inside your browser's local storage.*
