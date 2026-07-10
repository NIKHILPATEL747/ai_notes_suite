import React, { useState } from "react";
import { Eye, EyeOff, Lightbulb, CheckSquare } from "lucide-react";
import { CornellNotes } from "../types";

interface CornellNotesViewProps {
  cornellData: CornellNotes;
}

export default function CornellNotesView({ cornellData }: CornellNotesViewProps) {
  const [activeHoverIdx, setActiveHoverIdx] = useState<number | null>(null);
  const [isSelfTestMode, setIsSelfTestMode] = useState(false);
  const [revealedNotes, setRevealedNotes] = useState<Record<number, boolean>>({});

  const toggleRevealNote = (idx: number) => {
    setRevealedNotes((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleToggleSelfTest = () => {
    setIsSelfTestMode(!isSelfTestMode);
    // Reset individual reveals when changing modes
    setRevealedNotes({});
  };

  return (
    <div className="space-y-6">
      {/* Intro Header and Self-test controllers */}
      <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-md font-bold text-white flex items-center gap-2">
            📊 The Cornell Notes Method
          </h4>
          <p className="text-xs text-gray-400 max-w-xl">
            A premium study layout that divides notes into a Left column for questions and cues, a Right column for answers, and a Bottom section for summary. Ideal for efficient review.
          </p>
        </div>

        <button
          onClick={handleToggleSelfTest}
          className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer ${
            isSelfTestMode
              ? "bg-amber-600 text-white hover:bg-amber-500 shadow-amber-500/10"
              : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/10"
          }`}
        >
          {isSelfTestMode ? (
            <>
              <Eye className="w-4 h-4" /> Stop Active Recall
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4" /> Start Active Recall (Hide Answers)
            </>
          )}
        </button>
      </div>

      {/* Main Cornell Split Sheet */}
      <div className="bg-[#0D0D0D] border-2 border-white/5 rounded-2xl shadow-sm overflow-hidden font-sans">
        
        {/* Header Ribbon of the sheet */}
        <div className="bg-[#1A1A1A] border-b border-white/10 px-6 py-3 flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
          <span>Cue Column (Recall Triggers)</span>
          <span>Notes Column (Core Explanations)</span>
        </div>

        {/* The double column area */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x-2 divide-white/10">
          
          {/* Cue Column: Left side (1/3 width) */}
          <div className="md:col-span-1 bg-[#141414] p-5 space-y-4">
            <div className="text-xs font-bold text-indigo-400 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
              <Lightbulb className="w-3.5 h-3.5" /> Questions & Cues
            </div>
            
            {cornellData.cueColumn.map((cue: string, idx: number) => {
              const isHovered = activeHoverIdx === idx;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveHoverIdx(idx)}
                  onMouseLeave={() => setActiveHoverIdx(null)}
                  className={`p-4 rounded-xl border text-sm font-semibold transition-all cursor-default ${
                    isHovered
                      ? "bg-indigo-500/10 border-indigo-500/30 text-white shadow-sm"
                      : "bg-[#1A1A1A] border-white/5 text-gray-200"
                  }`}
                >
                  <span className="text-xs font-bold text-indigo-400/80 block mb-1">
                    CUE {idx + 1}
                  </span>
                  {cue}
                </div>
              );
            })}
          </div>

          {/* Notes Column: Right side (2/3 width) */}
          <div className="md:col-span-2 p-5 space-y-4 bg-[#141414]">
            <div className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
              <CheckSquare className="w-3.5 h-3.5" /> Detailed Explanations
            </div>

            {cornellData.notesColumn.map((note: string, idx: number) => {
              const isCueHovered = activeHoverIdx === idx;
              const isRevealed = revealedNotes[idx];
              const blurNote = isSelfTestMode && !isRevealed;

              return (
                <div
                  key={idx}
                  onClick={() => blurNote && toggleRevealNote(idx)}
                  onMouseEnter={() => setActiveHoverIdx(idx)}
                  onMouseLeave={() => setActiveHoverIdx(null)}
                  className={`p-4 rounded-xl border text-sm transition-all leading-relaxed ${
                    isCueHovered 
                      ? "bg-indigo-500/5 border-indigo-500/20 text-white" 
                      : "bg-[#1A1A1A] border-white/5 text-gray-300"
                  } ${blurNote ? "cursor-pointer hover:bg-amber-500/5" : ""}`}
                >
                  <span className="text-xs font-bold text-gray-500 block mb-1">
                    EXPLANATION {idx + 1}
                  </span>

                  {blurNote ? (
                    <div className="flex items-center justify-between py-1">
                      <span className="text-gray-600 select-none filter blur-[5px] font-mono">
                        ####################################################
                      </span>
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 animate-pulse">
                        Click to Reveal Answer
                      </span>
                    </div>
                  ) : (
                    <div>
                      {note}
                      {isSelfTestMode && isRevealed && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRevealNote(idx);
                          }}
                          className="mt-2 text-xs font-medium text-amber-400 hover:text-amber-300 cursor-pointer"
                        >
                          Hide again
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Summary Block: Bottom section (Full width) */}
        <div className="bg-[#1A1A1A] border-t-2 border-white/10 p-6">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Summary Section (Main takeaways & Synthesis)
          </div>
          <div className="bg-[#141414] rounded-xl border border-white/5 p-4 text-sm text-gray-200 leading-relaxed font-sans shadow-inner">
            {cornellData.summaryColumn}
          </div>
        </div>

      </div>
    </div>
  );
}
