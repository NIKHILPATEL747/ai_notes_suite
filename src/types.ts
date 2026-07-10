export interface KeyConcept {
  term: string;
  definition: string;
}

export interface Section {
  heading: string;
  content: string;
  bulletPoints: string[];
}

export interface CornellNotes {
  cueColumn: string[];
  notesColumn: string[];
  summaryColumn: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  mastered?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  parentId: string | null;
  description: string;
}

export interface NoteSession {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  style: string;
  summary: string;
  sections: Section[];
  keyConcepts: KeyConcept[];
  cornellNotes: CornellNotes;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  mindMapNodes: MindMapNode[];
  createdAt: string;
  favorite?: boolean;
  notesEdited?: string; // If user edits the text notes directly
}
