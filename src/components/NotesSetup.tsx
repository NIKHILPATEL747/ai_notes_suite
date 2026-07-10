import React, { useState, useEffect } from "react";
import { BookOpen, Sparkles, Brain, GraduationCap, ChevronRight, GraduationCap as GradIcon, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NotesSetupProps {
  onGenerate: (topic: string, subject: string, gradeLevel: string, style: string) => Promise<void>;
  isLoading: boolean;
  onSelectSample: (sampleId: string) => void;
  samples: Array<{ id: string; title: string; subject: string; gradeLevel: string }>;
}

const SUBJECT_PRESETS = [
  { name: "Biology", icon: "🔬", color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-200/50" },
  { name: "World History", icon: "🏛️", color: "from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-200/50" },
  { name: "Calculus", icon: "📐", color: "from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-200/50" },
  { name: "Chemistry", icon: "🧪", color: "from-indigo-500/10 to-purple-500/10 text-indigo-600 border-indigo-200/50" },
  { name: "Literature", icon: "✍️", color: "from-rose-500/10 to-pink-500/10 text-rose-600 border-rose-200/50" },
  { name: "Comp Science", icon: "💻", color: "from-cyan-500/10 to-blue-500/10 text-cyan-600 border-cyan-200/50" },
];

const GRADE_LEVELS = ["Middle School", "High School", "College", "Postgraduate"];

const STUDY_STYLES = [
  { name: "Comprehensive Study Guide", desc: "Detailed explanations, sections, and structural review notes." },
  { name: "Q&A / Active Recall", desc: "Focuses heavily on questions, vocabulary terms, and split-page formats." },
  { name: "Summary & Highlights", desc: "Shortened high-level briefings with concise bullet point takeaways." },
];

const LOADING_STEPS = [
  "Reading your topic and inputs...",
  "Extracting core terminology and vocabulary words...",
  "Structuring deep sectional guide prose and highlights...",
  "Drafting Cornell split-column question lists...",
  "Constructing active recall flashcards...",
  "Generating 5 practice quiz questions and academic explanations...",
  "Plotting hierarchical coordinate links for the visual mind map...",
];

export default function NotesSetup({ onGenerate, isLoading, onSelectSample, samples }: NotesSetupProps) {
  const [topic, setTopic] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Biology");
  const [customSubject, setCustomSubject] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("High School");
  const [selectedStyle, setSelectedStyle] = useState("Comprehensive Study Guide");
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setLoadingStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    const finalSubject = selectedSubject === "Custom" ? customSubject || "General" : selectedSubject;
    onGenerate(topic, finalSubject, selectedGrade, selectedStyle);
  };

  const loadSamplePrompt = (subject: string) => {
    if (subject === "Biology") {
      setTopic("Photosynthesis. Explain how chloroplasts, chlorophyll, light-dependent reactions (Photosystems I and II, water splitting, ATP synthase), and the Calvin Cycle (carbon fixation via RuBisCO, G3P synthesis, and RuBP regeneration) generate energy for green plants.");
      setSelectedSubject("Biology");
    } else if (subject === "World History") {
      setTopic("The French Revolution. Discuss the causes of the revolution in 1789 (deficit spending, Three Estates system, food shortages), major turning points like the Tennis Court Oath and the storming of the Bastille, and the radicalization under Maximilien Robespierre (Committee of Public Safety and Reign of Terror) ending with the rise of Napoleon.");
      setSelectedSubject("World History");
    } else {
      setTopic("Single-variable calculus derivatives. Explain limits, the definition of the derivative, basic rules (power rule, product rule, quotient rule, chain rule), and local extrema optimization using first and second derivative tests.");
      setSelectedSubject("Calculus");
    }
  };

  return (
    <div id="notes-setup-container" className="max-w-4xl mx-auto py-6 px-4">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="bg-[#141414] rounded-3xl border border-white/5 shadow-xl p-12 text-center min-h-[500px] flex flex-col justify-center items-center"
          >
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full border-4 border-white/5 border-t-indigo-500 animate-spin flex items-center justify-center"></div>
              <Brain className="w-10 h-10 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
            </div>

            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-semibold text-white tracking-tight mb-2"
            >
              Generating AI Study Materials
            </motion.h3>
            
            <div className="h-8 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingStepIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="text-indigo-400 font-medium text-lg"
                >
                  {LOADING_STEPS[loadingStepIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            <p className="text-gray-400 text-sm mt-8 max-w-sm">
              Our academic tutor is preparing rich narrative notes, Cornell summaries, flashcards, a structured quiz, and a spatial concept map. This takes about 10-15 seconds!
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="setup-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Header Display */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Study Smarter, Not Harder
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
                AI Notes Generator
              </h1>
              <p className="text-gray-400 max-w-xl mx-auto">
                Transform any topic, transcript, study questions, or lectures into interactive, beautifully organized notes, Cornell sheets, flashcards, quizzes, and mind maps.
              </p>
            </div>

            {/* Quick-start samples row */}
            <div className="bg-[#141414] rounded-2xl border border-white/5 p-6">
              <h2 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" /> Explore Interactive Notes Instantaneously (Saved Samples)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {samples.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => onSelectSample(sample.id)}
                    className="flex flex-col text-left p-4 bg-[#1A1A1A] border border-white/5 rounded-xl hover:border-indigo-500/50 hover:shadow-sm transition-all group"
                  >
                    <span className="text-xs font-medium text-indigo-400 mb-1">
                      {sample.subject} • {sample.gradeLevel}
                    </span>
                    <span className="font-semibold text-white text-sm line-clamp-1 group-hover:text-indigo-400 transition-colors">
                      {sample.title}
                    </span>
                    <span className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      Start studying <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main setup form */}
            <form onSubmit={handleSubmit} className="bg-[#141414] rounded-3xl border border-white/5 shadow-md p-8 space-y-6">
              {/* Subject Selector */}
              <div>
                <label className="block text-sm font-bold text-gray-200 mb-3">
                  Select Subject Area
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SUBJECT_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setSelectedSubject(preset.name);
                        loadSamplePrompt(preset.name);
                      }}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left ${
                        selectedSubject === preset.name
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/20"
                          : `bg-[#1A1A1A] hover:bg-white/5 border-white/5 text-gray-300 hover:text-white`
                      }`}
                    >
                      <span className="text-lg">{preset.icon}</span>
                      <span className="truncate">{preset.name}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSelectedSubject("Custom")}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left ${
                      selectedSubject === "Custom"
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/20"
                        : "bg-[#1A1A1A] hover:bg-white/5 border-white/5 text-gray-300 hover:text-white"
                    }`}
                  >
                    <span className="text-lg">⚙️</span>
                    <span>Custom / Other</span>
                  </button>
                </div>

                {selectedSubject === "Custom" && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3"
                  >
                    <input
                      type="text"
                      placeholder="Type custom subject (e.g. Psychology, Macroeconomics...)"
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#1A1A1A] text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </motion.div>
                )}
              </div>

              {/* Flex row for Grade Level and Study Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Grade Level */}
                <div>
                  <label className="block text-sm font-bold text-gray-200 mb-2">
                    Target Academic Level
                  </label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#1A1A1A] text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                  >
                    {GRADE_LEVELS.map((level) => (
                      <option key={level} value={level} className="bg-[#1A1A1A] text-white">
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Study Style */}
                <div>
                  <label className="block text-sm font-bold text-[#e2e8f0] mb-2">
                    Primary Notes Formatting Focus
                  </label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#1A1A1A] text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                  >
                    {STUDY_STYLES.map((style) => (
                      <option key={style.name} value={style.name} className="bg-[#1A1A1A] text-white">
                        {style.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Main Topic Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-[#e2e8f0]">
                    Topic Keywords, Lectures, or Syllabus
                  </label>
                  <button
                    type="button"
                    onClick={() => loadSamplePrompt(selectedSubject)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" /> Auto-fill {selectedSubject} Template
                  </button>
                </div>
                <textarea
                  required
                  rows={6}
                  placeholder="Paste lecture transcript, class notes, textbook paragraphs, or simply type a specific topic you want to generate comprehensive study material for..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-[#1A1A1A] text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans placeholder-gray-500 shadow-inner"
                />
                <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-gray-500" /> Pro-tip: Copier-pasting raw transcripts yields incredibly precise custom notes.
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!topic.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#1A1A1A] disabled:text-gray-600 disabled:border-white/5 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-2xl shadow-md hover:shadow-lg hover:shadow-indigo-500/10 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                <Sparkles className="w-5 h-5 animate-pulse" /> Create Comprehensive Study Suite
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
