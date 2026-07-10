import React, { useState } from "react";
import { Check, X, RotateCcw, Award, AlertCircle, ArrowRight, HelpCircle } from "lucide-react";
import { QuizQuestion } from "../types";

interface QuizViewProps {
  quiz: QuizQuestion[];
  savedHighScore?: number;
  onUpdateHighScore: (score: number) => void;
}

export default function QuizView({ quiz, savedHighScore = 0, onUpdateHighScore }: QuizViewProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [history, setHistory] = useState<Array<{ questionIdx: number; selected: string; correct: boolean }>>([]);

  if (!quiz || quiz.length === 0) {
    return (
      <div className="text-center py-12 bg-[#141414] rounded-2xl border border-white/5">
        <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-gray-400 font-medium">No quiz questions available for this session.</p>
      </div>
    );
  }

  const activeQuestion = quiz[currentIdx];

  const handleSelectOption = (option: string) => {
    if (submitted) return;
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || submitted) return;

    const isCorrect = selectedAnswer === activeQuestion.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setHistory((prev) => [
      ...prev,
      { questionIdx: currentIdx, selected: selectedAnswer, correct: isCorrect },
    ]);

    setSubmitted(true);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setSubmitted(false);

    if (currentIdx < quiz.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      // Track highscore
      const finalScore = score + (selectedAnswer === activeQuestion.correctAnswer ? 1 : 0);
      if (finalScore > savedHighScore) {
        onUpdateHighScore(finalScore);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setSubmitted(false);
    setScore(0);
    setQuizFinished(false);
    setHistory([]);
  };

  const getQuizGrade = (numCorrect: number) => {
    const pct = (numCorrect / quiz.length) * 100;
    if (pct === 100) return { label: "A+", feedback: "Incredible mastery! You answered every single question perfectly.", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    if (pct >= 80) return { label: "A", feedback: "Outstanding job! You've got an excellent grasp of these concepts.", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" };
    if (pct >= 60) return { label: "B", feedback: "Great effort! A quick review of the flashcards will get you to a perfect score.", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    return { label: "Need Study", feedback: "Take another look at the Study Guide and Cornell Cues, then try again!", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
  };

  const gradeInfo = getQuizGrade(score);

  return (
    <div className="max-w-2xl mx-auto">
      {quizFinished ? (
        /* Quiz Finished Scorecard */
        <div className="bg-[#141414] rounded-3xl border border-white/5 p-8 text-center space-y-6 shadow-sm">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto border-2 ${gradeInfo.color}`}>
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Practice Quiz Scorecard
            </h4>
            <p className="text-3xl font-extrabold text-white">
              Grade: <span className="text-indigo-400">{gradeInfo.label}</span> ({score} / {quiz.length} Correct)
            </p>
          </div>

          <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
            {gradeInfo.feedback}
          </p>

          <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-4 flex items-center justify-between max-w-xs mx-auto text-xs font-bold text-gray-400">
            <span>High Score for this Session:</span>
            <span className="text-white text-sm font-extrabold bg-[#141414] border border-white/10 px-2 py-0.5 rounded shadow-sm">
              {Math.max(savedHighScore, score)} / {quiz.length}
            </span>
          </div>

          <button
            onClick={resetQuiz}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl text-sm shadow-md hover:shadow-lg hover:shadow-indigo-500/10 transition-all flex items-center gap-2 mx-auto cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Retake Practice Test
          </button>
        </div>
      ) : (
        /* Active Quiz Screen */
        <div className="bg-[#141414] rounded-3xl border border-white/5 p-6 space-y-6 shadow-sm">
          
          {/* Header Progress row */}
          <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-white/5 pb-3">
            <span>Question {currentIdx + 1} of {quiz.length}</span>
            <span className="text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              High Score: {savedHighScore} / {quiz.length}
            </span>
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-white tracking-tight leading-snug">
              {activeQuestion.question}
            </h4>
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {activeQuestion.options.map((option: string, oIdx: number) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOpt = option === activeQuestion.correctAnswer;
              
              let optStyle = "bg-[#1A1A1A] hover:bg-white/5 border-white/5 text-gray-300";
              let badge = null;

              if (submitted) {
                if (isCorrectOpt) {
                  optStyle = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-medium";
                  badge = <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
                } else if (isSelected) {
                  optStyle = "bg-rose-500/10 border-rose-500/30 text-rose-400";
                  badge = <X className="w-4 h-4 text-rose-400 flex-shrink-0" />;
                } else {
                  optStyle = "bg-[#141414] border-white/5 text-gray-600 opacity-40";
                }
              } else if (isSelected) {
                optStyle = "bg-indigo-500/10 border-indigo-500/30 text-white font-semibold shadow-sm";
              }

              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  disabled={submitted}
                  className={`w-full text-left p-4.5 rounded-xl border flex items-center justify-between text-sm transition-all ${
                    !submitted ? "cursor-pointer" : ""
                  } ${optStyle}`}
                >
                  <span className="leading-normal">{option}</span>
                  {badge}
                </button>
              );
            })}
          </div>

          {/* Prompt description details */}
          {submitted && (
            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-4 space-y-2 animate-fade-in">
              <span className="text-xs font-bold text-indigo-400 flex items-center gap-1 uppercase tracking-wide">
                <HelpCircle className="w-3.5 h-3.5" /> Academic Review Explanation
              </span>
              <p className="text-xs text-indigo-200/90 font-medium leading-relaxed font-sans">
                {activeQuestion.explanation}
              </p>
            </div>
          )}

          {/* Action Footer Button */}
          <div className="pt-4 border-t border-white/5 flex justify-end">
            {!submitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="bg-indigo-600 hover:bg-indigo-50 disabled:bg-[#1A1A1A] disabled:text-gray-600 disabled:border-white/5 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl text-sm shadow-md hover:shadow-lg hover:shadow-indigo-500/10 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl text-sm shadow-md hover:shadow-lg hover:shadow-indigo-500/10 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {currentIdx < quiz.length - 1 ? (
                  <>
                    Next Question <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  "Finish practice test"
                )}
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
