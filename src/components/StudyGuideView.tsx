import React, { useState } from "react";
import { Edit2, Save, FileText, CheckCircle, HelpCircle } from "lucide-react";
import { Section, NoteSession } from "../types";

interface StudyGuideViewProps {
  session: NoteSession;
  onUpdateNotes: (updatedSession: NoteSession) => void;
}

export default function StudyGuideView({ session, onUpdateNotes }: StudyGuideViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotesText, setEditedNotesText] = useState(session.notesEdited || "");
  const [checkedTakeaways, setCheckedTakeaways] = useState<Record<string, boolean>>({});

  // Initialize edited notes text if empty
  React.useEffect(() => {
    if (!session.notesEdited) {
      // Build standard layout from sections
      const defaultText = session.sections
        .map((s) => `## ${s.heading}\n\n${s.content}\n\n${s.bulletPoints.map((bp) => `• ${bp}`).join("\n")}`)
        .join("\n\n");
      setEditedNotesText(defaultText);
    } else {
      setEditedNotesText(session.notesEdited);
    }
  }, [session]);

  const handleSave = () => {
    onUpdateNotes({
      ...session,
      notesEdited: editedNotesText,
    });
    setIsEditing(false);
  };

  const toggleTakeaway = (sectionIdx: number, bulletIdx: number) => {
    const key = `${sectionIdx}-${bulletIdx}`;
    setCheckedTakeaways((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-8">
      {/* Top Section Summary Banner */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/5 rounded-2xl border border-white/5 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Overarching Study Overview
        </h3>
        <p className="text-gray-300 leading-relaxed font-sans text-base">
          {session.summary}
        </p>
      </div>

      {/* Main Content Layout splits: Left side has interactive guide, right side has editable study notepad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Interactive Sections Guide */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              📖 Modular Study Topics
            </h3>
            <span className="text-xs bg-white/5 text-gray-300 px-2.5 py-1 rounded-full font-semibold">
              {session.sections.length} Topics
            </span>
          </div>

          <div className="space-y-8">
            {session.sections.map((section: Section, sIdx: number) => (
              <div 
                key={sIdx} 
                className="bg-[#141414] rounded-2xl border border-white/5 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h4 className="text-xl font-bold text-white tracking-tight mb-3">
                  {section.heading}
                </h4>
                
                <p className="text-gray-300 leading-relaxed text-sm mb-6 whitespace-pre-line font-sans">
                  {section.content}
                </p>

                {/* Key takeaway checklists */}
                <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-4 space-y-3">
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-indigo-400" /> Active Review Takeaways
                  </h5>
                  <div className="space-y-2.5">
                    {section.bulletPoints.map((bullet: string, bIdx: number) => {
                      const isChecked = checkedTakeaways[`${sIdx}-${bIdx}`];
                      return (
                        <div 
                          key={bIdx}
                          onClick={() => toggleTakeaway(sIdx, bIdx)}
                          className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                            isChecked ? "bg-emerald-500/10 border border-emerald-500/20" : "hover:bg-white/5"
                          }`}
                        >
                          <input 
                            type="checkbox"
                            checked={!!isChecked}
                            onChange={() => {}} // toggled on container div click
                            className="mt-1 h-4 w-4 rounded text-indigo-500 focus:ring-indigo-500 border-white/10 pointer-events-none cursor-pointer"
                          />
                          <span className={`text-sm text-gray-300 select-none leading-normal transition-all ${
                            isChecked ? "line-through text-emerald-400/70 italic" : ""
                          }`}>
                            {bullet}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notepad panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#141414] rounded-2xl border border-white/5 shadow-sm p-6 sticky top-6">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-white text-md flex items-center gap-1.5">
                📝 Custom Student Notes
              </h4>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Text
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
              )}
            </div>

            <p className="text-xs text-gray-400 mb-4 leading-normal">
              Need to add class syllabus dates, textbook page reminders, or personalized annotations? Type them below to customize this study guide.
            </p>

            {isEditing ? (
              <textarea
                value={editedNotesText}
                onChange={(e) => setEditedNotesText(e.target.value)}
                rows={16}
                className="w-full p-4 rounded-xl border border-white/10 bg-[#1A1A1A] text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            ) : (
              <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-4 max-h-[380px] overflow-y-auto font-sans text-sm text-gray-300 whitespace-pre-line leading-relaxed shadow-inner">
                {editedNotesText || "Click 'Edit' above to start typing your personal notes!"}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-gray-500">
              <HelpCircle className="w-4 h-4 text-gray-600" />
              <span>Notes are saved locally inside your browser session.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
