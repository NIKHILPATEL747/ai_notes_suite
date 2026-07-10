import React, { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, CheckCircle, RefreshCw, Trophy, AlertCircle } from "lucide-react";
import { Flashcard } from "../types";

interface FlashcardsViewProps {
  cards: Flashcard[];
}

export default function FlashcardsView({ cards }: FlashcardsViewProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-12 bg-[#141414] rounded-2xl border border-white/5">
        <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-gray-400 font-medium">No flashcards available for this session.</p>
      </div>
    );
  }

  const activeCard = cards[currentIdx];
  const isMastered = masteredIds.has(activeCard.id);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIdx((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIdx((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const markMastery = (mastered: boolean) => {
    const newMastered = new Set(masteredIds);
    if (mastered) {
      newMastered.add(activeCard.id);
    } else {
      newMastered.delete(activeCard.id);
    }
    setMasteredIds(newMastered);
    // Auto advance after short delay if marking mastered
    if (mastered && cards.length > 1 && masteredIds.size < cards.length - 1) {
      setTimeout(() => {
        handleNext();
      }, 600);
    }
  };

  const resetAllMastery = () => {
    setMasteredIds(new Set());
    setCurrentIdx(0);
    setIsFlipped(false);
  };

  const percentMastered = Math.round((masteredIds.size / cards.length) * 100);
  const allMastered = masteredIds.size === cards.length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Progress Indicators */}
      <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Mastery Progress
          </span>
          <span className="text-sm font-extrabold text-white">
            {masteredIds.size} of {cards.length} Cards Mastered ({percentMastered}%)
          </span>
        </div>
        <button
          onClick={resetAllMastery}
          className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1 transition-colors bg-[#1A1A1A] px-2.5 py-1.5 rounded-lg border border-white/5 shadow-sm cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${percentMastered}%` }}
        />
      </div>

      {/* 3D Flashcard Container */}
      {allMastered ? (
        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-3xl p-12 text-center space-y-4 shadow-sm animate-fade-in">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Trophy className="w-10 h-10 text-emerald-400" />
          </div>
          <h4 className="text-2xl font-bold text-emerald-400">
            Perfect Score!
          </h4>
          <p className="text-emerald-300 text-sm max-w-sm mx-auto leading-relaxed">
            Congratulations! You have flipped, reviewed, and fully mastered every key concept in this study set. You are ready for your exams!
          </p>
          <button
            onClick={resetAllMastery}
            className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            Review Again
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Flip Card Visual */}
          <div 
            className="perspective-1000 h-80 w-full cursor-pointer group"
            onClick={handleFlip}
          >
            <div 
              className={`relative w-full h-full text-center transition-transform duration-500 transform-style-3d shadow-md hover:shadow-lg rounded-2xl border-2 ${
                isMastered ? "border-emerald-500/30" : "border-white/5"
              } ${isFlipped ? "rotate-y-180" : ""}`}
            >
              
              {/* Card FRONT */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-[#141414] rounded-2xl p-8 flex flex-col justify-between">
                <div className="flex justify-between items-center text-xs font-bold text-indigo-400 uppercase tracking-wide">
                  <span>Card {currentIdx + 1} of {cards.length}</span>
                  {isMastered && (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                      <CheckCircle className="w-3 h-3" /> Mastered
                    </span>
                  )}
                </div>

                <div className="my-auto py-4">
                  <p className="text-xl font-bold text-white leading-snug tracking-tight max-w-md mx-auto">
                    {activeCard.front}
                  </p>
                </div>

                <span className="text-xs text-gray-500 font-medium flex items-center justify-center gap-1.5 hover:text-indigo-400 transition-colors">
                  <RotateCw className="w-3.5 h-3.5" /> Click anywhere to flip
                </span>
              </div>

              {/* Card BACK */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-[#1A1A1A] rounded-2xl p-8 flex flex-col justify-between rotate-y-180">
                <div className="flex justify-between items-center text-xs font-bold text-indigo-400 uppercase tracking-wide">
                  <span>Answer Definition</span>
                  {isMastered && (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                      <CheckCircle className="w-3 h-3" /> Mastered
                    </span>
                  )}
                </div>

                <div className="my-auto py-4 overflow-y-auto max-h-[160px]">
                  <p className="text-base text-gray-200 font-medium leading-relaxed max-w-md mx-auto font-sans">
                    {activeCard.back}
                  </p>
                </div>

                <span className="text-xs text-gray-500 font-medium flex items-center justify-center gap-1.5 hover:text-indigo-400 transition-colors">
                  <RotateCw className="w-3.5 h-3.5" /> Click anywhere to flip back
                </span>
              </div>

            </div>
          </div>

          {/* Mastery Controllers */}
          <div className="flex justify-between gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                markMastery(false);
              }}
              disabled={!isMastered}
              className={`flex-1 py-3 px-4 border rounded-xl text-xs font-bold transition-all ${
                !isMastered
                  ? "bg-[#1A1A1A] border-white/5 text-gray-600 cursor-not-allowed"
                  : "bg-[#141414] border-rose-500/20 text-rose-400 hover:bg-rose-500/10 cursor-pointer"
              }`}
            >
              Needs Review
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                markMastery(true);
              }}
              disabled={isMastered}
              className={`flex-1 py-3 px-4 border rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                isMastered
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-semibold"
                  : "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500"
              }`}
            >
              {isMastered ? "✓ Already Mastered" : "✓ Mark as Mastered"}
            </button>
          </div>

          {/* Card Navigation Controls */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={handlePrev}
              className="p-3 bg-[#141414] hover:bg-white/5 text-gray-300 rounded-full border border-white/5 transition-all cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold text-gray-400">
              {currentIdx + 1} of {cards.length}
            </span>
            <button
              onClick={handleNext}
              className="p-3 bg-[#141414] hover:bg-white/5 text-gray-300 rounded-full border border-white/5 transition-all cursor-pointer shadow-sm"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* CSS details injected for standard 3D flip effects */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
