import React, { useState, useEffect } from "react";
import { 
  Sparkles, BookOpen, Brain, HelpCircle, GraduationCap, Calendar, 
  Trash2, Star, Plus, Search, FileDown, ClipboardCheck, ArrowLeft, 
  Menu, X, CheckSquare, Layers, HelpCircle as HelpIcon, Printer, Clipboard
} from "lucide-react";

import { NoteSession, Flashcard, QuizQuestion } from "./types";
import { SAMPLE_NOTE_SESSIONS } from "./sampleNotes";
import NotesSetup from "./components/NotesSetup";
import StudyGuideView from "./components/StudyGuideView";
import CornellNotesView from "./components/CornellNotesView";
import FlashcardsView from "./components/FlashcardsView";
import QuizView from "./components/QuizView";
import MindMapView from "./components/MindMapView";

export default function App() {
  const [sessions, setSessions] = useState<NoteSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<"study" | "cornell" | "flashcards" | "quiz" | "mindmap">("study");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [quizHighScores, setQuizHighScores] = useState<Record<string, number>>({});

  // 1. Load Sessions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ai_notes_sessions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
        } else {
          loadDefaultSamples();
        }
      } catch (e) {
        loadDefaultSamples();
      }
    } else {
      loadDefaultSamples();
    }

    // Load Highscores
    const savedScores = localStorage.getItem("ai_notes_highscores");
    if (savedScores) {
      try {
        setQuizHighScores(JSON.parse(savedScores));
      } catch (e) {}
    }
  }, []);

  const loadDefaultSamples = () => {
    setSessions(SAMPLE_NOTE_SESSIONS);
    setActiveSessionId(SAMPLE_NOTE_SESSIONS[0].id);
    localStorage.setItem("ai_notes_sessions", JSON.stringify(SAMPLE_NOTE_SESSIONS));
  };

  // Helper to persist sessions
  const saveSessionsToStorage = (updated: NoteSession[]) => {
    setSessions(updated);
    localStorage.setItem("ai_notes_sessions", JSON.stringify(updated));
  };

  const handleCreateNewClick = () => {
    setIsCreating(true);
    setActiveSessionId(null);
    setSidebarOpen(false);
    setApiError(null);
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    setIsCreating(false);
    setSidebarOpen(false);
    setApiError(null);
    setActiveTab("study");
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm("Are you sure you want to delete these study notes?");
    if (!confirmed) return;

    const filtered = sessions.filter((s) => s.id !== id);
    saveSessionsToStorage(filtered);

    if (activeSessionId === id) {
      if (filtered.length > 0) {
        setActiveSessionId(filtered[0].id);
      } else {
        setActiveSessionId(null);
        setIsCreating(true);
      }
    }
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.map((s) => {
      if (s.id === id) {
        return { ...s, favorite: !s.favorite };
      }
      return s;
    });
    saveSessionsToStorage(updated);
  };

  // 2. Generate Notes API Request
  const handleGenerateNotes = async (topic: string, subject: string, gradeLevel: string, style: string) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch("/api/generate-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, subject, gradeLevel, style }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to generate study suite.");
      }

      const generatedData = result.data;

      // Map UUID or mock id
      const newSession: NoteSession = {
        id: `session-${Date.now()}`,
        title: generatedData.title || `Notes on ${subject}`,
        subject: subject,
        gradeLevel: gradeLevel,
        style: style,
        summary: generatedData.summary,
        sections: generatedData.sections,
        keyConcepts: generatedData.keyConcepts,
        cornellNotes: generatedData.cornellNotes,
        // Map flashcards & quiz questions with clean generated unique IDs
        flashcards: (generatedData.flashcards || []).map((fc: any, i: number) => ({
          ...fc,
          id: `fc-${Date.now()}-${i}`,
          mastered: false,
        })),
        quiz: (generatedData.quiz || []).map((q: any, i: number) => ({
          ...q,
          id: `q-${Date.now()}-${i}`,
        })),
        mindMapNodes: (generatedData.mindMapNodes || []).map((n: any, i: number) => ({
          ...n,
          parentId: n.parentId === "root" || n.parentId === "null" || !n.parentId ? null : n.parentId,
        })),
        createdAt: new Date().toISOString(),
      };

      const updatedSessions = [newSession, ...sessions];
      saveSessionsToStorage(updatedSessions);
      setActiveSessionId(newSession.id);
      setIsCreating(false);
      setActiveTab("study");
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Could not connect to the Gemini AI server. Please verify your internet connection and API configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Update Study Notes from inline changes
  const handleUpdateNotes = (updatedSession: NoteSession) => {
    const updated = sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s));
    saveSessionsToStorage(updated);
  };

  // High score manager
  const handleUpdateHighScore = (newScore: number) => {
    if (!activeSessionId) return;
    const scores = { ...quizHighScores, [activeSessionId]: newScore };
    setQuizHighScores(scores);
    localStorage.setItem("ai_notes_highscores", JSON.stringify(scores));
  };

  // 4. Copy Markdown Helper
  const handleCopyMarkdown = () => {
    if (!activeSession) return;
    
    let md = `# ${activeSession.title}\n`;
    md += `**Subject**: ${activeSession.subject} | **Grade Level**: ${activeSession.gradeLevel}\n\n`;
    md += `## Summary\n${activeSession.summary}\n\n`;
    
    md += `## Study Guide\n`;
    activeSession.sections.forEach((sec) => {
      md += `### ${sec.heading}\n${sec.content}\n\n`;
      sec.bulletPoints.forEach((pt) => {
        md += `- ${pt}\n`;
      });
      md += `\n`;
    });

    md += `## Key Vocabulary Concepts\n`;
    activeSession.keyConcepts.forEach((kc) => {
      md += `- **${kc.term}**: ${kc.definition}\n`;
    });

    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtering list
  const filteredSessions = sessions.filter((s) => {
    const query = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(query) ||
      s.subject.toLowerCase().includes(query) ||
      s.summary.toLowerCase().includes(query)
    );
  });

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  return (
    <div id="app-workspace" className="min-h-screen bg-[#0A0A0A] text-gray-200 flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <header className="bg-[#0D0D0D] border-b border-white/5 h-16 sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-500/10">
              <Brain className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-white tracking-tight text-lg">
              AI Notes Suite
            </span>
          </div>
        </div>

        {activeSession && !isCreating && (
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-2 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 bg-white/5 hover:bg-white/10 hover:text-white shadow-sm transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Copied Markdown
                </>
              ) : (
                <>
                  <Clipboard className="w-3.5 h-3.5" /> Copy Markdown
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 bg-white/5 hover:bg-white/10 hover:text-white shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print Guide
            </button>
          </div>
        )}
      </header>

      <div className="flex-1 flex relative">
        
        {/* Left Sidebar Drawer - Persistent on Desktop, overlay on Mobile */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-[#0F0F0F] border-r border-white/5 flex flex-col transition-transform duration-300 transform
          md:static md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          {/* Mobile Close Button */}
          <div className="h-16 border-b border-white/5 px-4 flex items-center justify-between md:hidden bg-[#0F0F0F]">
            <span className="font-bold text-white">Your Study Desk</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 border-b border-white/5 space-y-3 bg-[#0F0F0F]">
            <button
              onClick={handleCreateNewClick}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-indigo-500/15"
            >
              <Plus className="w-4 h-4" /> Create New Notes
            </button>

            <div className="relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search study guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-[#1A1A1A] text-white placeholder-gray-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">
              Your Study Guides ({filteredSessions.length})
            </h4>

            {filteredSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 px-4">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No matching notes found. Try generating a new set!</p>
              </div>
            ) : (
              filteredSessions.map((s) => {
                const isActive = activeSessionId === s.id && !isCreating;
                const score = quizHighScores[s.id] || 0;
                
                return (
                  <div
                    key={s.id}
                    onClick={() => handleSelectSession(s.id)}
                    className={`group flex items-start justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      isActive 
                        ? "bg-white/5 border border-white/10 text-white" 
                        : "hover:bg-white/5 border border-transparent text-gray-400"
                    }`}
                  >
                    <div className="space-y-1 flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider scale-90 origin-left border border-indigo-500/20">
                          {s.subject}
                        </span>
                        {score > 0 && (
                          <span className="text-[10px] text-emerald-400 font-bold">
                            Quiz: {score}/5
                          </span>
                        )}
                      </div>
                      
                      <h5 className={`font-bold text-xs truncate ${isActive ? "text-white" : "text-gray-300 group-hover:text-white"}`}>
                        {s.title}
                      </h5>
                      
                      <div className="flex items-center gap-1 text-[10px] text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleToggleFavorite(s.id, e)}
                        className={`p-1 rounded-lg hover:bg-white/10 cursor-pointer ${
                          s.favorite ? "text-amber-400" : "text-gray-500 hover:text-gray-300"
                        }`}
                        title="Favorite"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteSession(s.id, e)}
                        className="p-1 rounded-lg hover:bg-rose-500/10 text-gray-500 hover:text-rose-400 cursor-pointer"
                        title="Delete Notes"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick instructions/credits sidebar bottom footer */}
          <div className="p-4 border-t border-white/5 bg-[#0D0D0D] text-[10px] text-gray-500 space-y-1">
            <span className="font-bold text-gray-400 block">AI Study Desk</span>
            <span>Study suite fully compiled locally and utilizing modern Gemini LLM schemas.</span>
          </div>
        </aside>

        {/* Sidebar backdrop overlay on mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
          />
        )}

        {/* Main Learning Arena Panel */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0A0A0A]">
          
          {/* API Missing Keys Warning notification */}
          {apiError && (
            <div className="max-w-4xl mx-auto mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-200 rounded-2xl p-5 flex items-start gap-3.5 shadow-sm">
              <HelpIcon className="w-6 h-6 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <span className="font-bold text-rose-100 block">Gemini API Error</span>
                <p className="text-sm text-rose-300 leading-normal">
                  {apiError}
                </p>
                <div className="pt-2 text-xs text-rose-400 font-semibold space-x-4">
                  <span>1. Click the <b>Settings &gt; Secrets</b> panel.</span>
                  <span>2. Add <b>GEMINI_API_KEY</b>.</span>
                </div>
              </div>
              <button 
                onClick={() => setApiError(null)}
                className="text-rose-400 hover:text-rose-300 font-bold text-xs px-2 py-1 rounded hover:bg-rose-500/10"
              >
                Dismiss
              </button>
            </div>
          )}

          {isCreating || !activeSession ? (
            /* Setup Guide Panel */
            <NotesSetup
              onGenerate={handleGenerateNotes}
              isLoading={isLoading}
              onSelectSample={(id) => {
                handleSelectSession(id);
              }}
              samples={sessions.map((s) => ({
                id: s.id,
                title: s.title,
                subject: s.subject,
                gradeLevel: s.gradeLevel,
              }))}
            />
          ) : (
            /* Active Notes Suite and Interactive Tabs */
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Note Header Banner */}
              <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {activeSession.subject}
                    </span>
                    <span className="text-xs font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                      {activeSession.gradeLevel}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
                    {activeSession.title}
                  </h2>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={() => handleCreateNewClick()}
                    className="flex-1 md:flex-initial bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs shadow-sm flex items-center justify-center gap-1 cursor-pointer shadow-indigo-500/15"
                  >
                    <Plus className="w-3.5 h-3.5" /> New Guide
                  </button>

                  <button
                    onClick={(e) => handleToggleFavorite(activeSession.id, e)}
                    className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer ${
                      activeSession.favorite 
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-400" 
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                    title="Favorite Study Notes"
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>

              {/* Sub-navigation Tabs */}
              <div className="border-b border-white/5 flex overflow-x-auto select-none no-scrollbar gap-1 pt-1.5">
                {[
                  { id: "study", label: "📖 Study Guide" },
                  { id: "cornell", label: "📊 Cornell Notes" },
                  { id: "flashcards", label: "🗂️ Flashcards" },
                  { id: "quiz", label: "📝 Practice Quiz" },
                  { id: "mindmap", label: "🌿 Interactive Mind Map" },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-3 px-4.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                        isActive
                          ? "border-indigo-500 text-indigo-400"
                          : "border-transparent text-gray-400 hover:text-indigo-400 hover:border-white/10"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* TAB VIEWS */}
              <div className="pt-2 animate-fade-in">
                {activeTab === "study" && (
                  <StudyGuideView 
                    session={activeSession} 
                    onUpdateNotes={handleUpdateNotes} 
                  />
                )}

                {activeTab === "cornell" && (
                  <CornellNotesView 
                    cornellData={activeSession.cornellNotes} 
                  />
                )}

                {activeTab === "flashcards" && (
                  <FlashcardsView 
                    cards={activeSession.flashcards} 
                  />
                )}

                {activeTab === "quiz" && (
                  <QuizView 
                    quiz={activeSession.quiz} 
                    savedHighScore={quizHighScores[activeSession.id]} 
                    onUpdateHighScore={handleUpdateHighScore}
                  />
                )}

                {activeTab === "mindmap" && (
                  <MindMapView 
                    nodes={activeSession.mindMapNodes} 
                  />
                )}
              </div>

            </div>
          )}
        </main>

      </div>
    </div>
  );
}
